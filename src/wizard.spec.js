import React from 'react';
import { mount } from 'enzyme';

import Wizard from './wizard';

test('all children get cloned', () => {
  const wizard = setup();

  expect(wizard.find(TestStep)).toHaveLength(3);
});

function buttonSelector(stepId = "step-1", buttonSel = "next-button") {
  return `[data-test="${stepId}"] [data-test="${buttonSel}"]`;
}

describe('completing a step', () => {
  test('the step is appended to the completed steps when previously incomplete', () => {
    const wizard = setup();

    wizard.find(buttonSelector()).hostNodes().simulate('click');

    expect(wizard.state('completedSteps')).toHaveLength(1);
  });

  test('the step is not appended to the completed steps when it was previously complete', () => {
    const wizard = setup();

    wizard.find(buttonSelector()).hostNodes().simulate('click');
    wizard.find(buttonSelector('step-2', 'save-and-next-button')).hostNodes().simulate('click');

    setTimeout(() => {
      wizard.find(buttonSelector('step-2', 'edit-button')).hostNodes().simulate('click');
    }, 1);

    setTimeout(() => {
      wizard.find(buttonSelector('step-2', 'save-and-next-button')).hostNodes().simulate('click');
      expect(wizard.state('completedSteps')).toHaveLength(2);
    }, 1);
  });

  test('when a step fails to persist, it gets put into an error state', () => {
    const wizard = setup({}, true);

    wizard.find(buttonSelector()).hostNodes().simulate('click');
    wizard.find(buttonSelector('step-2', 'save-and-next-button')).hostNodes().simulate('click');

    setTimeout(() => {
      wizard.find(buttonSelector('step-3', 'save-and-next-button')).hostNodes().simulate('click');
      expect(wizard.find(Wizard.Step).at(2).state('hasError')).toBe(true);
    }, 1);
  });

  test('when there is a next step, it does not invoke the completeWizard function prop', () => {
    const onComplete = jest.fn();
    const wizard = setup({ completeWizard: onComplete });

    wizard.find(buttonSelector()).hostNodes().simulate('click');

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('when there is no next step, it will invoke the completeWizard function prop', () => {
    const onComplete = jest.fn();
    const wizard = setup({ completeWizard: onComplete });

    wizard.find(buttonSelector()).hostNodes().simulate('click');

    wizard.find(buttonSelector('step-2', 'save-and-next-button')).hostNodes().simulate('click');

    setTimeout(() => {
      wizard.find(buttonSelector('step-3', 'save-and-next-button')).hostNodes().simulate('click');
      expect(onComplete).toHaveBeenCalledTimes(1);
    }, 1);
  });
});

describe('passed props', () => {
  let wizard;

  beforeEach(() => {
    wizard = setup();
  });

  function validateProp(index, propName, expectedValue) {
    expect(
      wizard
        .find(Wizard.Step)
        .at(index)
        .prop(propName)
    ).toBe(expectedValue);
  }

  test('isActive is passed as true when the step matches the active step', () => {
    validateProp(0, 'isActive', true);
  });

  test('isActive is passed as false when the step does not match the active step', () => {
    validateProp(1, 'isActive', false);
  });

  test('isComplete is passed as true when the step is already completed', () => {
    wizard.find(buttonSelector()).hostNodes().simulate('click');
    validateProp(0, 'isComplete', true);
  });

  test('isComplete is passed as false when the step is not completed', () => {
    validateProp(0, 'isComplete', false);
  });
});

test('model can be updated on an instance', () => {
  const model = {};
  const wizard = setup({ model });

  wizard.instance().updateModel({ test: 'works' });

  expect(wizard.state('model')).toEqual({ test: 'works' });
});

/* eslint-disable react/prop-types */
function TestStep({ id }) {
  return <p>Hello {id}</p>;
}

function makePersistor(shouldFail = false) {
  return model => {
    if (shouldFail) {
      return Promise.reject();
    }
    return Promise.resolve();
  }
}

function setup(props, failLastStep = false) {
  return mount(
    <Wizard {...props}>
      <Wizard.Step isPersistent={false} id="step-1" render={({ stepId }) => <TestStep id={stepId} />} />
      <Wizard.Step id="step-2" persist={makePersistor()} render={({ stepId }) => <TestStep id={stepId} />} />
      <Wizard.Step id="step-3" persist={makePersistor(failLastStep)} render={({ stepId }) => <TestStep id={stepId} />} />
    </Wizard>
  );
}

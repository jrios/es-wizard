import React from 'react';
import { mount } from 'enzyme';
import { Button } from 'es-components';
import toJson from 'enzyme-to-json';

import { Step } from './step';

test('passes id to render prop', () => {
  const wrapper = setup();
  expect(wrapper.find('#test-child')).toHaveLength(1);
});

describe('button configurations', () => {
  test('displays only next button when not isComplete and not isPersistent', () => {
    const wrapper = setup({ isPersistent: false });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(1);
    expect(buttons.at(0).prop('data-test')).toBe('next-button');
  });

  test('displays no buttons when isComplete and not isPersistent', () => {
    const wrapper = setup({ isComplete: true, isPersistent: false });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(0);
  });

  test('displays only Save and Next button when not isComplete and isPersistent', () => {
    const wrapper = setup();

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(1);
    expect(buttons.at(0).prop('data-test')).toBe('save-and-next-button');
  });

  test('displays Save and Next and Cancel buttons when isComplete and isPersistent and isEditing', () => {
    const wrapper = setup({ isComplete: true });
    wrapper.setState({ isEditing: true });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).prop('data-test')).toBe('save-and-next-button');
    expect(buttons.at(1).prop('data-test')).toBe('cancel-button');
  });

  test('displays only Edit button when isComplete and isPersistent and not isEditing', () => {
    const wrapper = setup({ isComplete: true });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(1);
    expect(buttons.at(0).prop('data-test')).toBe('edit-button');
  });
});

describe('step overlay', () => {
  test('overlay display is "none" when incomplete', () => {
    const wrapper = setup();

    const overlay = wrapper.find('[data-test="overlay"]').hostNodes();

    expect(toJson(overlay)).toHaveStyleRule('display', 'none');
  });

  test('overlay display is "block" when isComplete and not isEditing', () => {
    const wrapper = setup({ isComplete: true });

    const overlay = wrapper.find('[data-test="overlay"]').hostNodes();

    expect(toJson(overlay)).toHaveStyleRule('display', 'block');
  });

  test('overlay display is "none" when isComplete and isEditing', () => {
    const wrapper = setup({ isComplete: true });
    wrapper.setState({ isEditing: true });

    const overlay = wrapper.find('[data-test="overlay"]').hostNodes();

    expect(toJson(overlay)).toHaveStyleRule('display', 'none');
  });
});

describe('when a step is rendered', () => {
  test('sets display to "none" when it receives the default values for isActive and isComplete', () => {
    const wrapper = setup();

    const step = wrapper.find('[data-test="test"]').hostNodes();
    expect(toJson(step)).toHaveStyleRule('visibility', 'hidden');
  });

  test('sets display to "block" when isActive', () => {
    const wrapper = setup({ isActive: true });

    const step = wrapper.find('[data-test="test"]').hostNodes();

    expect(toJson(step)).toHaveStyleRule('visibility', 'visible');
  });

  test('sets display to "block" when isComplete', () => {
    const wrapper = setup({ isComplete: true });

    const step = wrapper.find('[data-test="test"]').hostNodes();

    expect(toJson(step)).toHaveStyleRule('visibility', 'visible');
  });
});

function setup(props) {
  return mount(
    <Step
      id="test"
      {...props}
      render={({ stepId }) => <div id={`${stepId}-child`}>Hello</div>}
    />
  );
}

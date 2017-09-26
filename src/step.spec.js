import React from 'react';
import { mount } from 'enzyme';
import { Button } from 'es-components';

import Step from './step';

test('can render a child with the id passed to it', () => {
  const wrapper = setup();

  expect(wrapper.find('#test-child')).toHaveLength(1)
});

describe('button configurations', () => {
  test('displays only next button when not complete and not persistent', () => {
    const wrapper = setup({ persistent: false });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(1);
    expect(buttons.at(0).prop('id')).toBe('test-next-button');
  });

  test('displays no buttons when complete and not persistent', () => {
    const wrapper = setup({ complete: true, persistent: false });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(0);
  });

  test('displays only Save and Next button when not complete and persistent', () => {
    const wrapper = setup();

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(1);
    expect(buttons.at(0).prop('id')).toBe('test-save-and-next-button');
  });

  test('displays Save and Next and Cancel buttons when complete and persistent and editing', () => {
    const wrapper = setup({ complete: true });
    wrapper.setState({ editing: true });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).prop('id')).toBe('test-save-and-next-button');
    expect(buttons.at(1).prop('id')).toBe('test-cancel-button');
  });

  test('displays only Edit button when complete and persistent and not editing', () => {
    const wrapper = setup({ complete: true });

    const buttons = wrapper.find(Button);

    expect(buttons).toHaveLength(1);
    expect(buttons.at(0).prop('id')).toBe('test-edit-button');
  });
});

describe('step overlay', () => {
  test('overlay is hidden when incomplete', () => {
    const wrapper = setup();

    const overlay = wrapper.find('#test-overlay');

    expect(overlay.prop('display')).toBe(false);
  });

  test('overlay is displayed when complete and not editing', () => {
    const wrapper = setup({ complete: true });

    const overlay = wrapper.find('#test-overlay');

    expect(overlay.prop('display')).toBe(true);
  });

  test('overlay is hidden when complete and editing', () => {
    const wrapper = setup({ complete: true });
    wrapper.setState({ editing: true });

    const overlay = wrapper.find('#test-overlay');

    expect(overlay.prop('display')).toBe(false);
  });
});


describe('when a step is rendered', () => {
  test('sets display to false when it receives the default values for active and complete', () => {
    const wrapper = setup();

    const step = wrapper.find('#test');

    expect(step.prop('display')).toBe(false);
  });

  test('sets display to true when active', () => {
    const wrapper = setup({ active: true });

    const step = wrapper.find('#test');

    expect(step.prop('display')).toBe(true);
  });

  test('sets display to true when complete', () => {
    const wrapper = setup({ complete: true });

    const step = wrapper.find('#test');

    expect(step.prop('display')).toBe(true);
  });
});

function setup(props) {
  return mount(
    <Step id="test" {...props}>
      {({ stepId }) => <div id={`${stepId}-child`}>Hello</div>}
    </Step>
  );
}

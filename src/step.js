import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import noop from 'lodash.noop';

import { Button } from 'es-components';

const StepWrapper = styled.section`
  display: ${props => props.display ? 'block' : 'none'};
  margin-bottom: 60px;
`;

const Overlay = styled.div`
  background-color: #000;
  display: ${props => props.display ? 'block' : 'none'};
  opacity: 0.1;
  position: absolute;
  z-index: 2;
`;

const StepContent = styled.div`
  border-bottom: 2px solid black;
  overflow: auto;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 20px;
`;

const WizardButton = styled(Button)`
  margin-left: 20px;
`;

function StepButtons({ buttonConfigurations }) {
  return (
    <ButtonWrapper>
      {buttonConfigurations.map(config => {
         const props = {
           handleOnClick: config.onClick,
           styleType: config.styleType || 'default',
           id: config.id
         };
         return <WizardButton key={config.id} {...props}>{config.text}</WizardButton>;
      })}
    </ButtonWrapper>
  );
}

export default class Step extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    active: PropTypes.bool,
    complete: PropTypes.bool,
    completeStep: PropTypes.func,
    render: PropTypes.func
  }

  static defaultProps = {
    persistent: true,
    active: false,
    complete: false,
    completeStep: noop,
    modelSelector: noop,
    render: noop
  }

  state = {
    editing: false,
    complete: this.props.complete
  }

  componentDidMount() {
    window.addEventListener('resize', this.setCalculatedOverlay);
    this.setCalculatedOverlay();
  }

  componentDidUpdate() {
    this.setCalculatedOverlay();
  }

  setStepContentElement = ref => {
    this.stepContent = ref;
  }

  setOverlayElement = ref => {
    this.stepOverlay = ref;
  }

  setCalculatedOverlay = () => {
    const stepContentElement = this.stepContent;
    const style = window.getComputedStyle(stepContentElement);

    const overlay = this.stepOverlay;

    overlay.style.height = style.getPropertyValue('height');
    overlay.style.width = style.getPropertyValue('width');
  }

  getNextButtonProps = () => {
    return {
      id: `${this.props.id}-next-button`,
      styleType: 'primary',
      text: 'Next',
      onClick: this.completeStep
    };
  }

  getSaveAndNextButtonProps = () => {
    return {
      id: `${this.props.id}-save-and-next-button`,
      styleType: 'primary',
      text: 'Save & Next',
      onClick: this.completeStep
    };
  }

  completeStep = () => {
    this.setState(() => ({ complete: true, editing: false }));
    this.props.completeStep();
  }

  getEditButtonProps = () => {
    return {
      id: `${this.props.id}-edit-button`,
      text: 'Edit',
      onClick: this.toggleEditState
    }
  }

  getCancelButtonProps = () => {
    return {
      id: `${this.props.id}-cancel-button`,
      text: 'Cancel',
      onClick: this.toggleEditState
    }
  }

  toggleEditState = () => {
    this.setState(({ editing }) => ({ editing: !editing }))
  }

  getButtonConfigurations = () => {
    const { persistent, complete } = this.props;
    const { editing } = this.state;
    let buttonProps = [];
    if (persistent) {
      if (!complete || complete && editing) {
        buttonProps = [...buttonProps, this.getSaveAndNextButtonProps()];
      }
      if (complete && !editing) {
        buttonProps = [...buttonProps, this.getEditButtonProps()];
      }
      if (complete && editing) {
        buttonProps = [...buttonProps, this.getCancelButtonProps()];
      }
    } else {
      buttonProps = complete ? buttonProps : [this.getNextButtonProps()];
    }

    return buttonProps;
  }

  updateModel = updater => {
    this.props.updateModel(updater(this.props.model));
  }

  render() {
    const { id, active, complete, render } = this.props;
    const { editing } = this.state;
    const displayStep = active || complete;
    const displayOverlay = complete && !editing;

    const childProps = {
      stepId: id,
      disabled: displayOverlay,
      model: this.props.modelSelector(this.props.model),
      update: this.updateModel
    };

    return (
      <StepWrapper className="wizard-step" id={id} display={displayStep}>
        <Overlay innerRef={this.setOverlayElement} id={`${id}-overlay`} display={displayOverlay} />
        <StepContent innerRef={this.setStepContentElement} id={`${id}-content`}>
          {render(childProps)}
        </StepContent>
        {<StepButtons buttonConfigurations={this.getButtonConfigurations()} />}
      </StepWrapper>
    );
  }
}

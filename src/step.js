import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import noop from 'lodash.noop';

import { Button } from 'es-components';

const StepWrapper = styled.section`
  margin-bottom: 60px;
  visibility: ${props => (props.shouldDisplay ? 'visible' : 'hidden')};
`;

const Overlay = styled.div`
  background-color: #000;
  display: ${props => (props.shouldDisplay ? 'block' : 'none')};
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

const WizardButton = styled(Button)`margin-left: 20px;`;

export class Step extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    model: PropTypes.object,
    modelSelector: PropTypes.func,
    isPersistent: PropTypes.bool,
    isActive: PropTypes.bool,
    isComplete: PropTypes.bool,
    completeStep: PropTypes.func,
    updateModel: PropTypes.func,
    persist: PropTypes.func,
    render: PropTypes.func
  };

  static defaultProps = {
    isPersistent: true,
    isActive: false,
    isComplete: false,
    completeStep: noop,
    model: {},
    modelSelector: noop,
    updateModel: noop,
    persist: noop,
    render: noop
  };

  state = {
    isEditing: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.setCalculatedOverlay);
    this.setCalculatedOverlay();
  }

  componentDidUpdate() {
    this.setCalculatedOverlay();
  }

  setStepContentElement = ref => {
    this.stepContent = ref;
  };

  setOverlayElement = ref => {
    this.stepOverlay = ref;
  };

  setCalculatedOverlay = () => {
    const stepContentElement = this.stepContent;
    const style = window.getComputedStyle(stepContentElement);

    const overlay = this.stepOverlay;

    overlay.style.height = style.getPropertyValue('height');
    overlay.style.width = style.getPropertyValue('width');
  };

  getNextButtonProps = () => {
    return {
      ['data-test']: `next-button`,
      styleType: 'primary',
      text: 'Next',
      onClick: this.props.completeStep
    };
  };

  saveEditedStep = () => {
    this.setState(() => ({ isEditing: false }));
    this.props.completeStep();
  };

  getSaveAndNextButtonProps = () => {
    function save() {
      this.props.persist(this.props.model)
        .then(() => {
          this.state.isEditing ? this.saveEditedStep() : this.props.completeStep();
        }).catch(reason => {
          this.setState({ hasError: true, errorMessage: reason });
        });
    };

    return {
      ['data-test']: `save-and-next-button`,
      styleType: 'primary',
      text: 'Save & Next',
      onClick: save.bind(this)
    };
  };

  getEditButtonProps = () => {
    return {
      ['data-test']: `edit-button`,
      text: 'Edit',
      onClick: this.toggleEditState
    };
  };

  getCancelButtonProps = () => {
    return {
      ['data-test']: `cancel-button`,
      text: 'Cancel',
      onClick: this.toggleEditState
    };
  };

  toggleEditState = () => {
    this.setState(({ isEditing }) => ({ isEditing: !isEditing }));
  };

  getButtonConfigurations = () => {
    const { isPersistent, isComplete } = this.props;
    const { isEditing } = this.state;
    let buttonProps = [];
    if (isPersistent) {
      if (!isComplete || (isComplete && isEditing)) {
        buttonProps = [...buttonProps, this.getSaveAndNextButtonProps()];
      }
      if (isComplete && !isEditing) {
        buttonProps = [...buttonProps, this.getEditButtonProps()];
      }
      if (isComplete && isEditing) {
        buttonProps = [...buttonProps, this.getCancelButtonProps()];
      }
    } else {
      buttonProps = isComplete ? buttonProps : [this.getNextButtonProps()];
    }

    return buttonProps;
  };

  updateModel = updater => {
    this.props.updateModel(updater(this.props.model));
  };

  render() {
    const { id, isActive, isComplete, render } = this.props;
    const { isEditing } = this.state;
    const displayStep = isActive || isComplete;
    const displayOverlay = isComplete && !isEditing;

    const childProps = {
      stepId: id,
      disabled: displayOverlay,
      model: this.props.modelSelector(this.props.model),
      update: this.updateModel
    };

    return (
      <StepWrapper
        className="wizard-step"
        data-test={id}
        shouldDisplay={displayStep}
      >
        <Overlay
          innerRef={this.setOverlayElement}
          data-test="overlay"
          shouldDisplay={displayOverlay}
        />
        <StepContent innerRef={this.setStepContentElement} data-test="content">
          {render(childProps)}
        </StepContent>
        <ButtonWrapper>
          {this.getButtonConfigurations().map(config => {
            const buttonProps = {
              handleOnClick: config.onClick,
              styleType: config.styleType || 'default',
              ['data-test']: config['data-test']
            };
            return (
              <WizardButton key={config['data-test']} {...buttonProps}>
                {config.text}
              </WizardButton>
            );
          })}
        </ButtonWrapper>
      </StepWrapper>
    );
  }
}

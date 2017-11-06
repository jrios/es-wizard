import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Advancer from 'react-advancer';
import noop from 'lodash.noop';
import { Step } from './step';

export default class Wizard extends Component {
  static propTypes = {
    model: PropTypes.object,
    completeWizard: PropTypes.func,
    children: (props, propName) => {
      const areNotAllSteps = props[propName].some(child => child.type !== Step);
      if (areNotAllSteps) {
        throw Error(
          "Invalid child passed to Wizard. Use Wizard.Step to define a Wizard's step."
        );
      }
    }
  };

  static defaultProps = {
    completeWizard: noop
  };

  static Step = Step;

  state = {
    completedSteps: [],
    model: this.props.model,
    complete: false
  };

  updateModel = model => {
    this.setState(previousState =>
      Object.assign({}, previousState, {
        model: Object.assign({}, previousState.model, model)
      })
    );
  };

  completeWizard = step => {
    return () => {
      const stepId = step.props.id;
      if (!this.state.completedSteps.includes(stepId)) {
        this.setState(previousState => ({
          completedSteps: [...previousState.completedSteps, stepId]
        }));
      }
      this.props.completeWizard();
    };
  };

  createCompleteStep = (step, onStepComplete) => {
    return () => {
      const stepId = step.props.id;
      if (!this.state.completedSteps.includes(stepId)) {
        this.setState(previousState => ({
          completedSteps: [...previousState.completedSteps, stepId]
        }));
        onStepComplete();
      }
    };
  };

  render() {
    const { model } = this.state;
    const steps = React.Children.toArray(this.props.children);
    return (
      <Advancer
        steps={steps}
        stepSelector={step => step.props.id}
        render={({ getSteps, getStepActions }) => {
          const { activeStep, nextStep } = getSteps();
          const { activateNextStep } = getStepActions();
          return (
            <div>
              {steps.map(step => {
                const stepIdentifier = step.props.id;
                const isActive = stepIdentifier === activeStep.props.id;
                const { completedSteps } = this.state;
                const isComplete = completedSteps.includes(stepIdentifier);
                const completeStep =
                  nextStep !== undefined
                    ? this.createCompleteStep(step, activateNextStep)
                    : this.completeWizard(step);
                const stepProps = {
                  key: stepIdentifier,
                  isActive,
                  model,
                  isComplete,
                  completeStep,
                  updateModel: this.updateModel
                };

                return React.cloneElement(step, stepProps);
              })}
            </div>
          );
        }}
      />
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Progression from 'react-progression';

export default class Wizard extends Component {
  static propTypes = {
    model: PropTypes.object,
    stepSelector: PropTypes.func.isRequired
  }

  state = {
    model: this.props.model
  }

  updateModel = model => {
    this.setState(previousState => ({ model: Object.assign({}, previousState.model, model) }));
  }

  // Progression todo: allow initial step index as prop, pass along next step, current step, and previous step
  // maybe do this. track the complete steps in wizard and change Progression to only manage next, current, and previous step
  createCompleteWizardStep(createCompleteStep) {
    return step => {
      return createCompleteStep(step);
    }
  }

  render() {
    const { model } = this.state;
    const steps = React.Children.toArray(this.props.children);

    return (
      <Progression steps={steps}>
        {({ steps, completedSteps, currentStep, createCompleteStep }) => (
          <div>
            {steps.map(step => {
               const { stepSelector } = this.props;
               const stepIdentifier = stepSelector(step);
               const active = stepIdentifier === stepSelector(currentStep);
               const complete = completedSteps.map(stepSelector).includes(stepIdentifier);
               const stepProps = {
                 active,
                 complete,
                 completeStep: this.createCompleteWizardStep(createCompleteStep(step)),
                 model,
                 updateModel: this.updateModel
               };
               return React.cloneElement(step, stepProps);
            })}
          </div>
        )}
      </Progression>
    );
  }
}

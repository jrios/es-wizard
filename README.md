## ES Wizard

This is a compound component for building a Wizard workflow.

### Installation

`npm install -S es-wizard`

### Usage

````jsx
function MyApp() {
   const model = {
    stepOne: {
      fruits: ['Banana', 'Apple', 'Strawberries']
    },
    stepTwo: {
      name: "Jake",
      age: "28"
    }
  };

  return (
    <Wizard
      model={model}
      completeWizard={() => console.log('All done!')}
    >
      <Wizard.Step
        id="step1"
        modelSelector={wizardModel => wizardModel.stepOne}
        isPersistent={false}
        render={({ stepModel }) => {
          return (
            <div>
              <h3>Fruits</h3>
              <ul>
                {stepModel.fruits.map(fruit => <li>{fruit}</li>)}
              </ul>
            </div>
          );
        }} 
      />
      <Wizard.Step
        id="step2"
        modelSelector={wizardModel => wizardModel.stepTwo}
        persist={model => {
          console.log(model);
          return Promise.resolve();
        }}
        render={({ stepModel, update }) => {
          return (
            <div>
              <label htmlFor="name">Name</label>
              <input 
                id={name}
                onChange={event => update(wizardModel => {
                  wizardModel.stepTwo.name = event.target.value;
                  return stepModel;
                })}
                defaultValue={stepModel.name} type="text" 
              />
    
              <p><strong>{stepModel.name}</strong> is {stepModel.age} years old</p>
            </div>
          );
        }} 
      />
        <Wizard.Step
        id="step3"
        isPersistent={false}
        modelSelector={wizardModel => wizardModel.stepTwo}
        render={({ stepModel }) => {
          return (
            <div>
              <p><strong>{stepModel.name}</strong> is {stepModel.age} years old</p>
            </div>
          );
        }} 
      />
    </Wizard>
  );
}
````

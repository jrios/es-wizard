## ES Wizard

This is a compound component for building a Wizard workflow.

### Installation

`npm install -S es-wizard`

### Usage

````jsx
const model = {
  stepOne: {
    fruits: ['Banana', 'Apple', 'Strawberries']
  }
  stepTwo: {
    name: "Jake",
    age: "28"
  }
};

<Wizard
  model={model}
  completeWizard={() => console.log('All done!')}
>
  <Wizard.Step
    id="step1"
    modelSelector={model => model.stepOne}
    isPersistent={false}
    render={({ model }) => {
      return (
        <div>
          <h3>Fruits</h3>
          <ul>
            {model.fruits.map(fruit => <li>{fruit}</li>)}
          </ul>
        </div>
      );
    }} 
  />
  <Wizard.Step
    id="step2"
    modelSelector={model => model.stepTwo}
    persist={model => {
      console.log(model);
      return Promise.resolve();
    }}
    render={({ model, update }) => {
      return (
        <div>
          <label htmlFor="name">Name</label>
          <input 
            id={name}
            onChange={event => update(model => {
              model.stepTwo.name = event.target.value;
              return model;
            })}
            defaultValue={model.name} type="text" 
          />

          <p><strong>{model.name}</strong> is {model.age} years old</p>
        </div>
      );
    }} 
  />
</Wizard>
````

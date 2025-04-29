import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

export class Car extends React.Component {
  render() {
    return <li>I am a {this.props.brand}</li>;

    // return <h2>Hi, I am a Car! {this.props.title}</h2>;
    // const shoot = (x) => {
    //   alert(this.props.message + x);
    // }
    // return (
    //   <button onClick={() => shoot("Goal!")}>Take the shot!</button>
    // );
  }
}

export function Counter() {
  const [count, setCount] = useState(0);
  const [calculation, setCalculation] = useState(0);

  useEffect(() => {
    setCalculation(() => count * 2);
  }, [calculation, count]); // <- add the count variable here

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <p>Calculation: {calculation}</p>
    </>
  );
}


export function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  });

  return <h1>I've rendered {count} times!</h1>;
}

export function MyForm() {
  const [name, setName] = useState("");
  const [inputs, setInputs] = useState({});
  const [textarea, setTextarea] = useState("");
  const [myCars, setMyCars] = useState("Volvo");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
    // setInputs(values => console.log(values));

    setName(value);
    setTextarea(value);
    setMyCars(value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // alert(`The name you entered was: ${myCars}`);
    console.log(inputs);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={textarea} onChange={handleChange} />

      <select name="select" value={myCars} onChange={handleChange}>
        <option value="Ford">Ford</option>
        <option value="Volvo">Volvo</option>
        <option value="Fiat">Fiat</option>
      </select>

      <label>Enter your name:
        <input
          type="text"
          // value={name}
          name="userid"
          value={inputs.userid || ""}
          onChange={handleChange} />
      </label>
      <label>Enter your age:
        <input
          type="number"
          name="age"
          value={inputs.age || ""}
          onChange={handleChange}
        />
      </label>
      <input type="submit" />
    </form>
  )
}

export function Garage(props) {
  return (
    <>
      <h1>Garage</h1>
      {props.cars.length > 0 &&
        // <h2>
        //   You have {props.cars.length} cars in your garage.
        // </h2>
        <ul>
          {props.cars.map((car) => <Car brand={car} />)}
        </ul>
      }
    </>
  );
}


function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Modify <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

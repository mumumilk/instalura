import React, { Component } from 'react';
import './css/reset.css';
import Timeline from './components/Timeline';
import Header from './components/Header';


class App extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    return (
      <div>
        <Header/>
        <Timeline/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './css/reset.css';
import Timeline from './components/Timeline';
import Header from './components/Header';

import TimelineStore from './logica/TimelineStore';


class App extends Component {
  timelineStore = new TimelineStore([]);

  render() {
    return (
      <div>
        <Header/>
        <Timeline store={this.timelineStore}/>
      </div>
    );
  }
}

export default App;

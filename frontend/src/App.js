import React from 'react';
import { Route } from 'react-router-dom'

import './App.css';
import Login from './components/public/Login';
import Register from './components/public/Register';
import Home from './components/protected/Home';
import Account from './components/protected/Account';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
      <Route path="/account" component={Account} />
    </div>
  );
}

export default App;

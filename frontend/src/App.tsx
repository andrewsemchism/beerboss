import React from 'react';
import logo from './logo.svg';
import DataConnectionTest from './components/DataConnectionTest/DataConnectionTest';
import CustomNav from './components/CustomNav/CustomNav';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <CustomNav/>
      <DataConnectionTest/>
    </div>
  );
}

export default App;

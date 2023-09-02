import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import CustomNav from './components/CustomNav/CustomNav';
import All from './components/All/All';
import Value from './components/Value/Value';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <CustomNav/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/all" element={<All/>} />
          <Route path="/value" element={<Value/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

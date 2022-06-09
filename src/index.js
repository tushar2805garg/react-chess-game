import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Front from "./Front";
import Computer from "./Computer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
 function Routing() {
    return (
        <Router>
          <Routes>
            <Route exact path="/" element={<Front/>}/>
            <Route exact path="/computer" element={<Computer/>}/>
          </Routes>
      </Router>
    );
  }
  ReactDOM.render(
    <React.StrictMode>
      <Routing />
    </React.StrictMode>,
    document.getElementById('root')
  );






  
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<Game />);

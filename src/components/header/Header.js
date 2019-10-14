import React from 'react';
import './Header.css';

const Header = (props) => (
  <header className="App-header">
    <h2>{props.text}</h2>
  </header>
);

export default Header;

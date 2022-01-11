import React from 'react';
import logo from './logo.svg';
import { Container } from './components/Container';
import { Header } from './components/Header';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectData
} from './app/dataSlice';

function App() {
  const data = useSelector(selectData);
  return (
    <div className="App">
      <Header>这是 header</Header>
      <Container data={data} depth={0} />
    </div>
  );
}

export default App;

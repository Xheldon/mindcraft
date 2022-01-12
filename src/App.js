import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Container } from './components/Container';
import { Header } from './components/Header';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectData,
  unHighlightAll
} from './app/dataSlice';

function App() {
  const data = useSelector(selectData);
  const dispatch = useDispatch();
  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (e.target.closest && !e.target.closest('[type="card"]')) {
        dispatch(unHighlightAll());
      }
    });
  }, []);
  return (
    <div className="App">
      <Header>这是 header</Header>
      <Container data={data} depth={0} />
    </div>
  );
}

export default App;

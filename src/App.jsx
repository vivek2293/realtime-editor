import React from 'react';
import { Toaster } from 'react-hot-toast';
import FileForm from './FileForm';
import './App.css';


function App() {
  return (
    <React.Fragment>
      <Toaster position="top-right" reverseOrder={false} />
      <FileForm />
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactList from './screens/ContactList';
import DetailContact from './screens/DetailContact';
import AddContact from './screens/AddContact';
import EditContact from './screens/EditContact';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={ContactList} />
        <Route path="/:id" Component={DetailContact} />
        <Route path="/add" Component={AddContact} />
        <Route path="/edit/:id" Component={EditContact} />
.      </Routes>
    </Router>
  );
}

export default App;

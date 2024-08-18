// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DogList from './components/DogList';
import DogDetail from './components/DogDetails';
import AddDog from './components/AddDog';
import EditDog from './components/EditDog'; // Import the EditDog component

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<DogList />} />
                <Route path="/dogs/:id" element={<DogDetail />} />
                <Route path="/dogs/:id/edit" element={<EditDog />} /> {/* Edit route */}
                <Route path="/add-dog" element={<AddDog />} />
            </Routes>
        </div>
    );
}

export default App;

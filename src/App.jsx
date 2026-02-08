import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Terms from './Terms';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('login');

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="App">
            {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
            {currentPage === 'signup' && <Signup onNavigate={handleNavigate} />}
            {currentPage === 'terms' && <Terms onNavigate={handleNavigate} />}
        </div>
    );
}

export default App;
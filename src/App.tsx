// src/App.tsx
import React from 'react';
import './App.css';
import DataDisplay from './components/DataDisplay';

const App: React.FC = () => {
    const url = 'https://servicios.ine.es/wstempus/js/Es/DATOS_TABLA/28196'; // Replace with your actual API URL
    const cod = 'VGD16981';     // Replace with the COD you want to display

    return (
        <div className="App">
            <header className="App-header">
                <DataDisplay cod={cod} url={url} />
            </header>
        </div>
    );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from "@mui/material/CssBaseline";
import {createMuiTheme, createTheme, ThemeProvider} from "@mui/material";
//import 'bootstrap/dist/css/bootstrap.min.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#3f51b5', // Customize primary color
        },
        secondary: {
            main: '#f50057', // Customize secondary color
        },
        background: {
            default: '#f0f0f0', // Customize default background color
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App/>
        </ThemeProvider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

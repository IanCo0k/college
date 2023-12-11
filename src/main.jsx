import React, {useEffect} from 'react'
import { createRoot } from 'react-dom/client'; // Correct import for createRoot
import App from './App.jsx'
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Profile from './components/Profile.jsx';
import Stats from './components/Stats.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import ReactGA from 'react-ga';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-V0N16ZXFBZ');


const Main = () => {
  useEffect(() => {
    // Track the page view when the component mounts
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <Router>
      <React.StrictMode>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </React.StrictMode>
    </Router>
  );
};

// Correct way to use createRoot
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);

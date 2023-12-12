import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import players from './data/players';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import app from './firebaseConfig'

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);


export default function App() {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [incorrectSchool, setIncorrectSchool] = useState('');
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to choose a random player
  const chooseRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    const selectedPlayer = players[randomIndex];
    setRandomPlayer(selectedPlayer);
  };

  // Automatically select a random player on component mount
  useEffect(() => {
    chooseRandomPlayer();
  }, []);

  // Create an array of unique school values from the players data
  useEffect(() => {
    const uniqueSchools = [...new Set(players.map(player => player.SCHOOL))];
    setSchoolOptions(uniqueSchools);
  }, []);

  const handleInputChange = (e) => {
    setGuess(e.target.value);
    setShowDropdown(true); // Show the dropdown when input changes
  };

  const handleDropdownClick = (option) => {
    setGuess(option);
    setShowDropdown(false); // Hide the dropdown when an option is selected
  };

  const checkGuess = async () => {
    if (randomPlayer && guess.toLowerCase() === randomPlayer.SCHOOL.toLowerCase()) {
      setIsCorrect(true);
      setStreak(streak + 1);
      setShowCorrectMessage(true);
      chooseRandomPlayer();
      setGuess('');
  
      // Check if the user is authenticated
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.displayName); // Assuming user.displayName is unique
  
          // Fetch the existing user data
          const userDocSnap = await getDoc(userDocRef);
          let userData = {};
  
          if (userDocSnap.exists()) {
            userData = userDocSnap.data();
          }
  
          // Update the guesses data
          if (!userData.guesses) {
            userData.guesses = {};
          }
  
          // Increment the count for the guessed school
          const schoolName = randomPlayer.SCHOOL;
          if (userData.guesses[schoolName]) {
            userData.guesses[schoolName]++;
          } else {
            userData.guesses[schoolName] = 1;
          }
  
          // Update the document with the updated data
          await setDoc(userDocRef, userData);
        } catch (error) {
          console.error('Error updating Firestore:', error);
        }
      }
    } else {
      setIsCorrect(false);
      setShowCorrectMessage(false);
      setIncorrectSchool(randomPlayer?.SCHOOL);
  
      // Reset the streak state to 0
      setStreak(0);
    }
  };
  
  
  
  

  const tryAgain = () => {
    window.location.reload();
  };

  const filteredOptions = schoolOptions.filter(
    (option) =>
      option.toLowerCase().indexOf(guess.toLowerCase()) !== -1
  );

  const renderDropdown = () => {
    if (showDropdown && filteredOptions.length > 0) {
      const inputWidth = document.querySelector('.input-container input').offsetWidth; // Get the width of the input element

      return (
        <div
          className="absolute bg-gray-900 rounded w-full mt-2"
          style={{
            width: inputWidth + 'px', // Set the width of the dropdown to match the input
          }}
        >
          {filteredOptions.slice(0, 5).map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-white"
              onClick={() => handleDropdownClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Navbar />
      <div className="flex lg:mt-12 flex-col items-center justify-center py-8">
        <div className="bg-gray-700 border-2 border-blue-200 p-8 rounded-lg shadow-md text-center text-white">
          <h1 className="text-3xl text-blue-200 font-semibold mb-4">Where'd He Go To College?</h1>
          <div className="mb-4">
            <div
              className="bg-cover bg-center w-32 h-32 mx-auto"
              style={{
                backgroundImage: `url(https://cdn.nba.com/logos/nba/${randomPlayer?.TEAM_ID}/primary/L/logo.svg)`, // Use the TEAM_ID property from your player data
              }}
            >
              <img
                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${randomPlayer?.PERSON_ID}.png`}
                alt={`${randomPlayer?.DISPLAY_FIRST_LAST} Headshot`}
                className="rounded-lg shadow-md w-32 mx-auto"
              />
            </div>
          </div>
          <p className="text-3xl text-blue-200 font-bold mb-3">{randomPlayer?.DISPLAY_FIRST_LAST}</p>
          <div className="mb-4 input-container">
            <input
              type="text"
              placeholder="Enter the college name"
              className="px-4 py-2 border rounded-md w-full bg-gray-900 text-white"
              value={guess}
              onChange={handleInputChange}
            />
            {renderDropdown()}
          </div>
          <button
            onClick={checkGuess}
            className="px-4 py-2 bg-blue-200 text-gray-800 rounded-md hover:bg-blue-300 cursor:pointer focus:outline-none"
          >
            Check Guess
          </button>
          {isCorrect === false && (
            <div>
              <p className="text-red-600 mt-4">
                Incorrect. {randomPlayer?.DISPLAY_FIRST_LAST} went to {incorrectSchool}.
              </p>
              <button
                onClick={tryAgain}
                className="px-4 py-2 bg-blue-200 text-gray-800 rounded-md hover:bg-blue-300 cursor:pointer focus:outline-none mt-4"
              >
                Try Again
              </button>
            </div>
          )}
          <p className="text-xl font-semibold mt-4">Streak</p>
          <p className="text-3xl text-blue-200 font-bold">{streak}</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Chart, LinearScale } from 'chart.js/auto'; // Import Chart from 'chart.js/auto'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';

export default function Stats() {
  const [user, setUser] = useState(null);
  const [topStreaks, setTopStreaks] = useState([]);
  const [guessesData, setGuessesData] = useState([]);

  // Initialize Firebase Firestore
  const db = getFirestore();

  Chart.register(LinearScale);

  useEffect(() => {
    // Listen for authentication changes
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchTopStreaks(user);
        fetchGuessesData(user);
      } else {
        setUser(null);
        setTopStreaks([]);
        setGuessesData([]);
      }
    });
  }, []);

  const fetchTopStreaks = async (user) => {
    try {
      const userDisplayName = user.displayName;
      const streaksDocRef = doc(db, 'users', userDisplayName);

      const streaksDocSnap = await getDoc(streaksDocRef);

      if (streaksDocSnap.exists()) {
        const streaksData = streaksDocSnap.data().streaks || [];

        // Sort the streaks in descending order and take the top 5
        const sortedStreaks = streaksData.sort((a, b) => b - a).slice(0, 5);
        setTopStreaks(sortedStreaks);
      } else {
        setTopStreaks([]);
      }
    } catch (error) {
      console.error('Error fetching top streaks:', error);
    }
  };

    const fetchGuessesData = async (user) => {
      try {
        const userDisplayName = user.displayName;
        const guessesDocRef = doc(db, 'users', userDisplayName);

        const guessesDocSnap = await getDoc(guessesDocRef);

        if (guessesDocSnap.exists()) {
          const guessesData = guessesDocSnap.data().guesses || [];

          console.log(guessesData);
         
          setGuessesData(guessesData);
        } else {
          setGuessesData([]);
        }
      } catch (error) {
        console.error('Error fetching guesses data:', error);
      }
    };  
      
  

  // Prepare the data for the pie chart
  const chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          // Add more colors as needed
        ],
      },
    ],
  };
  
  // Assuming guessesData is an object with college names as keys and counts as values
  const guessesDataArray = Object.entries(guessesData).map(([college, count]) => ({
    college,
    count
  }));
  
  // Populate the chartData labels and data arrays
  chartData.labels = guessesDataArray.map((item) => item.college);
  chartData.datasets[0].data = guessesDataArray.map((item) => item.count);
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className='mb-12 text-blue-200 text-3xl font-bold'>Statistics</h1>
        <div className="bg-gray-700 max-w-screen-md w-full flex-col justify-center text-center items-center p-4 rounded shadow-md">
          <h1 className="text-lg font-semibold mb-4">Top 5 Streaks</h1>
          <ul>
            {topStreaks.map((streak, index) => (
              <li key={index} className="bg-blue-200 text-gray-800 p-4 rounded mb-2">
                <span className='text-xl text-left mr-12 text-gray-700'>{index + 1}.</span> <span className='bg-gray-800 text-blue-200 p-2 rounded-full'>{streak}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 mb-4 bg-gray-700 p-4 border-2 border-blue-200">
          <h2 className="text-lg text-center font-semibold mb-4">Guesses Data</h2>
          <div className="max-w-screen-md mx-auto">
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>

  );
}

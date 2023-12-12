import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  // Listen for changes in the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <nav className="relative sm:mr-12 sm:ml-12 px-4 py-4 flex justify-between items-center">
      <Link to="/" className="text-sm sm:text-3xl font-bold leading-none">
        <img src={logo} className='w-8 inline-block' alt="" />
        <span className='hidden ml-3 text-blue-200'>College Where?</span>
      </Link>
      {user ? (
        <div className="lg:inline-block lg:ml-auto">
          <div className="relative">
            <img
              src={user.photoURL || '/default-profile-image.png'}
              alt="User Profile"
              className="w-10 h-10 border-2 border-blue-200 rounded-full cursor-pointer"
              onClick={toggleMenu}
            />
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-lg">
                <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Home</Link>
                <Link to="/stats" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">View Stats</Link>
                <button onClick={handleSignOut} className="block px-4 w-full text-left py-2 text-gray-800 hover:bg-gray-200">Logout</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <Link to="/signin" className=" lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200">Sign In</Link>
          <Link to="/signup" className=" lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200">Sign up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;

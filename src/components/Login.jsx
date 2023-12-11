import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import app from '../firebaseConfig';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = () => {


    const location = useLocation();

    useEffect(() => {
      ReactGA.pageview(location.pathname + location.search);
    }, [location]);

    const auth = getAuth(app);
    const navigate = useNavigate();
    const [username, setUsername] = useState(''); // Change to username
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value); // Change to username
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            // Sign in with username and password
            await signInWithEmailAndPassword(auth, username, password); // Change to username
            console.log('User signed in with username and password');
            navigate('/');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSignInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            console.log('User signed in with Google');
            navigate('/');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md bg-gray-700 p-8 rounded w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-200">Sign in to your <span className='text-blue-400 italic'>College Where?</span> account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only"> {/* Change to username */}
                                Email
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username" // Change to username
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-800 border-blue-200 placeholder-gray-500 text-blue-200 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email" // Change to username
                                value={username} // Change to username
                                onChange={handleUsernameChange} // Change to username
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none  rounded-none relative block w-full px-3 py-2 border bg-gray-800 border-blue-200 placeholder-gray-500 text-blue-200 rounded-b-md focus:outline-none focus:ring-blue-300 focus:border-blue-300 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/login" className="font-medium text-blue-400 hover:text-blue-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div>
                    <button
                        onClick={handleSignInWithGoogle}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Sign in with Google
                    </button>
                </div>
                <div className="text-center mt-4">
                    <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-400">
                        Don't have an account? Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

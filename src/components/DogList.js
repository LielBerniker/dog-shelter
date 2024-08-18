import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../dataBase/firebase';
import './DogList.css';

const defaultImageUrl = 'path_to_default_image.jpg'; // Replace with actual default image URL

function DogList() {
    const { isAdmin, loginAsAdmin, logout } = useContext(AuthContext);
    const [dogs, setDogs] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                // Reference to the 'dogs/' folder in Firebase Storage
                const listRef = ref(storage, 'dogs/');
                const res = await listAll(listRef);

                const dogsData = await Promise.all(
                    res.items.map(async (itemRef) => {
                        const url = await getDownloadURL(itemRef);
                        const response = await fetch(url);
                        const data = await response.json();
                        return data;
                    })
                );

                setDogs(dogsData);
            } catch (error) {
                console.error("Error fetching dogs: ", error);
            }
        };

        fetchDogs();
    }, []);

    const handleLoginToggle = () => {
        setShowLogin(!showLogin);
    };

    const handleLogin = () => {
        if (password === '1234') {
            loginAsAdmin();
            setShowLogin(false);
            setErrorMessage('');
        } else {
            setErrorMessage('Incorrect password. Please try again.');
        }
    };

    const handleAddDog = () => {
        navigate('/add-dog');
    };

    return (
        <div>
            <h2>Available Dogs for Adoption</h2>

            {isAdmin ? (
                <>
                    <button onClick={logout}>Logout</button>
                    <button onClick={handleAddDog}>Add Dog</button>
                </>
            ) : (
                <>
                    <button onClick={handleLoginToggle}>
                        {showLogin ? 'Cancel' : 'Admin Login'}
                    </button>
                    {showLogin && (
                        <div>
                            <input
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={handleLogin}>Login</button>
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        </div>
                    )}
                </>
            )}

            <div className="dog-grid">
                {dogs.map((dog, index) => (
                    <Link to={`/dogs/${index}`} key={index} className="dog-card">
                        <div className="dog-image-wrapper">
                            <img
                                src={dog.imageUrl || defaultImageUrl}
                                alt={dog.name}
                                className="dog-image"
                            />
                        </div>
                        <div className="dog-name">{dog.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DogList;

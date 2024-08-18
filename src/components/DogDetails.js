import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../dataBase/firebase';
import { AuthContext } from '../contexts/AuthContext';

const defaultImageUrl = 'path_to_default_image.jpg'; // Replace with actual default image URL

function DogDetail() {
    const { id } = useParams();
    const [dog, setDog] = useState(null);
    const { isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDog = async () => {
            try {
                const dogRef = ref(storage, `dogs/${id}.json`);
                const url = await getDownloadURL(dogRef);
                const response = await fetch(url);
                const data = await response.json();
                setDog(data);
            } catch (error) {
                console.error("Error fetching dog details:", error);
            }
        };

        fetchDog();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this dog?')) {
            try {
                const dogRef = ref(storage, `dogs/${id}.json`);
                await deleteObject(dogRef);
                navigate('/');
            } catch (error) {
                console.error("Error deleting dog:", error);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/dogs/${id}/edit`);
    };

    return (
        <div>
            {dog ? (
                <div>
                    <h2>{dog.name}</h2>
                    <img
                        src={dog.imageUrl || defaultImageUrl}
                        alt={dog.name}
                        className="dog-detail-image"
                    />
                    <p>Breed: {dog.breed}</p>
                    <p>Age: {dog.age}</p>
                    {isAdmin && (
                        <div className="button-container">
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete} className="delete-button">Delete</button>
                        </div>
                    )}
                    <button onClick={() => navigate(-1)}>Back</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DogDetail;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../dataBase/firebase';

function AddDog() {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newDog = {
                name,
                breed,
                age: parseInt(age, 10),
                imageUrl: '',
            };

            // If an image is provided, upload it to Firebase Storage
            if (image) {
                const imageRef = ref(storage, `dogs/${image.name}`);
                await uploadBytes(imageRef, image);
                newDog.imageUrl = `dogs/${image.name}`;
            }

            // Convert the dog data to a JSON string
            const dogDataJson = JSON.stringify(newDog);
            const blob = new Blob([dogDataJson], { type: "application/json" });

            // Upload the JSON file to Firebase Storage
            const storageRef = ref(storage, `dogs/${name}.json`);
            await uploadBytes(storageRef, blob);

            // Redirect back to the Dog List page
            navigate('/');
        } catch (error) {
            console.error("Error adding dog:", error);
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div>
            <h2>Add a New Dog</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Breed"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <input type="file" onChange={handleImageChange} />
                <div className="button-container">
                    <button type="submit">Add Dog</button>
                    <button type="button" onClick={handleBack}>Back</button>
                </div>
            </form>
        </div>
    );
}

export default AddDog;

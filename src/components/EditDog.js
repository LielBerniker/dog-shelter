import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '../dataBase/firebase';

function EditDog() {
    const { id } = useParams();
    const [dog, setDog] = useState(null);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDog = async () => {
            try {
                const dogRef = ref(storage, `dogs/${id}.json`);
                const url = await getDownloadURL(dogRef);
                const response = await fetch(url);
                const dogData = await response.json();
                setDog(dogData);
                setName(dogData.name);
                setBreed(dogData.breed);
                setAge(dogData.age);
            } catch (error) {
                console.error("Error fetching dog details:", error);
            }
        };

        fetchDog();
    }, [id]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = dog.imageUrl;

            // If a new image is uploaded, replace the old one in Firebase Storage
            if (image) {
                const oldImageRef = ref(storage, `dogs/${dog.imageName}`);
                await deleteObject(oldImageRef);  // Delete the old image
                const imageRef = ref(storage, `dogs/${image.name}`);
                const snapshot = await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const updatedDog = {
                name,
                breed,
                age: parseInt(age, 10),
                imageUrl,
                imageName: image ? image.name : dog.imageName, // Store image name to reference it later
            };

            // Convert the updatedDog object to JSON and upload it
            const dogRef = ref(storage, `dogs/${id}.json`);
            const dogBlob = new Blob([JSON.stringify(updatedDog)], { type: 'application/json' });
            await uploadBytes(dogRef, dogBlob);

            navigate(`/dogs/${id}`);
        } catch (error) {
            console.error("Error updating dog:", error);
        }
    };

    return (
        <div>
            <h2>Edit Dog</h2>
            {dog ? (
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
                    <button type="submit">Update Dog</button>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default EditDog;

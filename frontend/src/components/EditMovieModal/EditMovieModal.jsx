import React, { useState } from 'react';
import './EditMovieModal.css';

const EditMovieModal = ({ movie, onClose }) => {
    const isEditMode = !!movie;

    const [formData, setFormData] = useState({
        title: movie?.title || '',
        description: movie?.description || '',
        durationInMinutes: movie?.durationInMinutes || '',
        genre: movie?.genre || '',
        director: movie?.director || '',
        movieCast: movie?.movieCast || '',
        releaseYear: movie?.releaseYear || '',
        currentlyShowing: movie?.currentlyShowing || false,
        trailerUrl: movie?.trailerUrl || '',
        imageUrl: movie?.imageUrl || '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        try {
            const url = isEditMode ? `/api/movies/${movie.id}` : '/api/movies';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save movie');
            }

            onClose();
            window.location.reload(); // Optional: ideally replace this with a prop callback to refresh movie list
        } catch (err) {
            console.error(err);
            alert("Failed to save movie.");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{isEditMode ? 'Edit Movie' : 'Add New Movie'}</h2>

                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                />
                <input
                    name="durationInMinutes"
                    type="number"
                    value={formData.durationInMinutes}
                    onChange={handleChange}
                    placeholder="Duration in minutes"
                />
                <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" />
                <input name="director" value={formData.director} onChange={handleChange} placeholder="Director" />
                <input name="movieCast" value={formData.movieCast} onChange={handleChange} placeholder="Cast" />
                <input
                    name="releaseYear"
                    type="number"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    placeholder="Release Year"
                />
                <label className="checkbox-label">
                    <input
                        name="currentlyShowing"
                        type="checkbox"
                        checked={formData.currentlyShowing}
                        onChange={handleChange}
                    />
                    Currently Showing
                </label>
                <input name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} placeholder="Trailer URL" />
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" />

                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button className="save-btn" onClick={handleSave}>
                        {isEditMode ? 'Save Changes' : 'Add Movie'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditMovieModal;

import React, { useState } from 'react';
import '../MovieCard/MovieCard.css';
import EditMovieModal from '../EditMovieModal/EditMovieModal';
import DeleteConfirmationModal from "../DeleteMovieModal/DeleteConfirmationModal";

const AdminMovieCard = ({ movie }) => {
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      setShowDeleteModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie.");
    }
  }

    return (
        <>
          <div className="movie-card">
            <img
                src={movie.imageUrl || '/assets/posters/fallback.jpg'}
                alt={movie.title}
                className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p>{movie.genre} • {movie.durationInMinutes} min</p>
            <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                }}
            >
              <button className="book-btn" onClick={() => setOpenModal(true)}>Edit</button>
              <button className="book-btn" onClick={() => setShowDeleteModal(true)}>Delete</button>
            </div>

          </div>

          {openModal && (
              <EditMovieModal movie={movie} onClose={() => setOpenModal(false)}/>
          )}

          {showDeleteModal && (
              <DeleteConfirmationModal
                  movieTitle={movie.title}
                  onConfirm={handleDeleteConfirm}
                  onCancel={() => setShowDeleteModal(false)}
              />
          )}
        </>
    );
  };


export default AdminMovieCard;
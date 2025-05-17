import React, { useEffect, useState } from 'react';
import AdminMovieCard from './AdminMovieCard';
import '../MovieSection/MovieSection.css';
import AdminLayout from "../AdminLayout";
import EditMovieModal from "../EditMovieModal/EditMovieModal";

const AdminMovieManagement = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetch('/api/movies')
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

    const filteredMovies = movies.filter((movie) => {
        const term = searchTerm.toLowerCase();
        return (
            movie.title?.toLowerCase().includes(term) ||
            movie.genre?.toLowerCase().includes(term) ||
            movie.director?.toLowerCase().includes(term) ||
            movie.movieCast?.toLowerCase().includes(term)
        );
    });

    return (
        <AdminLayout>
            <div className="search-bar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="🔍 Search by title, genre, director or cast..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button
                    onClick={() => setShowAddModal(true)}
                    className="add-movie-btn"
                >
                    ➕ Add New Movie
                </button>
            </div>

            <section className="movie-section">
                <h2 className="home-title">
                    <span className="red-text">Movie</span> <span className="white-text">Management</span>
                </h2>
                <div className="movie-list">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
                            <AdminMovieCard key={movie.id} movie={movie} />
                        ))
                    ) : (
                        <p style={{ color: '#ccc', marginTop: '20px' }}>No movies found.</p>
                    )}
                </div>
            </section>

            {showAddModal && (
                <EditMovieModal
                    movie={null}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </AdminLayout>
    );
};

export default AdminMovieManagement;
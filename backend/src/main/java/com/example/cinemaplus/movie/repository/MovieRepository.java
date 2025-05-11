package com.example.cinemaplus.movie.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.cinemaplus.movie.model.Movie;
import org.springframework.stereotype.Repository;


@Repository
public class MovieRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public List<Movie> findAll() {
        return entityManager.createQuery("SELECT m FROM Movie m", Movie.class)
                            .getResultList();
    }

    public Movie findById(long id) {
       return entityManager.find(Movie.class, id);
    }
    public Long countAllMovies() {
        return (Long) entityManager
            .createQuery("SELECT COUNT(m) FROM Movie m WHERE m.currentlyShowing = true")
            .getSingleResult();
    }
    

    
}

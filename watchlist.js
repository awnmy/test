// Watchlist functionality
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function saveWatchlistToStorage() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function displayWatchlist() {
  const watchlistContainer = document.querySelector('.watchlist-container');
  watchlistContainer.innerHTML = ''; // Clear previous entries

  watchlist.forEach((movie, index) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.dataset.movieIndex = index; // Add the movie index as data attribute
    movieCard.innerHTML = `
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'placeholder.jpg'}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h2 class="movie-title">${movie.title}</h2>
        <div class="rating">
          <span class="average-rating">${movie.vote_average || 'N/A'}</span>
        </div>
        <p class="movie-description">${movie.overview || 'No description available'}</p>
        <button class="remove-from-watchlist">Remove from Watchlist</button>
      </div>
    `;
    watchlistContainer.appendChild(movieCard);
  });

  // Add the "Add to Watchlist" form
  const addToWatchlistForm = document.createElement('form');
  addToWatchlistForm.classList.add('add-to-watchlist-form');
  addToWatchlistForm.innerHTML = `
    <input type="text" name="title" placeholder="Enter movie title" required>
    <button type="submit">Search</button>
  `;
  watchlistContainer.appendChild(addToWatchlistForm);

  addToWatchlistForm.addEventListener('submit', async event => {
    event.preventDefault();
    const title = event.target.elements.title.value;

    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=599868b57ef4c6b8249ca92e6e9bda58&query=${encodeURIComponent(title)}`);
      const data = await response.json();

      if (data.results.length === 0) {
        alert('No movies found with that title');
      } else if (data.results.length === 1) {
        const movie = data.results[0];
        const confirmAdd = confirm(`Add "${movie.title}" to your watchlist?`);
        if (confirmAdd) {
          watchlist.push({
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average
          });
          saveWatchlistToStorage();
          displayWatchlist();
        }
      } else {
        const movieOptions = data.results.map(movie => `<option value="${JSON.stringify(movie)}">${movie.title} (${movie.release_date})</option>`);
        const movieSelect = `
          <select>
            ${movieOptions.join('')}
          </select>
          <button type="button" class="add-selected-movie">Add Selected Movie</button>
          <button type="button" class="cancel-add-movie">Cancel</button>
        `;
        watchlistContainer.insertAdjacentHTML('beforeend', movieSelect);

        const addSelectedMovieButton = watchlistContainer.querySelector('.add-selected-movie');
        addSelectedMovieButton.addEventListener('click', () => {
          const selectedMovie = JSON.parse(watchlistContainer.querySelector('select').value);
          watchlist.push({
            title: selectedMovie.title,
            overview: selectedMovie.overview,
            poster_path: selectedMovie.poster_path,
            vote_average: selectedMovie.vote_average
          });
          saveWatchlistToStorage();
          displayWatchlist();
        });

        const cancelAddMovieButton = watchlistContainer.querySelector('.cancel-add-movie');
        cancelAddMovieButton.addEventListener('click', () => {
          displayWatchlist();
        });
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while searching for movies');
    }

    event.target.reset();
  });
}

// Event listener for removing movies from the watchlist
document.querySelector('.watchlist-container').addEventListener('click', event => {
  if (event.target.classList.contains('remove-from-watchlist')) {
    const movieCard = event.target.closest('.movie-card');
    const movieIndex = parseInt(movieCard.dataset.movieIndex, 10);
    watchlist.splice(movieIndex, 1); // Remove the movie from the watchlist array
    saveWatchlistToStorage();
    displayWatchlist();
  }
});

// Load watchlist from localStorage and display
window.addEventListener('load', () => {
  displayWatchlist();
});
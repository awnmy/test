// Replace with your TMDb API key
const apiKey = '599868b57ef4c6b8249ca92e6e9bda58' ;

// Function to fetch the latest movies
async function fetchLatestMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`);
  const data = await response.json();
  return data.results;
}

// Function to display the movies
function displayMovies(movies) {
  const movieContainer = document.querySelector('.movie-series-container');
  movieContainer.innerHTML = ''; // Clear previous entries

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h2 class="movie-title">${movie.title}</h2>
        <div class="rating">
          <span class="average-rating">${movie.vote_average}</span>
        </div>
       
      </div>
    `;
    movieContainer.appendChild(movieCard);
  });
}

// Call the functions
fetchLatestMovies()
  .then(movies => displayMovies(movies))
  .catch(error => console.error(error));

  // Watchlist functionality
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function saveWatchlistToStorage() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function displayWatchlist() {
  const watchlistContainer = document.querySelector('.watchlist-container');
  watchlistContainer.innerHTML = ''; // Clear previous entries

  watchlist.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path || 'placeholder.jpg'}" alt="${movie.title}" class="movie-poster">
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
}

// Event listener for adding to watchlist
document.querySelector('.add-to-watchlist-form').addEventListener('submit', event => {
  event.preventDefault();
  const title = event.target.elements.title.value;
  const overview = event.target.elements.overview.value;
  const posterPath = event.target.elements.posterPath.value;
  const voteAverage = event.target.elements.voteAverage.value;

  const movie = {
    title,
    poster_path: posterPath,
    vote_average: voteAverage
  };

  watchlist.push(movie);
  saveWatchlistToStorage();
  displayWatchlist();
  event.target.reset();
});

document.querySelector('.watchlist-container').addEventListener('click', event => {
  if (event.target.classList.contains('remove-from-watchlist')) {
    const movie = event.target.closest('.movie-card').dataset.movie;
    watchlist = watchlist.filter(m => m !== movie);
    saveWatchlistToStorage();
    displayWatchlist();
  }
});

// Load watchlist from localStorage and display
window.addEventListener('load', () => {
  displayWatchlist();
});
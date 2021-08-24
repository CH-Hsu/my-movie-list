const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

renderMovieList(movies)

// Get and show favorite movie data.
function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img class="card-img-top"
              src="${POSTER_URL + item.image}"
              alt="Movie Poster"
            >
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie"
                data-toggle="modal"
                data-target="#movie-modal"
                data-id="${item.id}">More
              </button>
              <button class="btn btn-danger btn-delete-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// Button event.
dataPanel.addEventListener('click', event => {
  const target = event.target

  if (target.matches('.btn-show-movie')) {
    // Click 'More' button to show more movie info.
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-delete-favorite')) {
    // Click 'x' button to delete favorite movie.
    deleteFavorite(Number(target.dataset.id))
    renderMovieList(movies)
  }
})

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  const data = movies.find(movie => movie.id === id)

  modalTitle.innerText = data.title
  modalDate.innerText = 'Release date: ' + data.release_date
  modalDescription.innerText = data.description
  modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
}

function deleteFavorite(id) {
  if (!movies) return alert('Your favorite list is empty!')

  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return alert('The movie doesn\'t exist!')

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  return alert('Delete successfully!')
}
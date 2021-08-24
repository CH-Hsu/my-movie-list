const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('#paginator')
const movies = []
const searchOut = []

// Get and show movie data.
axios.get(INDEX_URL).then(response => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
}).catch(e => console.log(e))

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = searchOut.length ? searchOut : movies
  const startId = (page - 1) * MOVIES_PER_PAGE

  return data.slice(startId, startId + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let p = 1; p <= numPage; p++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

// Button event.
dataPanel.addEventListener('click', event => {
  const target = event.target

  if (target.matches('.btn-show-movie')) {
    // Click 'More' button to show more movie info.
    showMovieModal(target.dataset.id)
  } else if (target.matches('.btn-add-favorite')) {
    // Click '+' button to add favorite movie.
    addToFavorite(Number(target.dataset.id))
  }
})

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  if (list.some(movie => movie.id === id)) {
    return alert('The movie has been in your favorite list!')
  }

  list.push(movies.find(movie => movie.id === id))
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  alert('Add successfully!')
}

// Search movie.
searchForm.addEventListener('submit', event => {
  event.preventDefault()
  const keyword = event.target.querySelector('input').value.trim().toLowerCase()
  searchOut.length = 0

  if (keyword.length <= 0) {
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
    return
  }

  searchOut.push(...searchMovieKeyword(keyword, movies))

  if (searchOut.length <= 0) {
    return alert(`Can't find any movie with keyword "${keyword}"`)
  }
  renderPaginator(searchOut.length)
  renderMovieList(getMoviesByPage(1))
})

function searchMovieKeyword(keyword, data) {
  const searchOut = []

  data.forEach(item => {
    if (item.title.toLowerCase().includes(keyword)) {
      searchOut.push(item)
    }
  })

  return searchOut
}

// Paginator
paginator.addEventListener('click', event => {
  const target = event.target

  if (target.tagName !== 'A') return
  renderMovieList(getMoviesByPage(Number(target.dataset.page)))
})
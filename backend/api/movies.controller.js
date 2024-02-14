import MoviesDAO from "../dao/moviesDAO";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.moviesPerPage) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let filters = {};
    if (req.query.title) {
      filters.title = req.query.title;
    } else if (req.query.rated) {
      filters.rated = req.query.rated;
    } else if (req.query.genre) {
      filters.genre = req.query.genre;
    } else if (req.query.year) {
      filters.year = req.query.year;
    } else if (req.query.director) {
      filters.director = req.query.director;
    } else if (req.query.actor) {
      filters.actor = req.query.actor;
    } else if (req.query.runtime) {
      filters.runtime = req.query.runtime;
    }

    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      page,
      moviesPerPage,
    });

    let response = {
      movies: moviesList,
      page: page,
      filters: filters,
      entries_per_page: moviesPerPage,
      total_results: totalNumMovies,
    };
    res.json(response);
  }
}

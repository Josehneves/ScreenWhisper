let movies;

export default class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      movies = await conn.db(process.env.SCREENWHISPER_NS).collection("movies");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in moviesDAO: ${e}`
      );
    }
  }
}

async function getMovies({
  filters = null,
  page = 0,
  moviesPerPage = 20,
} = {}) {
  let query;
  if (filters) {
    if ("title" in filters) {
      query = { $text: { $search: filters["title"] } };
    } else if ("rated" in filters) {
      query = { rated: { $eq: filters["rated"] } };
    } else if ("genre" in filters) {
      query = { genre: { $eq: filters["genre"] } };
    } else if ("year" in filters) {
      query = { year: { $eq: filters["year"] } };
    } else if ("director" in filters) {
      query = { director: { $eq: filters["director"] } };
    } else if ("actor" in filters) {
      query = { actor: { $eq: filters["actor"] } };
    } else if ("runtime" in filters) {
      query = { runtime: { $eq: filters["runtime"] } };
    }
  }
  let cursor;
  try {
    cursor = await movies
      .find(query)
      .limit(moviesPerPage)
      .skip(moviesPerPage * page);
    const moviesList = await cursor.toArray();
    const totalNumMovies = await movies.countDocuments(query);
    return { moviesList, totalNumMovies };
  } catch (e) {
    console.error(`Unable to issue find command, ${e}`);
    return { moviesList: [], totalNumMovies: 0 };
  }
}

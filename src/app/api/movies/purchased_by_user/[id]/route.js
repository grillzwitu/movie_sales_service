import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import { authenticate } from '@utils/auth';
import Movie from '@models/Movie'; // Import the Movie model

/**
 * Retrieves a list of purchased movie details (title, coverImage, genres) for the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing an array of purchased movie details.
 */
export async function GET(req, res) {
  await connectToDatabase();

  return authenticate(req, res)
    .then(async () => {
      const userId = req.user.id;

      try {
        // Find purchases with movie IDs
        const purchases = await Purchase.find({ userId }).select('items.movieId -_id');

        // Extract movie IDs
        const purchasedMovieIds = purchases.flatMap(purchase => purchase.items.map(item => item.movieId));

        // Use Movie model to find details for each movie ID
        const movieDetails = await Movie.find({ _id: { $in: purchasedMovieIds } });

        // Send movie details as response
        res.setHeader('Content-Type', 'application/json');
        return new Response(JSON.stringify(movieDetails), { status: 200 });
      } catch (error) {
        return Promise.reject({ statusCode: 500, message: 'Failed to fetch purchased movies' });
      }
    })
    .catch(error => {
      res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: error.message }));
    });
}

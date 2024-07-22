import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import Movie from '@models/Movie';
import { authenticate } from '@utils/auth';

/**
 * Creates a new purchase for a specific movie.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing the created purchase.
 */
export async function POST(req, res) {
    await connectToDatabase();
  
    return authenticate(req, res)
      .then(async () => {
        const userId = req.user.id;
        const { movieId } = req.body;
  
        try {
          // Fetch movie information (replace with actual movie fetching logic)
          const movie = await Movie.findById(movieId);
  
          if (!movie) {
            return Promise.reject({ statusCode: 404, message: 'Movie not found' });
          }
  
          // Create purchase
          const purchase = new Purchase({
            userId,
            items: [{ movieId, movieInfo: { name: movie.name, price: movie.price } }],
            totalQuantity: 1,
            totalAmount: movie.price,
            purchasedAt: new Date(),
          });
  
          await purchase.save();
  
          return new Response(JSON.stringify(purchase), { status: 201 });
        } catch (error) {
          return Promise.reject({ statusCode: 500, message: 'Failed to create purchase' });
        }
      })
      .catch(error => {
        res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message }));
      });
}

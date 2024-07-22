import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import { authenticate, ensureAdmin } from '@utils/auth';


/**
 * Retrieves all purchase records. Requires admin privileges.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing an array of purchases.
 */
export async function GET(req, res) {
  await connectToDatabase();

  return authenticate(req, res)
    .then(async () => {
      await ensureAdmin(req, res); // Throws error if not admin

      try {
        const purchases = await Purchase.find()
          .populate('items.movieId');

        res.setHeader('Content-Type', 'application/json');
        return new Response(JSON.stringify(purchases), { status: 200 });
      } catch (error) {
        return Promise.reject({ statusCode: 500, message: 'Failed to fetch purchases' });
      }
    })
    .catch(error => {
      res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: error.message }));
    });
}

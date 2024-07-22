import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import { ObjectId } from 'mongodb';
import { authenticate } from '@utils/auth';


/**
 * Retrieves a specific purchase.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing the purchase details.
 */
export async function GET(req, res) {
    await connectToDatabase();
  
    return authenticate(req, res)
      .then(async () => {
        const { id } = req.query;
  
        if (!ObjectId.isValid(id)) {
          return Promise.reject({ statusCode: 400, message: 'Invalid purchase ID' });
        }
  
        try {
          const purchase = await Purchase.findOne({ _id: id, userId: req.user.id })
            .populate('items.movieId');
  
          if (!purchase) {
            return Promise.reject({ statusCode: 404, message: 'Purchase not found or not authorized' });
          }
  
          res.setHeader('Content-Type', 'application/json');
          return new Response(JSON.stringify(purchase), { status: 200 });
        } catch (error) {
          return Promise.reject({ statusCode: 500, message: 'Failed to fetch purchase' });
        }
      })
      .catch(error => {
        res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message }));
      });
}

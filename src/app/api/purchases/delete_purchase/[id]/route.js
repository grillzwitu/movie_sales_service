import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import { ObjectId } from 'mongodb';
import { authenticate, ensureAdmin } from '@utils/auth';


/**
 * Deletes a purchase record. Requires admin privileges.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object with appropriate status codes and messages.
 */
export async function DELETE(req, res) {
  await connectToDatabase();

  return authenticate(req, res)
    .then(async () => {
      // Only admins can delete purchases
      await ensureAdmin(req, res);

      const { id } = req.query;

      if (!ObjectId.isValid(id)) {
        return Promise.reject({ statusCode: 400, message: 'Invalid purchase ID' });
      }

      try {
        const deletedPurchase = await Purchase.findOneAndDelete({ _id: id });

        if (!deletedPurchase) {
          return Promise.reject({ statusCode: 404, message: 'Purchase not found' });
        }

        return new Response(null, { status: 204 }); // No content on successful deletion
      } catch (error) {
        return Promise.reject({ statusCode: 500, message: 'Failed to delete purchase' });
      }
    })
    .catch(error => {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode || 500, headers: { 'Content-Type': 'application/json' } });
    });
}

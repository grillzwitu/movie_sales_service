import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import Cart from '@models/Cart';
import { ObjectId } from 'mongodb';
import { authenticate } from '@utils/auth';
import { getSession, session } from 'next/session';


/**
 * Creates a new purchase based on the user's cart.
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
  
        try {
          const cart = await Cart.findOne({ userId });
  
          if (!cart) {
            return Promise.reject({ statusCode: 404, message: 'Cart not found' });
          }
  
          // Create purchase from cart items
          const purchase = new Purchase({
            userId,
            items: cart.items,
            totalQuantity: cart.items.length,
            totalAmount: cart.items.reduce((acc, item) => acc + (item.price), 0),
            purchasedAt: new Date(),
          });
  
          await purchase.save();
  
          // Update cart to indicate purchase
          await Cart.findByIdAndUpdate(cart._id, { $set: { purchased: true } });
  
          return new Response(JSON.stringify(purchase), { status: 201 });
        } catch (error) {
          return Promise.reject({ statusCode: 500, message: 'Failed to create purchase' });
        }
      })
      .catch(error => {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode || 500, headers: { 'Content-Type': 'application/json' } });
      });
}

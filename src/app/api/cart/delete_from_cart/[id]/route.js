import connectToDatabase from '@utils/db';
import Cart from '@models/Cart';
import { getSession, session } from 'next/session';

/**
 * Removes a movie from the user's cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing the updated cart.
 */
export async function DELETE(req, res, {id}) {
    await connectToDatabase();
  
    const session = await getSession({ req });
  
    const userId = session?.user?.id;
    const { movieId } = req.body;
  
    try {
      if (userId) {
        // User is authenticated
        // Find the latest cart for the user
        const lastCart = await Cart.findOne({ userId }).sort({ createdAt: -1 });
  
        if (lastCart && !lastCart.purchased) {
          // Merge session cart with database cart if the last cart is not purchased
          const mergedCart = [...(session.get('cart') || []), ...lastCart.items];
          const uniqueMovieIds = new Set(mergedCart.map(item => item.movieId));
          uniqueMovieIds.delete(movieId); // Remove the movie to be deleted
          const uniqueItems = mergedCart.filter(item => uniqueMovieIds.has(item.movieId));
  
          const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: uniqueItems } },
            { new: true }
          );
  
          if (!updatedCart) {
            return Promise.reject({ statusCode: 404, message: 'Cart not found' });
          }
  
          // Update session cart with the merged and updated cart
          session.set('cart', uniqueItems);
          await session.save();
  
          return new Response(JSON.stringify(updatedCart), { status: 200 });
        } else {
          // No existing cart or purchased cart - handle error or inform user
          return Promise.reject({ statusCode: 404, message: 'Cart not found' }); // Adjust message if needed
        }
      } else {
        // User is not authenticated
        const cart = session.get('cart') || [];
        const indexToRemove = cart.findIndex(item => item.movieId === movieId);
  
        if (indexToRemove === -1) {
          return Promise.reject({ statusCode: 404, message: 'Item not found in cart' });
        }
  
        cart.splice(indexToRemove, 1);
        session.set('cart', cart);
        await session.save();
  
        return new Response(JSON.stringify(cart), { status: 200 });
      }
    } catch (error) {
      return Promise.reject({ statusCode: 500, message: 'Failed to remove item from cart' });
    }
}

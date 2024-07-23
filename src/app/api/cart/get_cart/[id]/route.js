import connectToDatabase from '@utils/db';
import Cart from '@models/Cart';
import { getSession, session } from 'next/session';

/**
 * Retrieves the user's cart. Handles both authenticated and unauthenticated users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing the cart details.
 */
export async function GET(req, res) {
  await connectToDatabase();

  const session = await getSession({ req });

  const userId = session?.user?.id;

  try {
    if (userId) {
      // User is authenticated
      const lastCart = await Cart.findOne({ userId }).sort({ createdAt: -1 });

      if (lastCart && !lastCart.purchased) {
        // Merge session cart with database cart if the last cart is not purchased
        const mergedCart = [...(session.get('cart') || []), ...lastCart.items];
        const uniqueMovieIds = new Set(mergedCart.map(item => item.movieId));
        const uniqueItems = mergedCart.filter(item => uniqueMovieIds.has(item.movieId));

        // Populate movie details using the aggregation pipeline
        const cartInfo = await Cart.aggregate([
          { $match: { _id: lastCart._id } },
          {
            $lookup: {
              from: 'movies',
              localField: 'items.movieId',
              foreignField: '_id',
              as: 'movieDetails',
            },
          },
          { $unwind: '$movieDetails' },
          {
            $project: {
              _id: 0,
              items: {
                movieId: '$movieDetails._id',
                title: '$movieDetails.title',
                price: '$movieDetails.price',
                coverImage: '$movieDetails.coverImage',
              },
            },
          },
        ]);

        return new Response(JSON.stringify(cartInfo), { status: 200 });
      } else {
        // If the latest cart is purchased or doesn't exist, create a new cart
        const cart = await Cart.create({ userId, items: [] });
        return new Response(JSON.stringify(cart), { status: 201 , headers: { 'Content-Type': 'application/json' }});
      }
    } else {
      // User is not authenticated
      const cart = session.get('cart') || [];
      return new Response(JSON.stringify(cart), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode || 500, headers: { 'Content-Type': 'application/json' } });
  }
}

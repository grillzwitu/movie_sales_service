/**
 * Retrieves a list of purchased movie IDs for the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing an array of purchased movie IDs.
 */
export async function GET_PURCHASED_MOVIES(req, res) {
    await connectToDatabase();
  
    return authenticate(req, res)
      .then(async () => {
        const userId = req.user.id;
  
        try {
          const purchases = await Purchase.find({ userId }).select('items.movieId -_id');
          const purchasedMovieIds = purchases.flatMap(purchase => purchase.items.map(item => item.movieId));
  
          res.setHeader('Content-Type', 'application/json');
          return new Response(JSON.stringify(purchasedMovieIds), { status: 200 });
        } catch (error) {
          return Promise.reject({ statusCode: 500, message: 'Failed to fetch purchased movies' });
        }
      })
      .catch(error => {
        res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message }));
      });
}

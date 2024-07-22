// import connectToDatabase from '@utils/db';
// import Purchase from '@models/Purchase';
// import { ObjectId } from 'mongodb';
// import { authenticate, ensureAdmin } from '@utils/auth';


// export async function GET(req, res) {
//   await connectToDatabase();

//   return authenticate(req, res)
//     .then(async () => {
//       const { id } = req.query;

//       if (!ObjectId.isValid(id)) {
//         return Promise.reject({ statusCode: 400, message: 'Invalid purchase ID' });
//       }

//       try {
//         const purchase = await Purchase.findOne({ _id: id, userId: req.user.id })
//           .populate('userId')
//           .populate('movieId');

//         if (!purchase) {
//           return Promise.reject({ statusCode: 404, message: 'Purchase not found or not authorized' });
//         }

//         // Set relevant headers (e.g., Content-Type)
//         res.setHeader('Content-Type', 'application/json');

//         return new Response(JSON.stringify(purchase), { status: 200 });
//       } catch (error) {
//         return Promise.reject({ statusCode: 500, message: 'Failed to fetch purchase' });
//       }
//     })
//     .catch(error => {
//       res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
//       return res.end(JSON.stringify({ error: error.message }));
//     });
// }


// export async function DELETE(req, res) {
//   await connectToDatabase();

//   return authenticate(req, res)
//     .then(async () => {
//       ensureAdmin(req, res); // Throws error if not admin

//       const { id } = req.query;

//       if (!ObjectId.isValid(id)) {
//         return Promise.reject({ statusCode: 400, message: 'Invalid purchase ID' });
//       }

//       try {
//         const purchase = await Purchase.findOneAndDelete({ _id: id, userId: req.user.id });

//         if (!purchase) {
//           return Promise.reject({ statusCode: 404, message: 'Purchase not found or not authorized' });
//         }

//         return new Response(null, { status: 204 }); // No content on successful deletion
//       } catch (error) {
//         return Promise.reject({ statusCode: 400, message: 'Failed to delete purchase' });
//       }
//     })
//     .catch(error => {
//       res.writeHead(error.statusCode || 500, { 'Content-Type': 'application/json' });
//       return res.end(JSON.stringify({ error: error.message }));
//     });
// }


/**
 * Retrieves a specific purchase.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing the purchase details.
 */
export async function GET_PURCHASE(req, res) {
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


/**
 * Creates a new purchase for a specific movie.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Response>} A Promise resolving to a Response object containing the created purchase.
 */
export async function POST_CREATE_PURCHASE(req, res) {
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

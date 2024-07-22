import connectToDatabase from '@utils/db';
import Purchase from '@models/Purchase';
import Movie from '@models/Movie';
import { authenticate, ensureAdmin } from '@utils/auth';

export async function GET(req, res) {
  await connectToDatabase();

  authenticate(req, res, () => {
    ensureAdmin(req, res, async () => {
      try {
        const totalMoviesPurchased = await Purchase.countDocuments({});
        const actionMovies = await Movie.countDocuments({ genres: 'Action' });

        return new Response(JSON.stringify({
          totalMoviesPurchased,
          actionMovies,
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch report' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }, (error) => {
      // Handle authorization error
      console.error(error);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  }, (error) => {
    // Handle authentication error
    console.error(error);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
        }
      });
  });

  return new Response('Method Not Allowed', { status: 405 });
}

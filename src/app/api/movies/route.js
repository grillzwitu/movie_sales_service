import connectToDatabase from '@utils/db';
import Movie from '@models/Movie';

export async function GET(req) {
  await connectToDatabase(); // Connect to the database

  try {
    const movies = await Movie.find({}); // Fetch all movies
    return new Response(JSON.stringify(movies), { status: 200 }); // Send movies in response
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch movies' }), { status: 500 }); // Error handling
  }
}

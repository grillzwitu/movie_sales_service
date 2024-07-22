import connectToDatabase from '@utils/db';
import Movie from '@models/Movie';
import { ObjectId } from 'mongodb';
import { authenticate, ensureAdmin } from '@utils/auth';
import cloudinary from '@utils/fileStore';

// Handler for individual movie API
export const GET = async (req, { params }) => {
    await connectToDatabase(); // Connect to the database
    const { id } = params;
  
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid movie ID' }), { status: 400 }); // Invalid ID error handling
    }
  
    try {
      const movie = await Movie.findById(id); // Find movie by ID
      if (!movie) {
        return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404 }); // Movie not found
      }
  
      return new Response(JSON.stringify(movie), { status: 200 }); // Send the movie in response
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch movie' }), { status: 500 }); // Error handling
    }
};

import connectToDatabase from '@utils/db';
import Movie from '@models/Movie';
import { ObjectId } from 'mongodb';
import { authenticate, ensureAdmin } from '@utils/auth';
import cloudinary from '@utils/fileStore';

export const DELETE = async (req, { params }) => {
    await connectToDatabase(); // Connect to the database
    const { id } = params;
  
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid movie ID' }), { status: 400 }); // Invalid ID error handling
    }
  
    try {
      const user = await authenticate(req); // Authenticate the user
      ensureAdmin(user); // Ensure the user is an admin
  
      const movie = await Movie.findByIdAndDelete(id); // Delete movie
      if (!movie) {
        return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404});
      }
    } catch (error) {
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
          return new Response(JSON.stringify({ error: error.message }), { status: 403 }); // Unauthorized or Forbidden
         }
         return new Response(JSON.stringify({ error: 'Failed to delete movie' }), { status: 400 }); // Error handling
      }
}

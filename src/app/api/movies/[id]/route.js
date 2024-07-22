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

export const PATCH = async (req, { params }) => {
  await connectToDatabase(); // Connect to the database
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid movie ID' }), { status: 400 }); // Invalid ID error handling
  }

  try {
    const user = await authenticate(req); // Authenticate the user
    ensureAdmin(user); // Ensure the user is an admin

    const updateData = {}; // Object to hold update data

    if (req.has('header', 'Content-Type') && req.headers.get('Content-Type').startsWith('multipart/')) {
      // Handle file upload (if present)
      const formData = await req.formData();
      const file = formData.get('coverImage');

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, '_');
        const uploadedImg = await cloudinary.uploader.upload(buffer, {
          resource_type: 'auto',
          use_filename: true,
          folder: 'movie_covers',
        });

        updateData.coverImage = uploadedImg.secure_url;
      }
    }

    const { title, genres, price } = req.body; // Get data from request body

    if (title) updateData.title = title;
    if (genres) updateData.genres = genres.split(','); // Assuming genres is a comma-separated string
    if (price) updateData.price = parseFloat(price);

    updateData.updatedAt = Date.now(); // Add updated_at field

    const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true }); // Update movie

    if (!movie) {
      return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404 }); // Movie not found
    }

    return new Response(JSON.stringify(movie), { status: 200 }); // Send the updated movie in response
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return new Response(JSON.stringify({ error: error.message }), { status: 403 }); // Unauthorized or Forbidden
    }
    return new Response(JSON.stringify({ error: 'Failed to update movie' }), { status: 400 }); // Error handling
  }
};

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

import connectToDatabase from '@utils/db';
import Movie from '@models/Movie';
import { authenticate, ensureAdmin } from '@utils/auth';
import cloudinary from '@utils/fileStore';
import { promises as fs } from 'fs';
import path from 'path';
import deleteFile from '@utils/delete_file';

export async function POST(req) {
    await connectToDatabase(); // Connect to the database
  
    return new Promise(async (resolve, reject) => {
      try {
        const formData = await req.formData(); // Parse the form data
  
        const user = await authenticate(req); // Authenticate the user
        await ensureAdmin(user); // Ensure the user is an admin
  
        // Handle file upload
        const file = formData.get("coverImage");
  
        if (!file) {
          return reject(new Response(JSON.stringify({ error: "No files received." }), { status: 400 }));
        }
  
        // Convert the file data to a Buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
        const filePath = path.join(process.cwd(), 'uploads', filename); // Create the file path
  
        await console.log(filename)
  
        await console.log(filePath)
  
        // Ensure the uploads directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
  
        // Write the file to the specified directory with the modified filename
        await fs.writeFile(filePath, buffer);
  
        try {
          // Upload the image to cloudinary
          const uploadedImg = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            use_filename: true,
            folder: 'movie_covers',
          });
  
  
          // Create a new movie with the uploaded image's public ID
          const { title, genres, price } = Object.fromEntries(formData.entries());
          await console.log(title, genres, price)
          const movie = await new Movie({
            title: title,
            genres: genres.split(','), // Assuming genres is a comma-separated string
            price: parseFloat(price),
            coverImage: uploadedImg.secure_url,
          });
  
          await movie.save(); // Save the movie to the database
        } catch (error) {
          console.error(error);
          new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
  
        // Delete the local file after uploading to Cloudinary
        await deleteFile(filePath);
  
        resolve(new Response(JSON.stringify(movie), { status: 201 })); // Send the created movie in response
  
      } catch (error) {
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
          reject(new Response(JSON.stringify({ error: error.message }), { status: 403 })); // Unauthorized or Forbidden
        } else {
          reject(new Response(JSON.stringify({ error: 'Failed to create movie' }), { status: 400 })); // Error handling
        }
      }
    });
}

/**
 * Handles POST requests for creating a new movie.
 *
 * This function parses form data, authenticates the user, uploads a cover image to Cloudinary,
 * creates a new movie object, saves it to the database, and sends a response with the created movie.
 *
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A promise resolving to a response object.
 */
export async function POST(req) {
  await connectToDatabase(); // Connect to the database

  return new Promise(async (resolve, reject) => {
    try {
      // Parse form data
      const formData = await req.formData(); // Parse the form data

      // Authenticate the user
      const user = await authenticate(req); // Authenticate the user
      await ensureAdmin(user); // Ensure the user is an admin

      // Handle file upload
      const file = formData.get("coverImage");

      if (!file) {
        return reject(new Response(JSON.stringify({ error: "No files received." }), { status: 400 }));
      }

      // Convert file data to Buffer and create file path
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
      const filePath = path.join(process.cwd(), 'uploads', filename); // Create the file path

      await console.log(filename);
      await console.log(filePath);

      // Ensure uploads directory exists and write file
      await fs.mkdir(path.dirname(filePath), { recursive: true }); // Ensure the uploads directory exists
      await fs.writeFile(filePath, buffer); // Write the file to the specified directory

      // Upload image to Cloudinary
      const uploadedImg = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
        use_filename: true,
        folder: 'movie_covers',
      });

      // Create a new movie object
      const { title, genres, price } = Object.fromEntries(formData.entries());
      const movie = await new Movie({
        title: title,
        genres: genres.split(','), // genres is a comma-separated string in the form
        price: parseFloat(price),
        coverImage: uploadedImg.secure_url,
      });

      // Save the movie to the database
      await movie.save();

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

/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
            },
          ]
        //domains: ['res.cloudinary.com'], // Replace 'res.cloudinary.com' with your actual Cloudinary domain
    },

};


export default nextConfig;

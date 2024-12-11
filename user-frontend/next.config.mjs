/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost", // for local development
      "lendr.tobiaswolmar.dk", // your production domain
    ],
  },
};

export default nextConfig;

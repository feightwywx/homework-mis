/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withLess = require("next-with-less");

module.exports = withLess({
  lessLoaderOptions: {
  },
  ...nextConfig
});

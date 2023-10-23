/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["tsx"],
  images: {
    unoptimized: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          use: "yaml-loader",
        },
        // {
        //   test: /\.svg$/,
        //   use: "@svgr/webpack",
        // },
      ]
    );
    return config;
  },
};

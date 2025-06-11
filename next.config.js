/** @type {import('next').NextConfig} */


module.exports = {
  output: "export",
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["tsx", "ts"],
  images: {
    unoptimized: true,
  },
  webpack: (config, { buildId, defaultLoaders, webpack, isServer, dev }) => {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          use: "yaml-loader",
        },
        // Reapply the existing rule, but only for svg imports not ending in ?component
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /component/] }, // exclude if *.svg?component
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: /component/, // *.svg?component
          use: ['@svgr/webpack'],
        },
      ]
    );
    return config;
  },
};

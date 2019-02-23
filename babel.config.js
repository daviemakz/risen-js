module.exports = function(api) {
  api.cache(true);
  const presets = ['@babel/preset-env'];
  const plugins = [
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-syntax-throw-expressions'
  ];
  return {
    comments: false,
    presets,
    plugins
  };
};

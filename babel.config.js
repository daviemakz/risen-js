module.exports = function(api) {
  api.cache(true);
  const presets = ['@babel/preset-env'];
  const plugins = ['@babel/plugin-transform-regenerator'];
  return {
    comments: false,
    presets,
    plugins
  };
};

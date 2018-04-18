const prefix = '_site';

module.exports = {
  staticFileGlobs: [
    prefix + '/**/**.html',
    prefix + '/**/*.js',
    prefix + '/**/*.css',
    prefix + '/**/*.ico',
    prefix + '/**/*.{eot,svg,ttf,woff,json}',
    '!' + prefix + '/service-worker.js',
  ],
  stripPrefix: prefix
}
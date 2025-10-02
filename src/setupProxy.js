// filepath: c:\Users\azizb\Desktop\PFE5\PFE_3.5.0\frontend\src\setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This will proxy any request starting with /api
    createProxyMiddleware({
      target: 'http://localhost:3000', // Your backend server address
      changeOrigin: true,
    })
  );
};
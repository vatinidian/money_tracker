
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/transactionList", "/userAccount"], {
      target: "https://money-tracker-services.herokuapp.com",
      changeOrigin: true
    })
  );
};

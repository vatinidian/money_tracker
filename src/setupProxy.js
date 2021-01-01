
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/transactionList", "/userAccount", "/user"], {
      target: "https://money-tracker-services.herokuapp.com",
      //target: "http://localhost:5000/",
      changeOrigin: true
    })
  );
};

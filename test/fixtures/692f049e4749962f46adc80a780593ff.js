var path = require("path");

/**
 * GET /users/anjunadeep?client_id=83d37608cef935bb382915730917bb7d&format=json
 *
 * host: api.soundcloud.com
 * accept: application/json
 * connection: close
 */

module.exports = function (req, res) {
  res.statusCode = 200;

  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("content-length", "952");
  res.setHeader("connection", "close");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "Accept, Authorization, Content-Type, Origin");
  res.setHeader("access-control-allow-methods", "GET, PUT, POST, DELETE");
  res.setHeader("cache-control", "max-age=600, public");
  res.setHeader("access-control-expose-headers", "Date");
  res.setHeader("date", "Thu, 23 Feb 2017 23:27:37 GMT");
  res.setHeader("etag", "\"e0ff6735aa868d0aeb90d96f12c05d40\"");
  res.setHeader("status", "200 OK");
  res.setHeader("server", "am/2");
  res.setHeader("age", "209");
  res.setHeader("vary", "Authorization,Accept");
  res.setHeader("x-cache", "Hit from cloudfront");
  res.setHeader("via", "1.1 49c80a47c1441dd194a8337982f1cd7e.cloudfront.net (CloudFront)");
  res.setHeader("x-amz-cf-id", "vhcPi_yBDnePvkk-bb3JD4WyXmlEojVjinrBqxpFrrs_YOID36vHbQ==");

  res.setHeader("x-yakbak-tape", path.basename(__filename, ".js"));

  res.write(new Buffer("eyJpZCI6MjM3MjA0LCJraW5kIjoidXNlciIsInBlcm1hbGluayI6ImFuanVuYWRlZXAiLCJ1c2VybmFtZSI6IkFuanVuYWRlZXAiLCJsYXN0X21vZGlmaWVkIjoiMjAxNy8wMi8wOCAxNzowMTozNSArMDAwMCIsInVyaSI6Imh0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tL3VzZXJzLzIzNzIwNCIsInBlcm1hbGlua191cmwiOiJodHRwOi8vc291bmRjbG91ZC5jb20vYW5qdW5hZGVlcCIsImF2YXRhcl91cmwiOiJodHRwczovL2kxLnNuZGNkbi5jb20vYXZhdGFycy0wMDAyNzkxOTE2ODgta3Bjb3g5LWxhcmdlLmpwZyIsImNvdW50cnkiOm51bGwsImZpcnN0X25hbWUiOiIiLCJsYXN0X25hbWUiOiIiLCJmdWxsX25hbWUiOiIiLCJkZXNjcmlwdGlvbiI6IlwiT25lIG9mIHRoZSBob3R0ZXN0IGVsZWN0cm9uaWMgbGFiZWxzIGluIHRoZSB3b3JsZFwiIC0gSHlwZSBNYWNoaW5lXG5cbkJ1eS9TdHJlYW0gJ0FuanVuYWRlZXAgMDgnOiBodHRwczovL2FuanVuYWRlZXAubG5rLnRvL0RlZXAwOHNvXG5cblNwb3RpZnk6IGh0dHA6Ly9wby5zdC9zQW5qdW5hZGVlcFxuWW91dHViZTogaHR0cDovL3BvLnN0L3l0ZGVlcCIsImNpdHkiOiJMb25kb24iLCJkaXNjb2dzX25hbWUiOm51bGwsIm15c3BhY2VfbmFtZSI6bnVsbCwid2Vic2l0ZSI6Imh0dHA6Ly93d3cuYW5qdW5hZGVlcC5jb20iLCJ3ZWJzaXRlX3RpdGxlIjoiQW5qdW5hZGVlcC5jb20iLCJ0cmFja19jb3VudCI6ODE2LCJwbGF5bGlzdF9jb3VudCI6MTg0LCJvbmxpbmUiOmZhbHNlLCJwbGFuIjoiUHJvIFBsdXMiLCJzdWJzY3JpcHRpb25zIjpbeyJwcm9kdWN0Ijp7ImlkIjoiY3JlYXRvci1wcm8tdW5saW1pdGVkIiwibmFtZSI6IlBybyBVbmxpbWl0ZWQifX1dLCJmb2xsb3dlcnNfY291bnQiOjE0NTE2NiwiZm9sbG93aW5nc19jb3VudCI6ODksInB1YmxpY19mYXZvcml0ZXNfY291bnQiOjE3OCwicmVwb3N0c19jb3VudCI6MjI3fQ==", "base64"));
  res.end();

  return __filename;
};


function logger(req, res, next) {
  console.log("Middleware function called");
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request Headers:", req.headers);
  console.log("Request ip:", req.ip);
  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  if (clientIp && clientIp.indexOf(',') !== -1) {
    clientIp = clientIp.split(',')[0];
  }

  if (clientIp.startsWith("::ffff:")) {
    clientIp = clientIp.slice(7);
  }

  console.log("Client IP:", clientIp);
  next();
}

module.exports = logger;

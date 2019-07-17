const PORT = 8888;
const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const cache = require("./cache.js");
const mime = require("./mime").types;

http
  .createServer(function (request, response) {
    response.body = "11111";
    const pathname = url.parse(request.url).pathname;
    const realPath = "assets" + pathname;
    fs.exists(realPath, function (exists) {
      if (!exists) {
        response.writeHead(404, {
          "Content-Type": "text/plain"
        });
        response.write(
          "This request URL " + pathname + " was not found on this server."
        );
        response.end();
      } else {
        var ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : "unknown";
        var contentType = mime[ext] || "text/plain";
        cache(request, response, next);

        function next() {
          fs.readFile(realPath, "binary", function (err, file) {
            console.log(new Date(), ":----read file-----");
            if (err) {
              response.writeHead(500, {
                "Content-Type": contentType
              });
              response.end(err);
            } else {
              response.writeHead(200, {
                "Content-Type": contentType
              });
              response.write(file, "binary");
              response.end();
            }
          });
        }
      }
    });
  })
  .listen(PORT);
console.log(" run success ===========> Server runing at port: " + PORT + "...");
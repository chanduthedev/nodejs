var Express = require("express");
const multer = require('multer');
var fs = require('fs');
var url = require('url')
var app = Express();

// reading configurations from the file
var config = require('./config.js')
HOST_IPADDRESS = config.HOST_IP;
PORTNUMBER = config.PORTNUMBER;

// App server starts listening for the request
app.listen(config.PORTNUMBER, () => console.log(`App server listening on port ${config.PORTNUMBER}!`))

// To test app server up and running or not from any client
app.get('/', (req, res) => res.send('This is the demo of uploading file using Multer!'))

// File location to store using Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// Mapping file location to multer
var upload = multer({ storage: storage })


// Validating request before uploading file 
// I am just checking for content type, 
// in real time scenario, you can add your own logic
var validate = function (request, response, next) {
  var contenType = request.headers['content-type']
  console.log("content-type:", request.headers['content-type'])
  if(!contenType.includes('form-data')){
    response.status(403).send("Not a valid request. Content type should be form-data ")
    console.log("Not a valid request. Content type should be form-data ")
    return;
  }
  next()
}

//Uploading file
// If you dont need validation before uploading, you can remove validate method 
app.post("/uploadfile", validate, upload.single("file"), function (request, response) {
  filename = request.file.originalname
  input_file = "uploads/" + filename
  response.writeHead(200);
  response.write(JSON.stringify({
    fileURL: request.file.originalname
  }));
  response.end();

});

// Downloading files
// If you want to validate request before downloading file, you can add validte method in 
// the request similar to post request as above
app.get("/download", function (request, response) {
  var uri = url.parse(request.url).pathname
  var filePath = 'uploads/' + request.query.filename
  fs.exists(filePath, function (exists) {
    if (exists) {
      console.log("Downloading from file system")
      return response.download(filePath);
    } else {
      console.log("File not found!!!")
      response.status(403).end('File not found!!!')
      return;
    }
  });
});
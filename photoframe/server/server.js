var Express = require("express");
swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
var app = Express();

// reading configurations from the file
var config = require('./config.js')
HOST_IPADDRESS = config.HOST_IP;
PORTNUMBER = config.PORTNUMBER;

// App server starts listening for the request
app.listen(7070, () => console.log(`App server listening on port ${config.PORTNUMBER}!`))

// To test app server up and running or not from any client
app.get('/', (req, res) => res.send('This is the demo of swagegr UI for API documentation!'))


// Swagger UI for api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

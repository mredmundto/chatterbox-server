var Message = require('./message.js');
var querystring = require('querystring');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = {
  results: [
    new Message ('Rafael', 'Hello, welcome to the chatterbox'),
    new Message ('Edmund', 'It\'s all good'),
  ]
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode;

  if (request.url !== '/classes/messages') {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
    return;
  }

  // collect POST data in here
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var method = request.method;

  if (method === 'POST') {
    statusCode = 201;

    var string = '';
    request.on('data', function(data) {
      // collect the data
      string += data.toString();
    });
    request.on('end', function() {
      // when data is complete, send back a new object
      var object = JSON.parse(string);
      messages.results.push(new Message(object.username, object.text, object.roomname));
      var copy = JSON.stringify(messages);
      // send object & return
      response.writeHead(statusCode, headers);
      // stringify messages object before sending
      response.end(copy);
    });
  } else if (method === 'GET' || method === 'OPTIONS') {
    statusCode = 200;
    var copy = JSON.stringify(messages);
    response.writeHead(statusCode, headers);
    response.end(copy);
  }

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;

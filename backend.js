var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

/* Optionally set port using first command line arg, default=8000 */
var args = process.argv.splice(2);
var port = parseInt(args[0]);
if (isNaN(port)) port = 8000;

/* Main datastore for topics, just a dictionary indexed by topicid */
var topics = new Object();
var next_topicid = 0;

/* Create a new topic and return its id */
function newTopic(text, link) {
    topics[next_topicid] = { "text" : text, "link" : link };
    return next_topicid++;
}

function runTests() {
    console.log("/// Beginning of tests ///");
    newTopic("Cool search engine", "http://google.com");
    newTopic("Special domain", "http://example.com");
    console.log(topics);
    console.log("/// End of tests ///"); 
}

http.createServer(function(request, response) {
	var url_parts = url.parse(request.url);

	switch(url_parts.pathname) {
	case '/':
	    displayIndex(url_parts.pathname, request, response);
	    break;
	case '/topic':
	    if (request.method == 'POST') {
		displayNewTopic(url_parts.pathname, request, response);
	    } else {
		display405(url_parts.pathname, request, response);
	    }
	    break;
	default:
	    display404(url_parts.pathname, request, response);
	}
	return;

	function display404(path, request, response) {
	    response.writeHead(404);
	    response.end();
	}

	function display405(path, request, response) {
	    response.writeHead(405);
	    response.end();
	}

	function display500(path, request, response) {
	    response.writeHead(500); 
	    response.end();
	}

	function displayNewTopic(path, request, response) {
	    /* XXX TODO some of this belongs in its own function */
	    var body = '';
	    request.on('data', function(chunk) {
		    body += chunk.toString();
		});
	    request.on('end', function() {
		    var decodedBody = querystring.parse(body);

		    /* XXX TODO validate decodedBody */
		    var topicid = newTopic(decodedBody['text'], decodedBody['link']);

		    response.writeHead(200, { 'Content-Type': 'text/html' });
		    response.end(topicid.toString());
		});
	}

	/* Serve index file */
	function displayIndex(path, request, response) {
	    fs.readFile('./index.html', function(error, content) {
		    if (error) {
			display500(path, request, response);
		    }
		    else {
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.end(content, 'utf-8');
		    }
		});
	}
    }).listen(port);

runTests();
console.log('Server running at http://127.0.0.1:' + port + '/');

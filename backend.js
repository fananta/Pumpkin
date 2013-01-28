var http = require('http');
var fs = require('fs');

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
	/* Serve index file */
        fs.readFile('./index.html', function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                }
            });
    }).listen(port);

runTests();
console.log('Server running at http://127.0.0.1:' + port + '/');

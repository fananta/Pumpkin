/* node packages */
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring');

/* Optionally set port using first command line arg, default=8000 */
var args = process.argv.splice(2);
var port = parseInt(args[0]);
if (isNaN(port)) port = 8000;

/* Main datastore for topics, just a dictionary indexed by topicid */
var topics = new Object();
var next_topic_id = 0;

/* Create a new topic and return its id */
function newTopic(text, link) {
    topics[next_topic_id] = { "text" : text, "link" : link };
    return next_topic_id++;
}

/* tests for rendering */
function runTests() {
    console.log("*** Beginning of tests ***");

    /* populate with test topics */
    newTopic("Cool search engine", "http://google.com");
    newTopic("Special domain", "http://example.com");

    console.log(topics);
    console.log("*** End of tests ***");
}

http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname,
            query = url.parse(request.url).query;
	
        /***** HANDLERS *****/
        var handle = {}
        handle["/"] = displayIndex;
        handle["/topic/all"] = getAllTopics;
        handle["/topic/add"] = addTopic;
        handle["/topic/reply/add"] = addReply;

        /***** ROUTER *****/
        if (typeof handle[pathname] === 'function') {
            console.log("Routing a request for " + pathname);
            handle[pathname](request, response);
        } else {
            console.log("No request handler found for " + pathname);
            displayError(response, 404);
        }

        /* error handler */
        function displayError(response, error_code) {
            error_msg = error_code + " not found"
            _writeHead(response, error_code, 'plain');
            _writeBody(response, error_msg);
        }

        /***** REQUEST HANDLERS *****/

        /* GET --> /topic/all */
        function getAllTopics(request, response) {
            _writeHead(response, 200, 'json');
            _writeBody(response, JSON.stringify(topics));
        }

        //REFACTOR
        /* POST --> /topic/add */
        function addTopic(request, response) {
            /* XXX TODO some of this belongs in its own function */
            var body = '';
            request.on('data', function(chunk) {
                    body += chunk.toString();
                });
            request.on('end', function() {
                    var decodedBody = querystring.parse(body);

                    /* XXX TODO validate decodedBody */
                    var topicid = newTopic(decodedBody['text'], decodedBody['link']);

                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(topicid.toString());
                });
        }

        //INCOMPLETE
        /* POST --> /topic/reply/add?topicid=XX&replyid=YY */
        function addReply(request, response) {
            params = querystring.parse(query);
            display_msg = "Topic id: " + params.topicid + "\nReply id: " + params.replyid);

            _writeHead(response, 200, 'plain');
            _writeBody(response, display_msg);
            console.log(params);
        }

        //REFACTOR
        /* Serve page index.html */
        function displayIndex(request, response) {
            fs.readFile("./index.html", function(error, content) {
                    if (error) {
                        displayError(response, 500);
                    }
                    else {
                        _writeHead(response, 200, "html");
                        _writeBody(response, content)
                    }
                });
        }

        /***** HELPER FUNCTIONS *****/
        function _writeHead(response, html_code, content_type) {
            if (content_type === "plain" || content_type === "html") {
                content_type = "text/" + content_type;
            } else if (content_type === "json") {
                content_type = "application/" + content_type;
            } else {
                content_type = "text/plain";
            }
            response.writeHead(html_code, {"Content-Type": content_type});
        }

        function _writeBody (response, body_content, encoding) {
            encoding = typeof encoding !== "undefined" ? encoding : "utf-8";
            response.write(body_content);
            response.end();
        }

    }).listen(port);

runTests();
console.log("Server running at http://127.0.0.1:" + port + "/");


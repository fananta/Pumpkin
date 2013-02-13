/* node packages */
var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    querystring = require("querystring");

/* optionally set port using first command line arg, default=30925 */
var args = process.argv.splice(2);
var port = parseInt(args[0]);
if (isNaN(port)) port = 30925;

/* singleton ID generator */
var id = {
    next_id: 0,
    getNext: function() { return id.next_id++; }
}

/* all topics and replies stored in an Object */
var nodes = {};
var topic_ids = [];

/* create a new topic and return its id */
function newTopic(text, link) {
    var topic_id = id.getNext();
    var topic = {
        "id": topic_id, 
        "text": text, 
        "link": link,
        "votes": 0,
        "replies": {}
    }

    nodes[topic_id] = topic;
    topic_ids.push(topic_id);
    return topic_id;
}

/* create a new reply to main topic and return its id */
function newReplyToTopic(topic_id, text) {
    var reply_id = id.getNext();
    var reply = {
        "id": reply_id,
        "text": text,
        "votes": 0,
        "replies": {}
    }

    nodes[reply_id] = reply;
    nodes[topic_id].replies[reply_id] = reply;
    return reply_id;
}


/* create a new reply to another reply and return its id */
function newReplyToReply(topic_id, parent_id, text) {
    var reply_id = id.getNext(),
        reply = {
            "id": reply_id,
            "text": text,
            "votes": 0,
            "replies": {}
        }

    nodes[reply_id] = reply;
    nodes[parent_id].replies[reply_id] = reply;
    return reply_id;
}

function getTopics() {
    var topics = Object();
    for (var i in topic_ids) {
        topics[topic_ids[i]] = nodes[topic_ids[i]];
    }

    return topics;
}

/* tests for rendering */
// function runTests() {
    // console.log("*** Beginning of tests ***");

    // /* populate with test topics */
    // newTopic("Cool search engine", "http://google.com"); //id = 1
    // newTopic("Special domain", "http://example.com"); //id = 2

    // /* add replies to topics */
    // newReplyToTopic(0, "just a reply"); //id = 3
    // newReplyToTopic(1, "oohhh.. i like this a lot"); //id = 4

    // newReplyToReply(1, 3, "really?"); //id = 5
    // newReplyToReply(1, 3, "sure."); //id = 6

    // console.log(nodes);
    // console.log("*** End of tests ***");
// }

http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname,
            query = url.parse(request.url).query;
	
        /***** HANDLERS *****/
        var handle = {}
        handle["/"] = displayIndex;
        handle["/lightpaperfibers.png"] = displayStaticBG;
        handle["/jquery-1.9.0.min.js"] = displayStaticJQuery;
        handle["/topic/all"] = getAllTopics;
        handle["/topic/add"] = addTopic;
        handle["/topic/reply/all"] = getAllReplies; //for specified topic
        handle["/topic/reply/add"] = addReply;
        handle["/topic/reply/upvote"] = upvoteReply;

        /***** ROUTER *****/
        if (typeof handle[pathname] === 'function') {
            console.log("Routing a request for " + pathname);
            handle[pathname](request, response);
        } else {
            console.log("No request handler found for " + pathname);
            _displayError(response, 404);
        }

        /***** REQUEST HANDLERS *****/

        /* GET /topic/all --> JSON of all topics */
        function getAllTopics(request, response) {
            _writeHead(response, 200, 'json');
            _writeBody(response, JSON.stringify(getTopics()));
        }

        /* POST /topic/add?text=XX&link=YY --> JSON of topic added */
        function addTopic(request, response) {
            var params = querystring.parse(query);
            var topic_id = newTopic(params.text, params.link);
            _writeHead(response, 200, 'json')
            _writeBody(response, JSON.stringify(nodes[topic_id]));

            /*
            var body = '';
            request.on('data', function(chunk) {
                    body += chunk.toString();
                });
            request.on('end', function() {
                    var parsed_body = querystring.parse(body);
                    var topic_id = newTopic(parsed_body['text'], parsed_body['link']);
                    console.log(parsed_body);
                    _writeHead(response, 200, 'html');
                    _writeBody(response, topic_id.toString());
                });
            */
        }

        /* GET /topic/reply/all?topicid=XX --> JSON of all replies for specified topic */
        function getAllReplies(request, response) {
            var params = querystring.parse(query);
            var topic_id = params.topicid;

            if (typeof nodes[topic_id] === "undefined") {
                _displayError(response, 500, "invalid topicid");
            } else {
                _writeHead(response, 200, "json");
                _writeBody(response, JSON.stringify(nodes[topic_id].replies));
            }
        }

        /* POST /topic/reply/add?topicid=XX&parentid=YY&text=ZZ --> JSON of reply added */
        function addReply(request, response) {
            var params = querystring.parse(query),
                topic_id = params.topicid,
                parent_id = params.parentid,
                reply_text = params.text,
                reply_id;

            if (typeof parent_id === "undefined") {
                reply_id = newReplyToTopic(topic_id, reply_text);
                _writeHead(response, 200, 'json');
                _writeBody(response, JSON.stringify(nodes[topic_id].replies[reply_id]));
            } else {
                reply_id = newReplyToReply(topic_id, parent_id, reply_text)
                var parent_reply = nodes[parent_id];
                _writeHead(response, 200, 'json');
                _writeBody(response, JSON.stringify(parent_reply.replies[reply_id]));
            }
        }

        /* POST /topic/reply/upvote?replyid=YY --> nothing */
        function upvoteReply(request, response) {
            var params = querystring.parse(query),
                reply_id = params.replyid;

            nodes[reply_id].votes++;

            _writeHead(response, 200, 'text');
            _writeBody(response, 'success');
        }

        /* serve page index.html */
        function displayIndex(request, response) {
            fs.readFile("./index.html", function(error, content) {
                    if (error) {
                        _displayError(response, 404);
                    }
                    else {
                        _writeHead(response, 200, "html");
                        _writeBody(response, content)
                    }
                });
        }

        /* serve static files */
        function displayStaticBG(request, response) {
            fs.readFile("./lightpaperfibers.png", function(error, content) {
                    if (error) {
                        _displayError(response, 404);
                    }
                    else {
                        _writeHead(response, 200, "png");
                        _writeBody(response, content)
                    }
                });
        }

        function displayStaticJQuery(request, response) {
            fs.readFile("./jquery-1.9.0.min.js", function(error, content) {
                    if (error) {
                        _displayError(response, 404);
                    }
                    else {
                        _writeHead(response, 200, "js");
                        _writeBody(response, content)
                    }
                });
        }

        /***** HELPER FUNCTIONS *****/

        /* error handler */
        function _displayError(response, error_code, error_msg) {
            error_msg = typeof error_msg !== "undefined" ? error_code + " " + error_msg : error_code + " not found";
            _writeHead(response, error_code, 'plain');
            _writeBody(response, error_msg);
        }

        /* helper for response.writeHead */
        function _writeHead(response, html_code, content_type) {
            if (content_type === "plain" || content_type === "html") {
                content_type = "text/" + content_type;
            } else if (content_type === "json" || content_type === "js") {
                content_type = "application/" + content_type;
            } else if (content_type === "png") {
                content_type = "image/" + content_type;
            } else {
                content_type = "text/plain";
            }
            response.writeHead(html_code, {"Content-Type": content_type});
        }

        /* helper for response.write */
        function _writeBody (response, body_content, encoding) {
            encoding = typeof encoding !== "undefined" ? encoding : "utf-8";
            response.write(body_content);
            response.end();
        }

    }).listen(port);

//runTests();
console.log("Server running at http://127.0.0.1:" + port + "/");


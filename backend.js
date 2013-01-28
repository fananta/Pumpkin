var http = require('http');
var fs = require('fs');

/* Optionally set port using first command line arg, default=8000 */
var args = process.argv.splice(2);
var port = parseInt(args[0]);
if (isNaN(port)) port = 8000;

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

console.log('Server running at http://127.0.0.1:' + port + '/');

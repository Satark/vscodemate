#!/usr/bin/env python3
"""
Very simple HTTP server in python for logging requests
Usage::
    ./server.py [<port>]
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json
from urllib import response

snippets = [
    """
    sum = 0
    for i in xrange(10):
        sum += i
    """,
    """
    the quick brown fox jumps over the lazy dog
    dog
    fox
    cat
    """,
    """
    def _set_response(self, code=200):
        self.send_response(code)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
    """
]

class S(BaseHTTPRequestHandler):
    def _set_response(self, code=200):
        self.send_response(code)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        secret_key = self.headers.get("secret_key")
        if secret_key != "hunter2":
            self._set_response(403)
            return

        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        logging.info("POST request,\nPath: %s\nHeaders:\n%s",
                str(self.path), str(self.headers))
        req = json.loads(post_data.decode('utf-8'))

        resp = {
            "completions": [{"text": s} for s in snippets]
        }

        self._set_response()
        self.wfile.write(json.dumps(resp).encode("utf-8"))

def run(server_class=HTTPServer, handler_class=S, port=8755):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()

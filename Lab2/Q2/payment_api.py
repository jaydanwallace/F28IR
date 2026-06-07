#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

PORT = 5050

class PaymentAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _send_json(self, payload, status_code=200):
        self._set_headers(status_code)
        self.wfile.write(json.dumps(payload).encode())

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == '/step5':
            self._send_json({'status': 'Payment Integration Completed'})
        elif self.path == '/step6':
            self._send_json({'status': 'Bank Payment Authorized'})
        elif self.path == '/step7':
            self._send_json({'status': 'Delivery Order Issued'})
        elif self.path == '/step8':
            self._send_json({'status': 'Customer has been notified'})
        else:
            self._send_json({'error': 'Not found'}, status_code=404)


def run_server():
    server = HTTPServer(('0.0.0.0', PORT), PaymentAPIHandler)
    print(f'Payment API running at http://localhost:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down Payment API server')
        server.server_close()

if __name__ == '__main__':
    run_server()

#!/usr/bin/env python3
"""
Simple HTTP server for Ocean Loop project
Handles CORS and proper MIME types
"""

import http.server
import socketserver
import os
import sys

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging
        sys.stdout.write("[%s] %s\n" % (self.log_date_time_string(), format % args))

def main():
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("=" * 60)
    print("🌊 Ocean Loop - Local Development Server")
    print("=" * 60)
    print(f"📂 Serving directory: {os.getcwd()}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    print()

    Handler = MyHTTPRequestHandler

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"\n❌ Error: Port {PORT} is already in use!")
            print("   Try running: pkill -f http.server")
            print(f"   Or use a different port: python3 serve.py {PORT + 1}")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()

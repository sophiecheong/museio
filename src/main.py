import SimpleHTTPServer
import SocketServer
import os

PORT = 8000
path = './src/public'

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
SocketServer.TCPServer.allow_reuse_address = True
os.chdir(path)

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
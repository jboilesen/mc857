from queryparser import parse
from dados import doService
import BaseHTTPServer

#prologo padrao para textos xml
prolog = '<?xml version="1.0" encoding="UTF-8"?>\n'

# servidor (trata apenas o metodo get
class Server857(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        #print self.path
        if self.path == "/favicon.ico":  #elimina sujeira do Chrome
            return 
        parms = parse(self.path)  #parsing da url
        resp = doService(parms)   #atende ao servico (retorna string xml c/ a resposta)
        if (resp != None) and (resp != ""):
            self.send_response(200)
            self.send_header("Content-type","text/xml")
            self.end_headers()
            self.wfile.write(prolog)
            self.wfile.write(resp)
        else:
            self.send_error(404, "invalid request")


httpserver = BaseHTTPServer.HTTPServer(("",8000), Server857)
httpserver.serve_forever()


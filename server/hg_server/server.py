
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "server for hg"

import os,sys
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.template
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from data_provider import DataProvider

class MyApplication(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", DefaultRequestHandler),
			(r"/add_comb?", AddCombRequestHandler),
			(r"/edit_comb?", EditCombRequestHandler),
			(r"/visit_comb?", VisitCombRequestHandler),
			(r"/add_taste?", AddTasteRequestHandler),
			(r"/register?", RegisterRequestHandler),
			(r"/enroll?", EnrollRequestHandler)
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class DefaultRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
		self.write('Hello, world')
			
class VisitCombRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
		comb_id = self.get_argument('comb')
		bee_id = self.get_argument('bee')
		comb = data_provider.get_comb(comb_id)
		tastes = data_provider.get_tastes(comb_id, bee_id)
        self.render('visit_comb.html')

data_provider = DataProvider()

if __name__ == "__main__":
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()

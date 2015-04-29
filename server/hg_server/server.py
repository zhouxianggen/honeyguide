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
import ConfigParser
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from data_provider import DataProvider

class MyApplication(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", DefaultRequestHandler),
            (r"/visit_comb?", VisitCombRequestHandler),
			(r"/comb_manager?", CombManagerRequestHandler)
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
        comb = data_provider.get_comb(comb_id, bee_id)
        self.render('visit_comb.html', comb=comb)

class CombManagerRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
        act = self.get_argument('act')
		if act == 'get_created_combs':
			return self.get_created_combs()
	
	def get_created_combs(self):
        bee_id = self.get_argument('bee')
        combs = data_provider.get_created_combs(bee_id)
		
		result = '{"combs":[%s]}' % ', '.join([json.dump(c, ensure_ascii=False) for c in combs])
        self.write(result)
		
data_provider = DataProvider()

if __name__ == "__main__":
    cfg = ConfigParser.ConfigParser()
    cfg.read(sys.argv[1])
    data_provider.init(cfg)
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()

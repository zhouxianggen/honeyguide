
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__info__ = "test"

import os,sys
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.template
import ConfigParser

class MyApplication(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", DefaultRequestHandler)
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "./"),
            static_path=os.path.join(os.path.dirname(__file__), "./"),
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class DefaultRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
     def get(self):
        self.render('browse_comb.html')

if __name__ == "__main__":
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()


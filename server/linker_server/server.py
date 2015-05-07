
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__info__ = "sample of linkers"

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
            (r"/free_call?", FreeCallRequestHandler),
            (r"/feng_express?", FengExpressRequestHandler),
            (r"/go_taobao?", GoTaobaoRequestHandler)
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
        
class FreeCallRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def post(self):
        #data = self.request.data
        # 使用 hg publick key 对data进行解密
        return self.get()
    
    #@tornado.web.authenticated
    def get(self):
        print 'FreeCallRequestHandler %s' % self.request.uri
        act = self.get_argument('act')
        if act == 'set_linker':
            return self.set_linker()
        if act == 'click_linker':
            return self.click_linker()
        if act == 'set_phone_number':
            return self.set_phone_number()
            
    def set_linker(self):
        comb = self.get_argument('comb')
        self.render('linker_free_call.html', comb=comb)
        
    def click_linker(self):
        comb = self.get_argument('comb')
        bee = self.get_argument('bee')
        self.render('click_free_call.html')
        
    def set_phone_number(self):
        comb = self.get_body_argument('comb', '')
        phone_number = self.get_body_argument('phone_number', '')
        data_provider.set_phone_number(comb, phone_number)

class FengExpressRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
     def get(self):
        self.write('Hello, world')

class GoTaobaoRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
     def get(self):
        self.write('Hello, world')

data_provider = DataProvider()

if __name__ == "__main__":
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()


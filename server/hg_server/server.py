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
            (r"/comb?", CombRequestHandler),
            (r"/waggles?", WagglesRequestHandler),
            (r"/comb_manager?", CombManagerRequestHandler),
            (r"/account_manager?", AccountManagerRequestHandler),
            (r"/linker_manager?", LinkerManagerRequestHandler)
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            cookie_secret='__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__',
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class DefaultRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
        self.write('Hello, world')

class CombRequestHandler(tornado.web.RequestHandler):
    def get(self):
        print 'CombRequestHandler: %s' % self.request.uri
        
        comb_id = self.get_argument('comb_id')
        comb = data_provider.get_comb(comb_id)
        if not comb:
            self.render('comb_404.html')
            return
        
        bee_cookie = self.get_secure_cookie('bee_cookie')
        if not bee_cookie:
            bee = data_provider.generate_anonymous_bee()
            self.set_secure_cookie('bee_cookie', bee.id)
        else:
            bee = data_provider.get_bee(bee_cookie)
            if not bee:
                bee = data_provider.generate_anonymous_bee()
                self.set_secure_cookie('bee_cookie', bee.id)
        
        waggles = data_provider.get_waggles(comb_id, bee.id, 0, 10)
        if not waggles:
            waggles = data_provider.get_latest_waggles(comb_id)
            
        self.render('comb.html', comb=comb, waggles=waggles)
        
class WagglesRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def options(self):
        self.write('ok')
        
    def get(self):
        return self.post()
     
    def post(self):
        print 'WagglesRequestHandler: %s' % self.request.uri
        comb_id = self.get_argument('comb_id')
        bee_id = self.get_argument('bee_id')
        start = self.get_argument('start')
        count = self.get_argument('count')
        waggles = data_provider.get_waggles(comb_id, bee_id, start, count)
        self.write(genereate_waggles_inner_html(waggles))
        
class VisitCombRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
        print 'VisitCombRequestHandler: %s' % self.request.uri
        comb_id = self.get_argument('comb')
        bee_id = self.get_argument('bee', default='')
        status, comb, linkers, waggles = data_provider.get_comb(comb_id, bee_id)
        print 'comb:', comb
        print 'linkers:', linkers
        print 'waggles:', waggles
        self.render('visit_comb.html', comb=comb, linkers=linkers, waggles=waggles)

class CombManagerRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def post(self):
        return self.get()
    
    #@tornado.web.authenticated
    def get(self):
        act = self.get_argument('act')
        print 'CombManagerRequestHandler.%s' % act
        if act == 'get_created_combs':
            return self.get_created_combs()
        if act == 'add_comb':
            return self.add_comb()
    
    def get_created_combs(self):
        bee_id = self.get_argument('bee')
        combs = data_provider.get_created_combs(bee_id)
        result = {"status": "ok", "combs": combs}
        #result = '{"combs":[%s]}' % ', '.join([json.dumps(c, ensure_ascii=False) for c in combs])
        print json.dumps(result, ensure_ascii=False)
        self.write(json.dumps(result, ensure_ascii=False))
    
    def add_comb(self):
        data = self.request.body
        print 'request body is [%s]' % data
        bee_id = self.get_body_argument('bee', '')
        comb = self.get_body_argument('comb', '')
        print 'bee=[%s] comb=[%s]' % (bee_id, comb)
        status, reason = data_provider.add_comb(bee_id, comb)
        result = {"status": status, "reason": reason}
        print json.dumps(result, ensure_ascii=False)
        self.write(json.dumps(result, ensure_ascii=False))
 
class AccountManagerRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def post(self):
        print 'AccountManager post %s' % self.request.uri
        act = self.get_argument('act')
        if act == 'login':
            return self.login()
        if act == 'register':
            return self.register()
    
    def login(self):
        data = self.request.body
        print 'request body is [%s]' % data
        username = self.get_body_argument('username', '')
        password = self.get_body_argument('password', '')
        print 'username=[%s] password=[%s]' % (username, password)
        status, account = data_provider.get_account(username, password)
        result = {"status": status, "account": account}
        self.write(json.dumps(result, ensure_ascii=False))
 
class LinkerManagerRequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def post(self):
        print 'LinkerManager post %s' % self.request.uri
        act = self.get_argument('act')
        if act == 'get_linkers':
            return self.get_linkers()
    
    def get_linkers(self):
        data = self.request.body
        print 'request body is [%s]' % data
        bee_id = self.get_body_argument('bee', '')
        status, linkers = data_provider.get_linkers(bee_id)
        result = {"status": status, "linkers": linkers}
        self.write(json.dumps(result, ensure_ascii=False))
      
data_provider = DataProvider()

if __name__ == "__main__":
    cfg = ConfigParser.ConfigParser()
    cfg.read(sys.argv[1])
    data_provider.init(cfg)
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()

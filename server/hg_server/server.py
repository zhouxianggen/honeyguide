# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "server for hg"

import os,sys
import time, datetime
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.template
import ConfigParser
import base64
import rsa
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from define import *
from data_provider import DataProvider
from util import *

class MyApplication(tornado.web.Application):
    def __init__(self):
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            cookie_secret='__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__',
            debug=True,
        )
        handlers = [
            (r"/", DefaultRequestHandler),
            (r"/visit_comb?", VisitCombRequestHandler),
            (r"/enroll?", EnrollRequestHandler),
            (r"/comb?", CombRequestHandler),
            (r"/waggles?", WagglesRequestHandler),
            (r"/content?", ContentRequestHandler),
            (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': settings['static_path']}),
            (r"/upload?", UploadRequestHandler),
            (r"/comb_manager?", CombManagerRequestHandler),
            (r"/account_manager?", AccountManagerRequestHandler),
            (r"/linker_manager?", LinkerManagerRequestHandler)
        ]
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

        # bee_id is requried in url
        bee_id = self.get_argument('bee_id')
        if not bee_id:
            bee_cookie = self.get_secure_cookie('bee_cookie')
            if not bee_cookie:
                bee = data_provider.generate_anonymous_bee()
                if not bee:
                    self.render('server_error.html')
                    return
            else:
                bee = data_provider.get_bee(bee_cookie)
                if not bee:
                    bee = data_provider.generate_anonymous_bee()
                    if not bee:
                        self.render('server_error.html')
                        return
            self.set_secure_cookie('bee_cookie', bee['id'])
            url = set_url_param(self.request.full_url(), 'bee_id', bee['id'])
            self.redirect(url)
            return

        bee = data_provider.get_bee(bee_id)
        if not bee:
            bee = data_provider.generate_anonymous_bee()
            if not bee:
                self.render('server_error.html')
                return
            self.set_secure_cookie('bee_cookie', bee['id'])
            url = set_url_param(self.request.full_url(), 'bee_id', bee['id'])
            self.redirect(url)
            return
        
        waggles = data_provider.get_waggles(comb_id, bee['id'], 0, 10)
        self.render('comb.html', comb=comb, bee=bee, waggles=waggles)
 
class EnrollRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def options(self):
        self.write('ok')
        
    def get(self):
        return self.post()
     
    def post(self):
        print 'EnrollRequestHandler: %s' % self.request.uri
        print 'EnrollRequestHandler body: %s' % self.request.body
        username = self.get_body_argument('username')
        password = self.get_body_argument('password')
        try:
            username = decrypt(username)
            password = decrypt(password)
            print username, password
        except Exception as e:
            self.write('{"status": "数据解析错误", "id": ""}')
        status, bee_id = data_provider.enroll_bee(username, password)
        if status == 'ok':
            bee_id = encrypt(bee_id)
            self.set_secure_cookie('bee_cookie', bee_id)
        self.write('{"status": "%s", "bee_id": "%s"}' % (status, bee_id))
 
class ContentRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def options(self):
        self.write('ok')
        
    def get(self):
        return self.post()
     
    def post(self):
        print 'ContentRequestHandler: %s' % self.request.uri
        id = self.get_argument('id')
        content_type, content = data_provider.get_content(id)
        if content:        
            self.set_header("Content-Type",  content_type)
            self.write(content)
        else:
            self.set_header("Content-Type", 'image/jpg')
            self.write(open('d.jpg', 'rb').read())

class UploadRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def options(self):
        self.write('ok')
        
    def get(self):
        return self.post()
     
    def post(self):
        print 'UploadRequestHandler: %s' % self.request.full_url()
        print 'UploadRequestHandler: %s' % self.request.uri
        comb_id =  decrypt(self.get_body_argument('comb_id'))
        if comb_id == None:
            self.write('error comb id')
            return
        bee_id = decrypt(self.get_body_argument('bee_id'))
        if bee_id == None:
            self.write('error bee id')
            return
        signature = self.get_body_argument('signature', '')
        if signature:
            signature = decrypt(signature)
            if signature == None:
                self.write('error signature')
                return
        print comb_id, bee_id, signature

        ts = int(time.time() * 1000)
        waggle = {}
        key = joins([comb_id, bee_id, signature, ts])
        waggle['id'] = encrypt(key, urlsafe=True)
        waggle['type'] = self.get_body_argument('card_type')
        waggle['notes'] = self.get_body_argument('card_notes')
        try:
            waggle['content_type'] = self.request.files['upload'][0]['content_type']
            waggle['content'] = self.request.files['upload'][0]['body']
            waggle['id'] += '.' +  waggle['content_type'].split('/')[1]
            path = '%s/static/uploads/%s' % (CWD, waggle['id'])
            print path
            open(path, 'wb').write(waggle['content'])
            waggle['content'] = base64.b64encode(waggle['content'])
        except Exception as e:
            self.write('no content')
            return

        status = data_provider.add_waggle(waggle)
        if status == 'ok':
            status = data_provider.add_action_waggle(comb_id, bee_id, signature, waggle['id'], ts)
            if status == 'ok':
                self.write('ok')
                return
        self.write('database error')
        return
      
class WagglesRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def options(self):
        self.write('ok')
        
    def get(self):
        return self.post()
     
    def post(self):
        print 'WagglesRequestHandler: %s' % self.request.uri
        print 'WagglesRequestHandler body: %s' % self.request.body
        comb_id = self.get_body_argument('comb_id')
        bee_id = self.get_body_argument('bee_id')
        start = int(self.get_body_argument('start'))
        count = int(self.get_body_argument('count'))
        print comb_id, bee_id, start, count
        status, waggles = data_provider.get_waggles(comb_id, bee_id, start, count)
        print status, waggles
        if waggles:
            result = ''
            for w in waggles:
                result += '<div class="image_card" data-url="http://img5.duitang.com/uploads/item/201407/01/20140701222150_k4MdG.thumb.700_0.jpeg" data-date="2015-06-10" data-likes="2" data-reward=""></div>\n'
            self.write(result)
        
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

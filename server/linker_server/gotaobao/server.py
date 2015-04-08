
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-26"
__info__ = "samle linker server for open taobao url"

import os,sys
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.template

ACTION_SET = 'set'
ACTION_USE = 'use'

class DataProvider(object):
    def __init__(self):
        pass
    
    def get_source_data(self, source_id):
        source = {}
        source['url'] = u'http://a.m.taobao.com/i44108014217.htm?spm=0.0.0.0&rn=78857c0c03427aae366bed32337c5332'
        #source['url'] = u'http://www.goalhi.com'
        source['title'] = u'veromoda'
        return source

    def get_user_data(self, user_id):
        return ''

class MyApplication(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", RequestHandler),
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)
        
class RequestHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
        self.post()

    #@tornado.web.authenticated
    def post(self):
        action = self.get_argument('action')
        if action == ACTION_SET:
            pass
        elif action == ACTION_USE:
            source_id = self.get_argument('source_id')
            user_id = self.get_argument('user_id')
            self.handle_action_use(source_id, user_id)
        else:
            pass

    def handle_action_use(self, source_id, user_id):
        # get source data
        data_provider = DataProvider()
        source = data_provider.get_source_data(source_id)

        # get user data
        user = data_provider.get_user_data(user_id)

        # make result
        self.render('gotaobao.html', title=source['title'], url=source['url']);

if __name__ == "__main__":
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()


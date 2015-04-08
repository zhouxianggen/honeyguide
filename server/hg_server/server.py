
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

ACTION_VIEW_COMB = 'view_comb'
ACTION_ADD_SHARE = 'add_share'

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
        self.render('test.html')
        return
        action = self.get_argument('action')
        if action == ACTION_VIEW_COMB:
            self.handle_action_view_comb()
        elif action == ACTION_ADD_SHARE:
            self.handle_action_add_share()
        
    def handle_action_view_comb(self):
        comb_id = self.get_argument('comb_id')
        sharer_id = self.get_argument('sharer_id')        
        comb = g_data_provider.get_comb(comb_id)
        pages = comb.get_pages(sharer_id)
        linkers = comb.get_linkers()
        self.render('view_comb.html', title=comb.title, pages=pages, linkers=linkers)

    def handle_action_add_share(self):
        self.render('add_share.html', title=u'share')

g_data_provider = DataProvider()

if __name__ == "__main__":
    server = tornado.httpserver.HTTPServer(MyApplication())
    server.listen(80)
    tornado.ioloop.IOLoop.instance().start()

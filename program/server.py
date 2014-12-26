# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou@shenma-inc.com"
__date__ = "2014-11-13"
__info__ = "***"

import os,sys
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.template


class EntryModule(tornado.web.UIModule):
    def render(self, entry):
        return self.render_string("modules/entry.html", entry=entry)


class Application(tornado.web.Application):
    def __init__(self, cfg):
        self.cfg = cfg
        handlers = [
            (r"/", MainHandler),
            (r"/category/edit", CategoryEditHandler),
        ]
        settings = dict(
            site_title=u"神马APP数据平台",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            ui_modules={"Entry": EntryModule},
            xsrf_cookies=True,
            cookie_secret="__SHENMA_APP_PLATFORM__",
            login_url="/login",
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("hello")


class CategoryEditHandler(tornado.web.RequestHandler):
    @tornado.web.authenticated
    def get(self):
        self.post()

    @tornado.web.authenticated
    def post(self):
        id = self.get_argument("id", "0")
        self.render("category/edit.html", id=id)


if __name__ == "__main__":
    cfg = sys.argv[1]
    server = tornado.httpserver.HTTPServer(Application(cfg))
    server.listen(8890)
    tornado.ioloop.IOLoop.instance().start()


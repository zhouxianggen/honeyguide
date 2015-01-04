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


class Application(tornado.web.Application):
	def __init__(self, cfg):
		handlers = [
			(r"/", MainPageHandler),
			#(r"/login", LoginHandler),
			(r"/taste/view_card", TasteViewCardHandler),
		]
		settings = dict(
			cfg = cfg,
			template_path=os.path.join(os.path.dirname(__file__), "templates"),
			static_path=os.path.join(os.path.dirname(__file__), "static"),
			#login_url="/login",
			debug=True,
		)
		tornado.web.Application.__init__(self, handlers, **settings)


class MainPageHandler(tornado.web.RequestHandler):
	def get(self):
		self.write("MainPageHandler")
		self.write(self.application.settings['cfg'])


class LoginHandler(tornado.web.RequestHandler):
	def get(self):
		self.redirect(self.get_argument("next", "/"))

		
class TasteViewCardHandler(tornado.web.RequestHandler):
	#@tornado.web.authenticated
	def get(self):
		self.post()

	#@tornado.web.authenticated
	def post(self):
		self.write("TasteViewCardHandler")
		comb_id = self.get_argument("comb_id", "")
		share_id = self.get_argument("share_id", "")
		sort_by = self.get_argument("sort_by", "default")
		
		cfg = self.application.settings['cfg']
		comb = get_comb(cfg, comb_id)
		shares = get_shares(cfg, comb_id)
		self.render("taste_view_card.html")


if __name__ == "__main__":
	cfg = sys.argv[1]
	server = tornado.httpserver.HTTPServer(Application(cfg))
	server.listen(8890)
	tornado.ioloop.IOLoop.instance().start()

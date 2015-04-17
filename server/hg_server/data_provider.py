# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from waggle import Waggle
from comb import Comb
from mysql import sql_select

class DataProvider(object):
	def __init__(self, cfg):
		self.cfg = cfg
		pass
	
	def get_comb(self, comb_id, bee_id):
		comb = Comb()
		
		# get comb meta data
		columns = ['id', 'bee_id', 'title']
		where = "WHERE id='%s'" % comb_id
		rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns, where)
		if len(rows) != 1:
			return None
		id, bee_id, title = rows[0]
		comb.title = title
		
		# get comb linkers
		columns = ['linker_id']
		where = "WHERE comb_id='%s'" % comb_id
		ids = sql_select(self.cfg, 'hg_db', 'action_link', columns, where)
		for id in ids:
			columns = ['url', 'title', 'icon']
			where = "WHERE id='%s'" % id
			rows = sql_select(self.cfg, 'hg_db', 'meta_linker', columns, where)
			if len(rows) == 1:
				url, title, icon = rows[0]
				linker = {'id':id, 'title':title, 'icon':icon, 'url':url}
				comb.linkers.append(linker)
				
		# get waggles
		columns = ['content']
		where = "WHERE comb_id='%s' and bee_id='%s'" % (comb_id, bee_id)
		others = "ORDER BY date DESC LIMIT 10"
		rows = sql_select(self.cfg, 'hg_db', 'meta_waggle', columns, where)
		for r in rows:
			waggle = Waggle()
			if waggle.parse(r):
				comb.waggles.append(waggle)
		return comb

# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from waggle import Waggle
from linker import Linker
from comb import Comb
from mysql import sql_select

class DataProvider(object):
    def init(self, cfg):
        self.cfg = cfg
    
    def get_account(self, username, password):
        columns = ['id', 'name', 'password', 'avatar']
        where = "WHERE name='%s' and password='%s'" % (username, password)
        rows = sql_select(self.cfg, 'hg_db', 'meta_bee', columns, where)
        if len(rows) != 1:
            return '用户名或密码错误', {}
        account = {columns[i]:rows[0][i] for i in range(len(columns))}
        return 'ok', account

        for r in rows:
            combs.append({columns[i]:r[i] for i in range(len(columns))})
        return combs

    def get_created_combs(self, bee_id):
        combs = []
        columns = ['id', 'title', 'icon', 'url', 'waggle_count', 'taste_count']
        where = "WHERE bee_id='%s'" % bee_id
        rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns, where)
        for r in rows:
            combs.append({columns[i]:r[i] for i in range(len(columns))})
        return combs
        
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
                comb.linkers.append(Linker({'id':id, 'title':title, 'icon':icon, 'url':url}))
                
        # get waggles
        columns = ['content']
        where = "WHERE comb_id='%s' and bee_id='%s'" % (comb_id, bee_id)
        others = "ORDER BY date DESC LIMIT 10"
        rows = sql_select(self.cfg, 'hg_db', 'meta_waggle', columns, where)
        for r in rows:
            waggle = Waggle()
            if waggle.parse(r[0]):
                comb.waggles.append(waggle)
        return comb

    def get_linkers(self, bee_id):
        linkers = []
        columns = ['id', 'title', 'icon', 'url', 'description', 'price', 'click_count']
        rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns)
        for r in rows:
            linkers.append({columns[i]:r[i] for i in range(len(columns))})
        return linkers


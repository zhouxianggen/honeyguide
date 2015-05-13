# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
import json
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from waggle import Waggle
from linker import Linker
from comb import Comb
from mysql import sql_select, sql_execute

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

    def get_created_combs(self, bee_id):
        combs = []
        columns = ['id', 'title', 'icon', 'url', 'waggle_count', 'taste_count']
        where = "WHERE bee_id='%s'" % bee_id
        rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns, where)
        for r in rows:
            combs.append({columns[i]:r[i] for i in range(len(columns))})
        return combs
        
    def get_comb(self, comb_id, waggle_bee_id):
        # get comb meta data
        columns = ['id', 'bee_id', 'title', 'enable_share']
        where = "WHERE id='%s'" % comb_id
        rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns, where)
        if len(rows) != 1:
            return None
        comb = {columns[i]:rows[0][i] for i in range(len(columns))}
        
        # get linkers
        linkers = []
        columns = ['linker_id']
        where = "WHERE comb_id='%s'" % comb_id
        ids = sql_select(self.cfg, 'hg_db', 'action_link', columns, where)
        for id in ids:
            columns = ['id', 'url', 'title', 'icon']
            where = "WHERE id='%s'" % id
            rows = sql_select(self.cfg, 'hg_db', 'meta_linker', columns, where)
            if len(rows) == 1:
                d = {columns[i]:rows[0][i] for i in range(len(columns))}
                d['url'] = '%sact=click_linker&comb=%s&bee=%s' % (d['url'], comb_id, waggle_bee_id)
                linkers.append(d)
                
        # get waggles
        waggles = []
        columns = ['content']
        if waggle_bee_id:
            where = "WHERE comb_id='%s' and bee_id='%s'" % (comb_id, waggle_bee_id)
        else:
            where = "WHERE comb_id='%s'" % (comb_id)
        others = "ORDER BY date DESC LIMIT 10"
        rows = sql_select(self.cfg, 'hg_db', 'meta_waggle', columns, where)
        for r in rows:
            waggles.append(json.loads(r[0]))
        return 'ok', comb, linkers, waggles

    def add_comb(self, bee_id, comb):
        try:
            d = json.loads(comb)
            url = 'http://54.149.127.185/visit_comb?comb=%s' % d['id']
            icon = d['icon'] if d['icon'] else 'http://upload.wikimedia.org/wikipedia/commons/1/1a/H-Caracas_Sur.png'
            sql = 'INSERT INTO meta_comb (id, bee_id, title, icon, url) VALUES (%s, %s, %s, %s, %s)'
            args = (d['id'], bee_id, d['title'], icon, url)
            res = sql_execute(self.cfg, 'hg_db', sql, args)
            if res != 1:
                return 'error', 'add comb return %d' % res
            for linker in d['linkers']:
                sql = 'INSERT INTO action_link (comb_id, linker_id, date, address) VALUES (%s, %s, %s, %s)'
                args = (d['id'], linker['id'], 'CURRENT_TIMESTAMP', '')
                res = sql_execute(self.cfg, 'hg_db', sql, args)
                if res != 1:
                    return 'error', 'add action linke return %d' % res
            return 'ok', ''
        except Exception as e:
            return 'eception', str(e)
    
    def get_linkers(self, bee_id):
        linkers = []
        columns = ['id', 'title', 'icon', 'url', 'description', 'price', 'click_count']
        rows = sql_select(self.cfg, 'hg_db', 'meta_linker', columns)
        for r in rows:
            linkers.append({columns[i]:r[i] for i in range(len(columns))})
        if linkers:
            return 'ok', linkers
        return 'no linkers available', linkers


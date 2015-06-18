# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
import json
import rsa
import redis
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from define import *
from util import *
from waggle import Waggle
from linker import Linker
from comb import Comb
from mysql import sql_select, sql_execute

redis_server = redis.StrictRedis(host='localhost', port=6379, db=0)

class DataProvider(object):
    def init(self, cfg):
        self.cfg = cfg
    
    def get_bee(self, username, password):
        columns = ['id', 'name', 'password', 'avatar']
        where = "WHERE name='%s' and password='%s'" % (username, password)
        rows = sql_select(self.cfg, 'hg_db', 'meta_bee', columns, where)
        if len(rows) != 1:
            return '用户名或密码错误', None
        bee = {columns[i]:rows[0][i] for i in range(len(columns))}
        return 'ok', bee

    def enroll_bee(self, username, password):
        #id = encrypt('%s\1%s' % (username, password))
        id = joins([username, password])
        print 'enroll id is [%s]' % id
        columns = ['id', 'name', 'password', 'avatar']
        where = "WHERE id='%s'" % (id)
        rows = sql_select(self.cfg, 'hg_db', 'meta_bee', columns, where)
        if len(rows) > 0:
            return '此用户已经被注册，请更改名称或密码', None
        sql = 'INSERT INTO meta_bee (id, name, password, avatar) VALUES(%s, %s, %s, %s)'
        args = (id, username, password, '')
        res = sql_execute(self.cfg, 'hg_db', sql, args)
        if res != 1:
             return '服务器错误，请稍后再试', None
        return 'ok', id

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
    
    def get_comb(self, comb_id):
        # get comb meta data
        columns = ['id', 'bee_id', 'title', 'enable_share']
        where = "WHERE id='%s'" % comb_id
        rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns, where)
        if len(rows) != 1:
            return 'not exist', None
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
                linkers.append(d)
        
        comb['linkers'] = linkers
        return 'ok', comb
        
    def get_waggles(self, comb_id, bee_id, start, count):
        columns = ['id', 'bee_id', 'title', 'enable_share']
        where = "WHERE id='%s'" % comb_id
        rows = sql_select(self.cfg, 'hg_db', 'meta_comb', columns, where)
        if len(rows) != 1:
            return 'not exist', None
        comb = {columns[i]:rows[0][i] for i in range(len(columns))}
        
        waggles = []
        columns = ['content']
        # 对所有者，展现所有的waggle，否则只展现相应的waggle
        # 在没有引入用户关注关系前，这是个简化的处理逻辑
        if comb['bee_id'] != bee_id:
            where = "WHERE comb_id='%s' and bee_id='%s'" % (comb_id, bee_id)
        else:
            where = "WHERE comb_id='%s'" % (comb_id)
            
        others = "ORDER BY date DESC"
        rows = sql_select(self.cfg, 'hg_db', 'meta_waggle', columns, where, others)
        for r in rows[start:start+count]:
            waggles.append(json.loads(r[0]))
        return 'ok', waggles

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
    
    def add_waggle(self, waggle):
        props = ', '.join(waggle.keys())
        values = ', '.join(['%s' for x in waggle.values()])
        args = tuple(waggle.values())
        sql = 'INSERT INTO meta_waggle (%s) VALUES (%s)' % (props, values)
        res = sql_execute(self.cfg, 'hg_db', sql, args)
        if res != 1:
            return 'insert db error'
        return 'ok'
    
    def add_action_waggle(self, comb_id, bee_id, signature, waggle_id, ts):
        sql = 'INSERT INTO action_waggle (comb_id, bee_id, signature, waggle_id, time) VALUES (%s, %s, %s, %s, %s)'
        args = (comb_id, bee_id, signature, waggle_id, ts)
        res = sql_execute(self.cfg, 'hg_db', sql, args)
        if res != 1:
            return 'insert db error'
        return 'ok'

    def get_linkers(self, bee_id):
        linkers = []
        columns = ['id', 'title', 'icon', 'url', 'description', 'price', 'click_count']
        rows = sql_select(self.cfg, 'hg_db', 'meta_linker', columns)
        for r in rows:
            linkers.append({columns[i]:r[i] for i in range(len(columns))})
        if linkers:
            return 'ok', linkers
        return 'no linkers available', linkers

    def get_content(self, key):
        value = redis_server.get(key)
        if value:
            return value
        columns = ['content']
        where = "WHERE id='%s'" % key
        rows = sql_select(self.cfg, 'hg_db', 'meta_waggle', columns, where)
        if len(rows) != 1:
            return None
        content = rows[0][0]
        redis_server.set(key, content)
        return content


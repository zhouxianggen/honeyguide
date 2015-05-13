# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from mysql import sql_select, sql_execute

phone_numbers = {}

class DataProvider(object):
    def init(self, cfg):
        self.cfg = cfg
    
    def get_phone_number(self, comb):
        columns = ['phone']
        where = "WHERE comb='%s'" % comb
        rows = sql_select(self.cfg, 'linker_db', 'phone_number', columns, where)
        if len(rows) == 1:
            return rows[0][0]
        return ''
            
        
    def set_phone_number(self, comb, phone_number):
        n = self.get_phone_number(comb)
        if n:
            if n != phone_number:
                sql = 'update phone_number set phone=%s where comb=%s'
                args = (phone_number, comb)
            else:
                return
        else:
            sql = 'insert into phone_number (comb, phone) values (%s, %s)'
            args = (comb, phone_number)
        sql_execute(self.cfg, 'linker_db', sql, args)

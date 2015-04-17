
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__author__  = "xianggen.zhou@shenma-inc.com"
__date__    = "2014-07-11"
__info__    = "mysql api"

import sys, os, shutil, tempfile
import MySQLdb

def create_sql_conn(cfg, SECTION):
    host   = cfg.get(SECTION, 'host').decode('utf-8')
    port   = cfg.getint(SECTION, 'port')
    db     = cfg.get(SECTION, 'db').decode('utf-8')
    user   = cfg.get(SECTION, 'user').decode('utf-8')
    passwd = cfg.get(SECTION, 'passwd').decode('utf-8')
    conn   = MySQLdb.connect(host=host, port=port, user=user, passwd=passwd, db=db, charset="utf8")
    return conn

def sql_execute(cfg, SECTION, sql, args, try_count=1):
    r = -1
    for i in range(try_count):
        conn = create_sql_conn(cfg, SECTION)
        try:
            cursor= conn.cursor()
            r = cursor.execute(sql, args)
            conn.commit()
            break
        except Exception as e:
            log.exception(e)
            log.info(sql % args)
            conn.rollback()
        cursor.close()
        conn.close()
    return r

def sql_executemany(cfg, SECTION, sql, values, try_count=1):
    r = -1
    for i in range(try_count):
        conn = create_sql_conn(cfg, SECTION)
        try:
            cursor= conn.cursor()
            r = cursor.executemany(sql, values)
            conn.commit()
            break
        except Exception as e:
            log.exception(e)
            conn.rollback()
        cursor.close()
        conn.close()
    return r

def sql_select(cfg, SECTION, table, columns, where='', other=''):
    try:
        conn = create_sql_conn(cfg, SECTION)
        cur = conn.cursor()
        sql = "SELECT %s FROM %s" % (','.join(columns), table)
        if where:
            sql += ' ' + where
        if other:
            sql += ' ' + other
        cur.execute(sql)
        return cur.fetchall()
    except Exception as e:
        return []
		

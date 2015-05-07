# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)

phone_numbers = {}

class DataProvider(object):
    def init(self, cfg):
        self.cfg = cfg
    
    def set_phone_number(self, comb, phone_number):
        phone_numbers[comb] = phone_number
        return 'success'

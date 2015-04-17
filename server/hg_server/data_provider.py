
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "data provider"

import os,sys
import json
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from comb import Comb

class DataProvider(object):
    def __init__(self):
        pass
    
    def get_comb(self, comb_id):
        comb = Comb()
        return comb
	
	def get_tastes(self, comb_id, bee_id):
		pass

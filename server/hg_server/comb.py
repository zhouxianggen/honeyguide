
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "comb"

import os,sys
import json
from copy import copy

class Comb(object):
	def __init__(self):
		self.title = None
		self.linkers = []
		self.waggles = []

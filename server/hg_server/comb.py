
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "comb"

import os,sys
import json
from copy import copy
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from linker import Linker
from page import Page

class Comb(object):
    def __init__(self):
        self.title = u'VEROMODA 西城广场店'
    
    def get_pages(self, sharer_id):
        pages = []
        page = Page()
        
        page.image = 'static/img/page1.jpg'
        pages.append(copy(page))
        
        page.image = 'static/img/page2.jpg'
        pages.append(copy(page))
        
        page.image = 'static/img/page3.jpg'
        pages.append(copy(page))
        
        page.image = 'static/img/page4.jpg'
        pages.append(copy(page))
        
        page.image = 'static/img/page5.jpg'
        pages.append(copy(page))
        
        return pages

    def get_linkers(self):
        linkers = []
        linker = Linker()
        
        linker.icon = 'static/img/call1.jpg'
        linkers.append(copy(linker))
        
        linker.icon = 'static/img/express1.png'
        linkers.append(copy(linker))
        
        return linkers

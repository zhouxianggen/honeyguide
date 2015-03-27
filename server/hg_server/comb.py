
# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "comb"

import os,sys
import json
sys.path.append(CWD)
from linker import Linker
from page import Page

class Comb(object):
    def __init__(self):
        pass
    
    def get_pages(self):
		pages = []
		page = Page()
		
		page.image = '{{ static_url("img/page1.jpg") }}'
		pages.append(page.copy())
		
		page.image = '{{ static_url("img/page2.jpg") }}'
		pages.append(page.copy())
		
		page.image = '{{ static_url("img/page3.jpg") }}'
		pages.append(page.copy())
		
		page.image = '{{ static_url("img/page4.jpg") }}'
		pages.append(page.copy())
		
		page.image = '{{ static_url("img/page5.jpg") }}'
		pages.append(page.copy())
		
        return pages

    def get_linkers(self):
		linkers = []
		linker = Linker()
		
		linker.icon = '{{ static_url("img/call1.jpg") }}'
		linkers.append(linker.copy())
		
		linker.icon = '{{ static_url("img/express1.png") }}'
		linkers.append(linker.copy())
		
        return linkers

# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "linker"


class Linker(object):
     def __init__(self, options):
         self.id = options['id']
         self.title = options['title']
         self.url = options['url']
         self.icon = 'img/%s' % options['icon']
    

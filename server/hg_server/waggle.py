# -*- coding: utf-8 -*-
#!/usr/bin/env python

__auth__ = "xianggen.zhou"
__date__ = "2015-03-27"
__info__ = "waggle"

import json

class Note(object):
    def __init__(self, options):
        self.type = options['type']
        self.position_x = options['position_x']
        self.position_y = options['position_y']
        self.content = options['content']
        
class Waggle(object):
    def parse(self, s):
        try:
            d = json.loads(s)
            self.image = 'img/%s' % d['image']
            self.notes = [Note(n) for n in d['notes']]
            return True
        except Exception as e:
            print e
            return False

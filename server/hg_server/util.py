# -*- coding: utf-8 -*-
#!/usr/bin/env python

import os, sys
import httplib, urllib, urllib2, urlparse
import logging
import base64
import rsa
CWD = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CWD)
from define import *

logging.basicConfig(
    level = logging.INFO,
    format = "[%(asctime)s] %(levelname)-8s %(message)s",
    stream = sys.stderr
    )
log = logging

def joins(arr, j='<|>'):
    return j.join([str(x) for x in arr])

def set_url_param(url, key, value):                                                                                                   
    t = urlparse.urlparse(url)
    qs = {k:v if len(v)>1 else v[0] for k,v in urlparse.parse_qs(t.query).items()}
    qs[key] = value
    query = urllib.urlencode(qs)
    return urlparse.urlunparse((t.scheme, t.netloc, t.path, t.params, query, t.fragment))

def decrypt(data):
    try: 
        privkey = rsa.PrivateKey.load_pkcs1(RSA_1024_PRIV_PEM)
        return rsa.decrypt(base64.b64decode(data), privkey)
    except Exception as e:
        return None

def encrypt(data, urlsafe=False):
    try:
        pubkey = rsa.PublicKey.load_pkcs1_openssl_pem(RSA_1024_PUB_PEM)
        #pubkey = rsa.PrivateKey.load_pkcs1(RSA_1024_PUB_PEM)
        if urlsafe:
            return base64.urlsafe_b64encode(rsa.encrypt(data, pubkey))
        else:
            return base64.b64encode(rsa.encrypt(data, pubkey))
    except Exception as e:
        print 'encrypt error'
        print e
        return None


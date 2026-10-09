import pathlib as _pl
ROOT=_pl.Path(__file__).resolve().parent.parent
GAME=(ROOT/'dist'/'vitamia.html').as_uri()
import builtins as _b,functools as _f
open=_f.partial(_b.open,encoding='utf-8')  # Windows: sempre UTF-8
import json
s=open(ROOT/'atlante'/'pagina.html').read()
d=open(ROOT/'atlante'/'dati.json').read().replace('</','<\\/')
x=open(ROOT/'atlante'/'derivati.json').read().replace('</','<\\/')
s=s.replace('__DATI__',d).replace('__DER__',x)
open(ROOT/'dist'/'atlante-vitamia.html','w').write(s)
print(len(s)//1024,'KB')

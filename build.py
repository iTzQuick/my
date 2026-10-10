"""Unisce i sorgenti in src/ in un unico file: dist/vitamia.html (più dist/all.js per i controlli).
Prepara anche la web app installabile: dist/app/ (index.html + manifest + service worker + icone) e dist/my-app.zip,
da caricare su Netlify (app.netlify.com/drop) per installare «my» sul telefono."""
import pathlib, hashlib, shutil, zipfile
ROOT=pathlib.Path(__file__).resolve().parent
src=ROOT/'src'
FILES=['b_dati.js','b2_comuni.js','b3_luoghi.js','b4_dati2.js','c_motore.js','c2_sistemi.js','c3_vita.js','c4_persone.js','c5_aspetto.js','c6_famiglia.js','c7_italia.js','c8_legami.js','c9_epoca.js',
       'd_eventi.js','d2_eventi2.js','d3_emergenti.js','d4_infanzia.js','d5_adolescenza.js','d6_adulti.js','d7_vita_italiana.js','d8_ritmo.js','d9_piccoli.js','d10_ragazzi.js','d11_vita_adulta.js','d12_catene.js','d13_persone.js','d14_italia.js','e_azioni.js','e2_lusso.js','g_salva.js','f2_crea.js','f_ui.js','f3_momenti.js']
shell=(src/'a_shell.html').read_text(encoding='utf-8')
js='\n'.join((src/f).read_text(encoding='utf-8') for f in FILES)
js=js.replace("const VERSIONE='sviluppo'","const VERSIONE='"+hashlib.sha1(js.encode('utf-8')).hexdigest()[:8]+"'",1)   # impronta dei sorgenti, per «Segnala un problema»
html=shell+'\n<script>\n'+js+'\n</script>\n'
(ROOT/'dist').mkdir(exist_ok=True)
(ROOT/'dist'/'vitamia.html').write_text(html,encoding='utf-8')
(ROOT/'dist'/'all.js').write_text(js,encoding='utf-8')
print('dist/vitamia.html', round(len(html)/1024),'KB')

# ---------- Web app installabile (PWA) ----------
VIEW='<meta name="viewport" content="width=device-width,initial-scale=1">'
assert VIEW in shell
TESTA=('<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
       '<link rel="manifest" href="manifest.webmanifest">\n'
       '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
       '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
       '<meta name="apple-mobile-web-app-title" content="my">\n<meta name="apple-mobile-web-app-status-bar-style" content="default">\n'
       '<meta name="theme-color" content="#ECEFE8" media="(prefers-color-scheme: light)">\n<meta name="theme-color" content="#10151B" media="(prefers-color-scheme: dark)">')
REG="\n<script>if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js')</script>\n"
app=html.replace(VIEW,TESTA,1)+REG
A=ROOT/'dist'/'app'
shutil.rmtree(A,ignore_errors=True);A.mkdir(parents=True)
(A/'index.html').write_text(app,encoding='utf-8')
ver=hashlib.sha1(app.encode('utf-8')).hexdigest()[:10]
for f in (src/'app').iterdir():
    if f.name=='sw.js':(A/'sw.js').write_text(f.read_text(encoding='utf-8').replace('__VERSIONE__',ver),encoding='utf-8')
    else:shutil.copy(f,A/f.name)
with zipfile.ZipFile(ROOT/'dist'/'my-app.zip','w',zipfile.ZIP_DEFLATED) as z:
    for f in sorted(A.iterdir()):z.write(f,f.name)
print('dist/app/ e dist/my-app.zip · versione',ver)

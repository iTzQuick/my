/* ================= ITALIA VERA: OGNI EPOCA CON LE SUE COSE (ROADMAP, Fase 3.1) =================
   Si può nascere dal 1950. Fino al 2001 i soldi si contano in lire (eur() in c_motore.js), i prezzi seguono l'inflazione
   vera dal 1950 (INFL_VERA in c7_italia.js), la storia porta i fatti veri (STORIA) e le leggi hanno il loro anno:
   divorzio dal dicembre 1970, unioni civili dal 2016, naja per i ragazzi nati fino al 1985, pensioni con le regole
   dell'anno in cui ci si va (retributivo prima del 1996).
   ANACRONISMI: i testi che nominano cose non ancora inventate (telefonini, social, euro…) non compaiono negli anni
   sbagliati: eventi casuali, scelte, frasi del diario (varia), acquisti, attività, argomenti di conversazione.
   La tabella EPOCA dice da che anno ogni parola ha senso; tools/italia_vera.py controlla che non ne scappino. */
const EPOCA=[
  [/intelligenza artificiale/i,2023],
  [/\b(lockdown|didattica a distanza|green pass|smart working)\b/i,2020],
  [/\b(tik ?tok|reddito di cittadinanza|monopattin[oi] elettric[oi]|pcto)\b/i,2018],
  [/\b(unione civile|unioni civili|spid|stories)\b/i,2016],
  [/\b(naspi|rider|influencer|podcast|netflix|airbnb|bitcoin|criptovalut\w*|smartwatch|scooter elettric\w*)\b/i,2015],
  [/\b(spotify|selfie|emoji|instagram|tablet|startup|drone|droni)\b/i,2012],
  [/\b(whatsapp|smartphone|app|videochiamat\w*|streaming|youtuber|meme|hashtag|follower|like|wireless|e-book|vocale|vocali)\b/i,2010],
  [/\b(social|facebook|gruppo della classe|chat di gruppo|gps|navigatore)\b/i,2008],
  [/\b(youtube|wi-?fi|low cost|blog|patentino)\b/i,2004],
  [/\b(euro|centesim\w*)\b/i,2002],
  [/\b(email|e-mail|mail|internet|online|chat|dvd|mp3|ipod|google|sito web|home banking)\b/i,1999],
  [/\b(isee)\b/i,1998],
  [/\b(cellulare|cellulari|telefonin[oi]|sms|messaggin[oi]|playstation)\b/i,1995],
  [/\b(il|al|del|nel|un|modello) 730\b|\bcaf\b/i,1993],
  [/\b(game ?boy|karaoke)\b/i,1990],
  [/\b(erasmus)\b/i,1988],
  [/\b(computer|videogioc\w*|console|bancomat|cd|fax|personal computer)\b/i,1985],
  [/\b(tfr)\b/i,1982],
  [/\b(walkman|videocassett\w*|vhs|telecomando|serie tv)\b/i,1980],
  [/\b(divorzi\w*|divorziat\w*)\b/i,1971],
  [/\b(interrail)\b/i,1972],
  [/\bpartita iva\b/i,1973],
  [/\b(tv|televisione|televisor\w*|carosello)\b/i,1956]
];
/* da che anno un testo ha senso (0 = sempre) */
function annoTesto(s){if(!s||typeof s!=='string')return 0;let m=0;for(const [rx,a] of EPOCA)if(a>m&&rx.test(s))m=a;return m}
const fuoriEpoca=s=>!!S&&annoTesto(s)>S.anno;
/* evento: si guardano titolo e testo scritti (le funzioni si controllano quando l'evento si apre, in next()) */
function annoEvento(e){if(e._dal===undefined)e._dal=Math.max(annoTesto(typeof e.t==='string'?e.t:''),annoTesto(typeof e.x==='string'?e.x:''),e.dal||0);return e._dal}
/* scelta: etichetta, sottotitolo ed esiti scritti */
function annoScelta(c){if(c._dal===undefined){let m=c.dal||0;for(const s of [c.l,c.sub,c.r,c.si&&c.si.r,c.no&&c.no.r])if(typeof s==='string')m=Math.max(m,annoTesto(s));c._dal=m}return c._dal}
/* lista di frasi: solo quelle che hanno senso quest'anno (se nessuna, tutte) */
function soloEpoca(L){if(!S||!Array.isArray(L))return L;const ok=L.filter(s=>typeof s!=='string'||!fuoriEpoca(s));return ok.length?ok:L}

/* ---------- Lavori, corsi, attività che non esistevano ---------- */
const DAL_LAVORO={rider:2015,crea:2010,ds:2012,pro:1980,tec:1985,callc:1995,mkt:1970,pt:1990,agi:1960};
const lavoroInEpoca=j=>!S||S.anno>=(DAL_LAVORO[j.id]||0);
const DAL_CORSO={coding:2012,pt:1990,b2:1975,volo:1960};

/* ---------- Pensioni: le regole dell'anno in cui ci si va ----------
   prima del 1993: vecchiaia a 60 anni (55 le donne) con 15 anni di contributi, anzianità con 35;
   1993–2000 (riforma Amato): l'età sale di un anno ogni due, fino a 65/60;
   2001–2011: 65/60 con 20 anni, anzianità con 40 anni o 35 + 59 anni d'età (quote);
   2012–2018 (Fornero): 66 anni (le donne salgono da 62), anticipata con 42 anni e 1–10 mesi (un anno meno le donne);
   dal 2019: 67 anni, 42 anni e 10 mesi (41 e 10 le donne); quota 100 (62 + 38) nel 2019–2021, 102 (64 + 38) nel 2022, 103 (62 + 41) nel 2023–2025. */
function requisitiPensione(){
  const a=S.anno,F=S.sesso==='F';
  if(a<1993)return {vec:F?55:60,vecC:15,ant:35};
  if(a<2001){const inc=Math.min(4,Math.floor((a-1992)/2));return {vec:(F?55:60)+inc,vecC:20,ant:40,quota:[35,57]}}
  if(a<2012)return {vec:F?60:65,vecC:20,ant:40,quota:[35,59]};
  if(a<2019)return {vec:F?Math.min(66.6,62+(a-2012)*.8):66+(a>=2016?.6:0),vecC:20,ant:(F?41:42)+Math.min(.83,(a-2011)*.15)};
  const q=a<=2021?[38,62]:a===2022?[38,64]:a<=2025?[41,62]:null;
  return {vec:S.mondo.pensEta,vecC:20,ant:F?41.83:42.83,quota:q};
}
/* il sistema retributivo: per chi aveva contributi prima del 1996 una parte della pensione è il 2% dell'ultimo stipendio per ogni anno */
const retributivo=()=>S.anno<1996||(S.anno<2012&&(S.contrib95||0)>=18);

/* ---------- Le leggi con il loro anno ---------- */
const divorzioPossibile=()=>S.anno>=1971;
const unioneCivilePossibile=()=>S.anno>2016||(S.anno===2016&&S.mese>=5);
/* chi vota: dai 21 anni fino al 1975, poi dai 18 */
const etaVoto=()=>S.anno<1975?21:18;

/* ---------- La naja: il servizio militare obbligatorio, per i ragazzi nati fino al 1985 ---------- */
function controllaNaja(){
  if(S.sesso!=='M'||S.annoNascita>1985||S.fatti.naja||S.carcere>0||S.anno>=2005)return;
  const uni=['universita','magistrale'].includes(S.scuola.stato);
  if((S.eta===19&&!uni)||(S.eta===26)||(S.eta===24&&uni)){S.fatti.naja='chiamato';coda.push({e:EV.naja,d:{}})}
}
const mesiNaja=()=>S.anno<1975?15:S.anno<1997?12:10;

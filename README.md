# my — una vita, mese per mese

Simulatore di vita in italiano. Il tempo scorre mese per mese, il personaggio ha un carattere (Big Five) che cambia con quello che vive, decide come usare le ore della settimana, e le persone intorno hanno una vita propria. Dal 2000 al 2026 il mondo segue la storia e le regole italiane vere: prezzi, crisi, lockdown, pensioni, NASpI, unioni civili e così via.

Tutto il gioco è **un unico file HTML**, senza dipendenze.

## Giocare
- Apri `dist/vitamia.html` nel browser. La partita si salva da sola nel browser; con «Salva» la scarichi come file o come codice.
- **Sul telefono** c'è la web app installabile in `dist/app/` (o `dist/my-app.zip`). Si pubblica su Netlify trascinando la cartella, poi da Safari: Condividi → «Aggiungi alla schermata Home».

## Lavorarci
```bash
python build.py                     # unisce src/ → dist/vitamia.html e la web app
python tools/fuzz.py 3              # clic casuali su tutto il gioco: deve dare errs []
python tools/lint_testi.py          # testi adatti all'età: 0 segnalazioni
python tools/sim.py 80              # bilanciamento con il pilota automatico
python tools/realismo.py 400        # confronto con i dati italiani (ISTAT, Eurostat…)
```
Per i test servono Python 3 e Playwright: `pip install playwright`, poi `python -m playwright install chromium`.

## Documenti
- **[CLAUDE.md](CLAUDE.md)**: la guida completa al progetto (struttura, modello, convenzioni, valori di riferimento). È anche il punto di partenza per Claude Code.
- **[ANALISI.md](ANALISI.md)**: cosa manca e cosa non va rispetto alla vita vera, con dati e fonti, e lo stato delle correzioni.
- **[ROADMAP.md](ROADMAP.md)**: le fasi di lavoro, con priorità e criteri di «fatto».

## Altri file pronti in `dist/`
- `atlante-vitamia.html`: l'Atlante, cioè database e grafici di tutto il gioco.
- `flusso-my.html`: il diagramma di flusso completo, in stile Detroit.

# DigiVibe Events

Static site for DigiVibe Events.

## Run locally

Install dependencies and start the local dev server:

```bash
npm install
npm start
```

This will run `live-server` and open the site at `http://127.0.0.1:5500`.

## Alternative (no Node.js)

You can also serve the folder using Python:

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Then open `http://127.0.0.1:5500` in your browser.

## Files

- `index.html` — main static page
- `package.json` — start script for `live-server`

If you want, I can run `npm install` here or try starting the server again. If the container prevents running the server, run the commands on your machine and preview the site.

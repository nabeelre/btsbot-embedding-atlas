# BTSbot Embedding Atlas

An interactive [Embedding Atlas](https://github.com/apple/embedding-atlas) of
[BTSbot](https://github.com/nabeelre/BTSbot)'s learned representation of ZTF alert data —
a 2-D UMAP projection of 30,000 alerts with their metadata, explorable in the browser.

Live site: **https://www.nabeelr.com/btsbot-embedding-atlas/**

Built with Vite + React. The embedding data ships as a Parquet file and is loaded entirely
client-side with DuckDB-WASM (via Mosaic), so there is no backend — it deploys as a static
site to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

GitHub Pages serves the site from `/<repo-name>/`. The deploy workflow builds with the correct
base path automatically; to reproduce it locally:

```bash
BASE_PATH=/btsbot-embedding-atlas/ npm run build
```

## Data

`public/btsbot_embeddings.parquet` holds the UMAP coordinates (`umap_emb_1`, `umap_emb_2`) plus
per-alert metadata (`source_set`, `magpsf`, `days_to_peak`, `new_drb`, the `acai_*` scores, etc.).
It was converted from the original CSV with DuckDB:

```bash
uv run --with duckdb python -c "import duckdb; duckdb.sql(\"COPY (SELECT * FROM read_csv_auto('maxvit_gz_emb.csv')) TO 'public/btsbot_embeddings.parquet' (FORMAT parquet, COMPRESSION zstd)\")"
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`
to GitHub Pages. One-time setup: in the repo **Settings → Pages**, set **Source** to
**GitHub Actions**.

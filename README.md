# BTSbot Embedding Atlas

An interactive [Embedding Atlas](https://github.com/apple/embedding-atlas) of
[BTSbot](https://github.com/nabeelre/BTSbot)'s learned representation of ZTF alert data —
a 2-D UMAP projection of 50,000 alerts with their metadata, explorable in the browser.

Live site: **https://www.nabeelr.com/btsbot-embedding-atlas/**

Built with Vite + React. The embedding data ships as a Parquet file and is loaded entirely
client-side with DuckDB-WASM (via Mosaic), so there is no backend — it deploys as a static
site to GitHub Pages.

<p align="center">
  <img
    src="https://github.com/nabeelre/btsbot-embedding-atlas/dist/assets/screenshot.png"
    alt="BTSbot Embedding Atlas"
    width="250px"
  />
</p>
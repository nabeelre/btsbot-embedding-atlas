import { useEffect, useRef, useState } from "react";
import { Coordinator, wasmConnector } from "@uwdata/mosaic-core";
import { EmbeddingAtlas } from "embedding-atlas/react";
import atlasInitialState from "./atlasInitialState.json";

// The Parquet lives in public/ and is served next to index.html, so it resolves
// correctly both in dev (base "/") and on GitHub Pages (base "/<repo>/").
const DATA_URL = new URL(
  import.meta.env.BASE_URL + "btsbot_embeddings.parquet",
  window.location.href,
).href;

export default function EmbeddingAtlasView() {
  const [phase, setPhase] = useState("loading"); // "loading" | "ready" | "error"
  const [message, setMessage] = useState("Starting up…");
  const [coordinator, setCoordinator] = useState(null);
  const started = useRef(false);

  useEffect(() => {
    // Guard against React re-running the effect (e.g. StrictMode / fast refresh)
    // so we never spin up two DuckDB instances.
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        setMessage("Starting DuckDB…");
        const coord = new Coordinator();
        const connector = await wasmConnector();
        coord.databaseConnector(connector);

        setMessage("Loading embeddings…");
        // ZTFID is the object identifier (not unique per row — objects have many
        // alerts), so we still synthesize a unique `id` from the row number.
        await coord.exec(`
          CREATE OR REPLACE TABLE embeddings AS
          SELECT
            row_number() OVER () AS id,
            *
          FROM read_parquet('${DATA_URL}')
        `);

        setCoordinator(coord);
        setPhase("ready");
      } catch (err) {
        console.error("Embedding Atlas failed to initialize:", err);
        setMessage(String(err?.message ?? err));
        setPhase("error");
      }
    })();
  }, []);

  if (phase === "ready" && coordinator) {
    return (
      <EmbeddingAtlas
        coordinator={coordinator}
        colorScheme="dark"
        data={{
          table: "embeddings",
          // ZTFID is the per-point hover tooltip (and search) text.
          id: "id",
          text: "ZTFID",
          projection: { x: "umap_emb_1", y: "umap_emb_2" },
        }}
        // Pinned layout captured from the default view (see scratchpad
        // capture-state.mjs), edited to: remove the SQL Predicates panel, drop the
        // synthetic `id` distribution chart, hide the bottom instances table, and
        // color the embedding by query_set. The embedding chart deliberately has
        // NO `text` column, which is what suppresses the automatic floating labels
        // over the points (the top-level data.text above still feeds the per-point
        // hover tooltip). Regenerate this file if the dataset columns change.
        initialState={atlasInitialState}
      />
    );
  }

  return (
    <div className={`atlas-status ${phase === "error" ? "is-error" : ""}`} role="status" aria-live="polite">
      {phase === "loading" && <div className="atlas-spinner" aria-hidden="true" />}
      <p className="atlas-status-title">
        {phase === "error" ? "The Embedding Atlas failed to load" : "Loading the Embedding Atlas"}
      </p>
      <p className="atlas-status-detail">{message}</p>
      {phase === "error" && (
        <p className="atlas-status-hint">
          This tool needs a recent browser with WebAssembly and WebGL support. Try the latest
          Chrome, Firefox, Edge, or Safari.
        </p>
      )}
    </div>
  );
}

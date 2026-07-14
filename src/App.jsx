import EmbeddingAtlasView from "./EmbeddingAtlasView.jsx";

const PAPERS = [
  {
    num: "BTSbot I",
    desc: "Original design and deployment for the ZTF Bright Transient Survey",
    url: "https://ui.adsabs.harvard.edu/abs/2024ApJ...972....7R/abstract",
  },
  {
    num: "BTSbot II",
    desc: "Demonstration of application to automated ToOs for young supernovae",
    url: "https://ui.adsabs.harvard.edu/abs/2025ApJ...985..241R/abstract",
  },
  {
    num: "BTSbot III",
    desc: "Model architecture update and pre-training experiments",
    url: "https://ui.adsabs.harvard.edu/abs/2026PASP..138c4503R/abstract",
  },
];

export default function App() {
  return (
    <>
      <main className="atlas-page">
        <header className="atlas-intro">
          <h1>BTSbot Embedding Atlas</h1>
          <p className="atlas-lead">
            An interactive 2-D view of the production{" "}
            <a href="https://github.com/nabeelre/BTSbot" target="_blank" rel="noopener">BTSbot</a> model&rsquo;s
            learned representation of ZTF alert data. Every point is a real alert; pan, zoom, filter,
            and inspect individual sources to build intuition for what the model sees.
          </p>
        </header>

        <section className="atlas-view" aria-label="Interactive embedding atlas workspace">
          <EmbeddingAtlasView />
        </section>

        <p className="atlas-tips">
          <strong>Tips:</strong> use the color-by control to shade points by a parameter such as{" "}
          <code>days_to_peak</code> (an estimate of rise time) or <code>magpsf</code> (brightness) to
          reveal structure in the latent space. Select regions with the lasso and rectangle tools,
          and toggle the side panel from the top-right corner.
        </p>

        <div className="paper-badges">
          {PAPERS.map((p) => (
            <a
              key={p.num}
              href={p.url}
              target="_blank"
              rel="noopener"
              className="paper-badge"
            >
              <i className="fa-solid fa-book" aria-hidden="true"></i>
              <span className="paper-badge-text">
                <strong>{p.num}</strong>
                <span className="paper-badge-desc">{p.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Nabeel Rehemtulla</p>
        </div>
      </footer>
    </>
  );
}

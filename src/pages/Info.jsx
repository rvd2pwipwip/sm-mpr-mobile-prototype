import { usePlayback } from "../context/PlaybackContext";
import "./Info.css";

/** Info tab — stub + mini player variant demos until settings content ships. */
export default function Info() {
  const { startPodcastDemo, startRadioDemo, clearSession } = usePlayback();

  return (
    <main className="app-shell app-shell--footer-fixed info-page">
      <div className="app-shell-footer-scroll">
        <div className="content-inset">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Info</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            App information and help — placeholder.
          </p>
          <div className="info-page__playback-demos">
            <p className="info-page__demo-label text-muted">
              Mini player previews (until podcast/radio stacks exist):
            </p>
            <div className="info-page__demo-row">
              <button type="button" className="info-page__demo-btn" onClick={startPodcastDemo}>
                Podcast bar
              </button>
              <button type="button" className="info-page__demo-btn" onClick={startRadioDemo}>
                Radio bar
              </button>
              <button type="button" className="info-page__demo-btn" onClick={clearSession}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

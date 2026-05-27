import PrimaryNav from "./PrimaryNav.jsx";

export default function TvShell({ children }) {
  return (
    <div className="tv-shell">
      <PrimaryNav />
      <main className="tv-shell__main">{children}</main>
    </div>
  );
}

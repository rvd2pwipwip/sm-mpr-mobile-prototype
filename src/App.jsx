const App = () => {
  return (
    <main className="app-shell">
      <div className="content-inset">
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          Stingray Music Mobile Prototype
        </h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Global tokens and layout shell are in <code>src/index.css</code> — see{" "}
          <code>docs/design-tokens.md</code>.
        </p>
      </div>
    </main>
  );
};

export default App;

import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Info from "./pages/Info";

/** Route table; `BottomNav` is a sibling of `Routes` so tabs show on every main destination. */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info" element={<Info />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default App;

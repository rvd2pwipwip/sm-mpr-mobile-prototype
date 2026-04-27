import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { UserTypeProvider } from "./context/UserTypeContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Info from "./pages/Info";
import Subscription from "./pages/Subscription";

/** Route table; `BottomNav` is a sibling of `Routes` so tabs show on every main destination. */
function App() {
  return (
    <UserTypeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upgrade" element={<Subscription />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info" element={<Info />} />
      </Routes>
      <BottomNav />
    </UserTypeProvider>
  );
}

export default App;

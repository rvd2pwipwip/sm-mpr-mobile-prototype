import { Routes, Route, Navigate } from "react-router-dom";
import { UserTypeProvider } from "./context/UserTypeContext.jsx";
import TvShell from "./components/TvShell.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import MyLibrary from "./pages/MyLibrary.jsx";

export default function App() {
  return (
    <UserTypeProvider>
      <TvShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TvShell>
    </UserTypeProvider>
  );
}

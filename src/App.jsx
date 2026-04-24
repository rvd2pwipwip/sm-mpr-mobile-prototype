import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

/** Route table; add tab and stacked flow routes as the prototype grows. */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;

// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import BodyDashBoard from "./components/dashBorad/BodyDashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestionar-planta/:title" element={<BodyDashBoard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

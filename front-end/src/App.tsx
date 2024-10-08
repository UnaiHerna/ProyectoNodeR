// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import BodyDashBoard from "./components/dashBorad/BodyDashBoard";
import Login from "./components/Login/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/gestionar-planta/:title" element={<BodyDashBoard/>} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;

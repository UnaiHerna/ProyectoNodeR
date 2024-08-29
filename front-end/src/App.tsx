// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import DataDisplay from "./components/DataDisplay"; // Adjust the import path as necessary

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestionar-planta/:title" element={<DataDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SummaryCard from "./components/Home/Organism/SumarryCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SummaryCard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Today from "./components/Home/Pages/Today";
import Recommender from "./components/Home/Pages/Recommender";
import NotFoundPage from "./components/Home/Pages/Page404";
import Analytics from "./components/Home/Pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotFoundPage/>}/>
        <Route path="/today" element={<Today/>}/>
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/recommender" element={<Recommender/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

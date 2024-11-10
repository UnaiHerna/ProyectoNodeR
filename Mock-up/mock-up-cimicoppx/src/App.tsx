import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Home/Pages/Body";
import Recommender from "./components/Home/Pages/Recommender";
import NotFoundPage from "./components/Home/Pages/Page404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotFoundPage/>}/>
        <Route path="/today" element={<Body/>}/>
        <Route path="/recommender" element={<Recommender/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

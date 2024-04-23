import { Route, Routes } from "react-router-dom";
import { Login, SignUp, CreateBook, Home } from "./views";
import ShowBook from "./views/ShowBook";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/new" element={<CreateBook />}/>
        <Route path="/book/:id" element={<ShowBook/>}/>
      </Routes>
    </div>
  );
}

export default App;
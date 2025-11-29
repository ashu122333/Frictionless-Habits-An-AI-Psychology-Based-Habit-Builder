import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import axios from "axios";
import HabitList from "./components/pages/HabitList.jsx";

function App() {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myhabits" element={<HabitList />} />
      </Routes>
    </Router>
  );
}

export default App;

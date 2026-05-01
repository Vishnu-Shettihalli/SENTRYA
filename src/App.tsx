import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Alerts from "./pages/Alerts";
import Simulator from "./pages/Simulator";
import Community from "./pages/Community";
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/community" element={<Community />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Reservations from "@/pages/Reservations";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/AdminDashboard";
import ManageReservations from "@/pages/ManageReservations";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage" element={<ManageReservations />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;

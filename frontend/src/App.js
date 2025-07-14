import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PatientPage from './pages/PatientPage';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
function App() {
  return (
    <Router>
      {/* Header component always shown */}
      <Header />
      <main>
        <Routes>
          {/* to show routes for each page */}
          <Route path="/" element={<Home />} />
          <Route path="/patients" element={<PatientPage />} />
          <Route path="/add" element={<AddPatient />} />
          <Route path="/edit/:id" element={<EditPatient />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* Footer component always shown*/}
      <Footer />
    </Router>
  );
}
export default App;

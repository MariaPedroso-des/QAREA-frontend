//esto onta el router, define rutas, no tiene lógica defiltros ni fetch hikings o overnigths
//Ahora hace más que definir las  RUTAS!!!! CAMBIAR!!!

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import HikingDetailPage from './pages/HikingDetailPage.jsx'
import HikingsPage from './pages/HikingsPage.jsx'
import OvernightsPage from './pages/OvernightsPage.jsx'
import OvernightDetailPage from './pages/OvernightDetailPage.jsx'
import FormChoicePage from './pages/FormChoicePage.jsx'
import HikingFormPage from './pages/HikingFormPage.jsx'
import OvernightFormPage from './pages/OvernightFormPage.jsx'
import Footer from './components/Footer.jsx'
const App = () => {  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formchoice" element={<FormChoicePage />} />

          <Route path="/hikings" element={<HikingsPage />} />
          <Route path="/hikings/new" element={<HikingFormPage />} />
          <Route path="/hikings/edit/:id" element={<HikingFormPage />} />
          <Route path="/hikings/:id" element={<HikingDetailPage />} />

          <Route path="/overnights" element={<OvernightsPage />} />
          <Route path="/overnights/new" element={<OvernightFormPage />} />
          <Route path="/overnights/edit/:id" element={<OvernightFormPage />} />
          <Route path="/overnights/:id" element={<OvernightDetailPage />} />
        </Routes>
      </Router>
      <Footer />
    </>
  )
}

export default App
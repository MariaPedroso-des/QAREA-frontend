// Router: solo define rutas. El chrome común (navegación, footer) vive en Layout.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import FormChoicePage from './pages/FormChoicePage.jsx'
import HikingsPage from './pages/HikingsPage.jsx'
import HikingDetailPage from './pages/HikingDetailPage.jsx'
import HikingFormPage from './pages/HikingFormPage.jsx'
import OvernightsPage from './pages/OvernightsPage.jsx'
import OvernightDetailPage from './pages/OvernightDetailPage.jsx'
import OvernightFormPage from './pages/OvernightFormPage.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
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
        </Route>
      </Routes>
    </Router>
  )
}

export default App

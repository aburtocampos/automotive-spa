import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';

function App() {
  return (
<BrowserRouter>
  <Routes>
    <Route path="/" element={<VehiclesPage />} />
    <Route path="/vehicles" element={<VehiclesPage />} />
    <Route path="/vehicles/:slug" element={<VehicleDetailPage />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
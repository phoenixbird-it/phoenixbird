import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import ServiceDetail from './pages/ServiceDetail/ServiceDetail';
import Industries from './pages/Industries/Industries';
import WhyChooseUs from './pages/WhyChooseUs/WhyChooseUs';
import HowWeWork from './pages/HowWeWork/HowWeWork';
import ServiceAreas from './pages/ServiceAreas/ServiceAreas';
import RequestManpower from './pages/RequestManpower/RequestManpower';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/how-we-work" element={<HowWeWork />} />
        <Route path="/service-areas" element={<ServiceAreas />} />
        <Route path="/request-manpower" element={<RequestManpower />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

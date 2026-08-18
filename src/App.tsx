import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './components/DefaultLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ResumePage } from './pages/Resume';
import { CertificatesPage } from './pages/Certificates';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/certificates/:skill" element={<CertificatesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

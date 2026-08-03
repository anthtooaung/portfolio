import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './components/DefaultLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ResumePage } from './pages/Resume';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AudioGuide } from '@/components/AudioGuide';

export function DefaultLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AudioGuide src="/audio/intro-guide.mp3" />
    </div>
  );
}

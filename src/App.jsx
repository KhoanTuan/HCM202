import { lazy, Suspense, useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import Site from './site/Site.jsx';

// bản trình chiếu dự phòng chỉ tải khi cần
const Deck = lazy(() => import('./deck/Deck.jsx'));
const Presenter = lazy(() => import('./deck/Presenter.jsx'));

// Mặc định: trang web. "#/slide/…" = bản trình chiếu dự phòng. "#/presenter" = cửa sổ ghi chú.
function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  if (hash.startsWith('#/slide')) return 'deck';
  if (hash.startsWith('#/presenter')) return 'presenter';
  return 'site';
}

export default function App() {
  const route = useRoute();
  if (route === 'presenter') return <Suspense fallback={null}><Presenter /></Suspense>;
  if (route === 'deck')
    return (
      <ErrorBoundary>
        <Suspense fallback={null}><Deck /></Suspense>
      </ErrorBoundary>
    );
  return (
    <ErrorBoundary>
      <Site />
    </ErrorBoundary>
  );
}

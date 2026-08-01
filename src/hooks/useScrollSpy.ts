import { useEffect, useState } from 'react';

/**
 * Tracks which section (by ID) is in the viewport using IntersectionObserver.
 * The rootMargin shrinks the observation band so sections only become
 * "active" when they're roughly centered in the viewport.
 */
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0],
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

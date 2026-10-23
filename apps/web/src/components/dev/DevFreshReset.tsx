import { useEffect } from 'react';

async function clearPrototypeState() {
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    // Continue clearing other same-origin stores.
  }

  if ('caches' in window) {
    try {
      const names = await window.caches.keys();
      await Promise.all(names.map((name) => window.caches.delete(name)));
    } catch {
      // CacheStorage may be unavailable in restricted browser contexts.
    }
  }

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch {
      // No-op when service workers are unavailable.
    }
  }

  try {
    const factory = indexedDB as IDBFactory & { databases?: () => Promise<Array<{ name?: string }>> };
    const databases = await factory.databases?.();
    if (databases) {
      await Promise.all(databases.map((database) => new Promise<void>((resolve) => {
        if (!database.name) {
          resolve();
          return;
        }
        const request = indexedDB.deleteDatabase(database.name);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      })));
    }
  } catch {
    // IndexedDB enumeration is not supported in every browser.
  }

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim();
    if (name) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  });
}

export function DevFreshReset() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('devFresh')) {
      params.delete('devFresh');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
    }

    const handleShortcut = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.shiftKey || event.altKey || event.metaKey || event.key.toLowerCase() !== 'd') {
        return;
      }

      event.preventDefault();
      void clearPrototypeState().finally(() => {
        window.location.replace(`/login?devFresh=${Date.now()}`);
      });
    };

    window.addEventListener('keydown', handleShortcut, true);
    return () => window.removeEventListener('keydown', handleShortcut, true);
  }, []);

  return null;
}

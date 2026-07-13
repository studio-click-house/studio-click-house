export interface GoogleMapInstance {
  panTo(position: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
}

export interface GoogleMarkerInstance {
  map: GoogleMapInstance | null;
}

interface GoogleMapsNamespace {
  maps: {
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => GoogleMapInstance;
    marker: {
      AdvancedMarkerElement: new (options: {
        map: GoogleMapInstance;
        position: { lat: number; lng: number };
        content: HTMLElement;
        title: string;
      }) => GoogleMarkerInstance;
    };
    event: {
      clearInstanceListeners(instance: object): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleMapsNamespace;
    studioClickHouseMapReady?: () => void;
  }
}

let googleMapsPromise: Promise<GoogleMapsNamespace> | undefined;

export function loadGoogleMaps(apiKey: string): Promise<GoogleMapsNamespace> {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const parameters = new URLSearchParams({
      key: apiKey,
      loading: "async",
      libraries: "marker",
      v: "weekly",
      callback: "studioClickHouseMapReady",
    });

    window.studioClickHouseMapReady = () => {
      if (!window.google?.maps) {
        reject(new Error("Google Maps loaded without the maps library."));
        return;
      }
      resolve(window.google);
      delete window.studioClickHouseMapReady;
    };

    script.src = `https://maps.googleapis.com/maps/api/js?${parameters}`;
    script.async = true;
    script.onerror = () => {
      googleMapsPromise = undefined;
      delete window.studioClickHouseMapReady;
      reject(new Error("Google Maps could not be loaded."));
    };
    document.head.append(script);
  });

  return googleMapsPromise;
}

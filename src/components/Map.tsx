import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Order {
  id: number;
  customer: string;
  coordinates: [number, number];
}

interface MapProps {
  selectedOrder: Order | null;
  orders: Order[];
}

const Map = ({ selectedOrder, orders }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const [token, setToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;
    
    try {
      // Initialize map
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.006, 40.7128], // Default to NYC
        zoom: 12
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add markers for all orders
      orders.forEach((order) => {
        const marker = new mapboxgl.Marker({
          color: '#8B5CF6'
        })
          .setLngLat(order.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${order.customer}</h3>`)
          )
          .addTo(map.current!);
        
        markers.current[order.id] = marker;
      });

      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Update map when selected order changes
  useEffect(() => {
    if (!map.current || !selectedOrder || !isMapInitialized) return;

    // Reset all markers to default color
    Object.values(markers.current).forEach(marker => {
      marker.getElement().style.color = '#8B5CF6';
    });

    // Highlight selected marker
    const selectedMarker = markers.current[selectedOrder.id];
    if (selectedMarker) {
      selectedMarker.getElement().style.color = '#F97316';
      
      // Fly to selected order
      map.current.flyTo({
        center: selectedOrder.coordinates,
        zoom: 14,
        duration: 2000
      });
    }
  }, [selectedOrder, isMapInitialized]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (!isMapInitialized) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold">Enter your Mapbox token to initialize the map</h3>
        <p className="text-sm text-muted-foreground">
          Get your token from <a href="https://www.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="pk.eyJ1..."
            className="flex-1"
          />
          <Button onClick={initializeMap} disabled={!token}>
            Initialize Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
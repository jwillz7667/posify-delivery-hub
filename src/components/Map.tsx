import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
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

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map when selected order changes
  useEffect(() => {
    if (!map.current || !selectedOrder) return;

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
  }, [selectedOrder]);

  return (
    <div className="absolute inset-0 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
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
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const token = 'pk.eyJ1IjoiandpbGx6NzY2NyIsImEiOiJjbTZoNXV3Y2QwNW41MmpuMXd4YTdibGp2In0.ENAIEOs8S8zeHOudBzQhCw'; // Added your token

  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          name: 'Modern Theme',
          sources: {
            'mapbox-streets': {
              type: 'vector',
              url: 'mapbox://mapbox.mapbox-streets-v8'
            },
            'mapbox-terrain': {
              type: 'vector',
              url: 'mapbox://mapbox.mapbox-terrain-v2'
            }
          },
          layers: [
            // Background and land coloring
            {
              id: 'background',
              type: 'background',
              paint: {'background-color': '#f9f9f9'}
            },
            {
              id: 'land',
              type: 'fill',
              source: 'mapbox-streets',
              'source-layer': 'landuse',
              paint: {
                'fill-color': '#f0f0f0',
                'fill-opacity': 0.7
              }
            },
            // Water features
            {
              id: 'water',
              type: 'fill',
              source: 'mapbox-streets',
              'source-layer': 'water',
              paint: {
                'fill-color': '#aad3df'
              }
            },
            // Parks and green areas
            {
              id: 'parks',
              type: 'fill',
              source: 'mapbox-streets',
              'source-layer': 'landuse',
              filter: ['==', 'class', 'park'],
              paint: {
                'fill-color': '#d8e8d8'
              }
            },
            // Buildings
            {
              id: 'buildings',
              type: 'fill',
              source: 'mapbox-streets',
              'source-layer': 'building',
              paint: {
                'fill-color': '#e0d8c8',
                'fill-opacity': 0.6
              }
            },
            // Road system
            {
              id: 'roads',
              type: 'line',
              source: 'mapbox-streets',
              'source-layer': 'road',
              paint: {
                'line-color': [
                  'match',
                  ['get', 'class'],
                  'motorway', '#ff9a6b',  // Orange for highways
                  'primary', '#7b9dd2',   // Blue for main roads
                  'secondary', '#a4c0e8', // Lighter blue
                  'street', '#d1d1d1',    // Light gray for streets
                  'path', '#e0e0e0',      // Very light gray for paths
                  '#cccccc'               // Default
                ],
                'line-width': [
                  'interpolate', ['linear'], ['zoom'],
                  10, ['match', ['get', 'class'],
                    'motorway', 3,
                    'primary', 2.5,
                    'secondary', 2,
                    1
                  ],
                  16, ['match', ['get', 'class'],
                    'motorway', 6,
                    'primary', 5,
                    'secondary', 4,
                    'street', 3,
                    2
                  ]
                ]
              }
            },
            // Labels and points of interest
            {
              id: 'poi-labels',
              type: 'symbol',
              source: 'mapbox-streets',
              'source-layer': 'poi_label',
              layout: {
                'text-field': ['get', 'name_en'],
                'text-font': ['Noto Sans Regular'],
                'text-size': 12
              },
              paint: {
                'text-color': '#5a5a5a',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1
              }
            },
            // Road labels
            {
              id: 'road-labels',
              type: 'symbol',
              source: 'mapbox-streets',
              'source-layer': 'road_label',
              layout: {
                'text-field': ['get', 'name_en'],
                'text-font': ['Noto Sans Bold'],
                'text-size': 12
              },
              paint: {
                'text-color': '#4a4a4a',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1
              }
            }
          ]
        },
        center: [-74.006, 40.7128],
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
          color: '#004E89'
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
      marker.getElement().style.color = '#004E89';
    });

    // Highlight selected marker
    const selectedMarker = markers.current[selectedOrder.id];
    if (selectedMarker) {
      selectedMarker.getElement().style.color = '#FF6B35';
      
      // Fly to selected order
      map.current.flyTo({
        center: selectedOrder.coordinates,
        zoom: 14,
        duration: 2000
      });
    }
  }, [selectedOrder, isMapInitialized]);

  // Initialize map on mount
  useEffect(() => {
    initializeMap();
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
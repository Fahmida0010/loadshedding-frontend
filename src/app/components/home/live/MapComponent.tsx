'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent({ outages }: { outages: any[] }) {
  return (
    <MapContainer 
      center={[23.6850, 90.3563]} // Bangladesh Center
      zoom={7} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {outages.map((item, index) => {
        const lat = item.lat || item.latitude || 23.6850;
        const lng = item.lng || item.longitude || 90.3563;

        return (
          <div key={item.id || index}>
            <Marker position={[lat, lng]} icon={redIcon}>
              <Popup>
                <div className="p-1 space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                    {item.status || 'SCHEDULED'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title || 'Load Shedding Notice'}</h4>
                  <p className="text-xs text-slate-600">Location: {item.location || item.area?.name || 'Bangladesh Zone'}</p>
                  <p className="text-[11px] text-slate-500">
                    Time: {item.time || item.startTime || '10:00 AM - 1:00 PM'}
                  </p>
                </div>
              </Popup>
            </Marker>

            <Circle 
              center={[lat, lng]} 
              radius={12000} 
              pathOptions={{ 
                color: 'red', 
                fillColor: '#f87171', 
                fillOpacity: 0.3 
              }} 
            />
          </div>
        );
      })}
    </MapContainer>
  );
}
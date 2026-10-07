'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Leaflet component-gulo ke Server Side Rendering (SSR) theke bad dewar jonno dynamic import kora holo
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  { ssr: false }
);

// Bangladesh-er 25-ti bibhinno shohor o area-er dummy coordinates ebong schedules
const fallbackBangladeshOutages = [
  { id: 1, title: "Grid Maintenance", location: "Amberkhana, Sylhet", lat: 24.8949, lng: 91.8687, status: "ACTIVE", time: "10:00 AM - 1:00 PM" },
  { id: 2, title: "Emergency Load Shedding", location: "Zindabazar, Sylhet", lat: 24.8978, lng: 91.8710, status: "SCHEDULED", time: "2:00 PM - 4:00 PM" },
  { id: 3, title: "Transformer Fault", location: "Uposhohor, Sylhet", lat: 24.8850, lng: 91.8750, status: "ACTIVE", time: "Ongoing" },
  { id: 4, title: "Routine Shutdown", location: "Dhanmondi, Dhaka", lat: 23.7461, lng: 90.3742, status: "ACTIVE", time: "9:00 AM - 12:00 PM" },
  { id: 5, title: "Line Repair Work", location: "Gulshan, Dhaka", lat: 23.7925, lng: 90.4078, status: "SCHEDULED", time: "1:00 PM - 3:00 PM" },
  { id: 6, title: "Substation Overload", location: "Uttara, Dhaka", lat: 23.8759, lng: 90.3795, status: "ACTIVE", time: "Ongoing" },
  { id: 7, title: "Power Disruption", location: "Mirpur, Dhaka", lat: 23.8223, lng: 90.3654, status: "SCHEDULED", time: "11:00 AM - 2:00 PM" },
  { id: 8, title: "Maintenance", location: "Motijheel, Dhaka", lat: 23.7330, lng: 90.4172, status: "ACTIVE", time: "Ongoing" },
  { id: 9, title: "Load Management", location: "Agrabad, Chittagong", lat: 22.3167, lng: 91.8174, status: "ACTIVE", time: "10:00 AM - 12:00 PM" },
  { id: 10, title: "Grid Failure", location: "GEC Circle, Chittagong", lat: 22.3585, lng: 91.8257, status: "SCHEDULED", time: "3:00 PM - 5:00 PM" },
  { id: 11, title: "Line Fault", location: "Nasirabad, Chittagong", lat: 22.3580, lng: 91.8210, status: "ACTIVE", time: "Ongoing" },
  { id: 12, title: "Routine Outage", location: "Pahartali, Chittagong", lat: 22.3380, lng: 91.8310, status: "SCHEDULED", time: "1:00 PM - 4:00 PM" },
  { id: 13, title: "Power Cut", location: "Rajshahi Sadar, Rajshahi", lat: 24.3745, lng: 88.6042, status: "ACTIVE", time: "8:00 AM - 11:00 AM" },
  { id: 14, title: "Maintenance", location: "Talaimari, Rajshahi", lat: 24.3636, lng: 88.6290, status: "SCHEDULED", time: "2:00 PM - 4:00 PM" },
  { id: 15, title: "Transformer Repair", location: "Khulna Sadar, Khulna", lat: 22.8456, lng: 89.5403, status: "ACTIVE", time: "Ongoing" },
  { id: 16, title: "Grid Work", location: "Sonadanga, Khulna", lat: 22.8315, lng: 89.5298, status: "SCHEDULED", time: "10:00 AM - 1:00 PM" },
  { id: 17, title: "Load Shedding", location: "Barisal Sadar, Barisal", lat: 22.7010, lng: 90.3535, status: "ACTIVE", time: "9:00 AM - 12:00 PM" },
  { id: 18, title: "Line Check", location: "Nathullabad, Barisal", lat: 22.7243, lng: 90.3585, status: "SCHEDULED", time: "1:00 PM - 3:00 PM" },
  { id: 19, title: "Emergency Cut", location: "Sylhet Sadar, Sylhet", lat: 24.9045, lng: 91.8611, status: "ACTIVE", time: "Ongoing" },
  { id: 20, title: "Power Rationing", location: "Comilla Sadar, Comilla", lat: 23.4607, lng: 91.1809, status: "SCHEDULED", time: "4:00 PM - 6:00 PM" },
  { id: 21, title: "Maintenance", location: "Kandirpar, Comilla", lat: 23.4580, lng: 91.1820, status: "ACTIVE", time: "Ongoing" },
  { id: 22, title: "Grid Fault", location: "Mymensingh Sadar, Mymensingh", lat: 24.7471, lng: 90.4203, status: "ACTIVE", time: "11:00 AM - 2:00 PM" },
  { id: 23, title: "Routine Outage", location: "Ganginarpar, Mymensingh", lat: 24.7550, lng: 90.4070, status: "SCHEDULED", time: "12:00 PM - 3:00 PM" },
  { id: 24, title: "Power Disruption", location: "Rangpur Sadar, Rangpur", lat: 25.7439, lng: 89.2752, status: "ACTIVE", time: "Ongoing" },
  { id: 25, title: "Substation Check", location: "Jahaj Company Mor, Rangpur", lat: 25.7500, lng: 89.2500, status: "SCHEDULED", time: "2:00 PM - 5:00 PM" },
];

export default function LiveOutageMap() {
  const [outages, setOutages] = useState<any[]>(fallbackBangladeshOutages);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedules`);
        const data = res.data?.data || res.data?.schedules || res.data || [];
        if (Array.isArray(data) && data.length > 0 && data[0].latitude) {
          setOutages(data);
        }
      } catch (error) {
        console.log("Using nationwide Bangladesh fallback map data");
      }
    }
    fetchSchedules();
  }, []);

  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700 mb-3">
            Nationwide Live Monitoring
          </span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Bangladesh Real-Time Schedule Map 🗺️
          </h2>
          <p className="mt-4 text-slate-600">
            Track active power disruptions and scheduled load shedding across major regions of Bangladesh.
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 h-[500px] w-full overflow-hidden relative z-10">
          <MapWithNoSSR outages={outages} />
        </div>
      </div>
    </section>
  );
}
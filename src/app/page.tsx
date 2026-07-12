"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ChatCard from "../components/ChatCard";

// Define the shape of your API response
interface ApartmentInfo {
  type: string;
  floor: number;
  bedrooms?: number;
}

interface OccupiedRoom {
  guest_name: string;
  apartments: ApartmentInfo;
}

interface DashboardData {
  occupancy: {
    total: number;
    occupied: number;
    available: number;
    rate: number;
  };
  occupied_rooms: OccupiedRoom[];
  check_ins: {
    total: number;
    check_ins: { guest_name: string; apartments: ApartmentInfo }[];
  };
  check_outs: {
    total: number;
    check_outs: { guest_name: string; apartments: ApartmentInfo }[];
  };
  revenue: {
    revenue: number;
    refunds: number;
    charges: number;
    net_income: number;
  };
}

export default function Home() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        // Fetching with dynamic date parameter
        const res = await fetch(`${baseUrl}/api/dashboard?date=${date}`);
        const data = await res.json();
        setDashboardData(data as any);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date]);

  if (loading) return <div className="text-white p-4">Loading dashboard...</div>;
  if (!dashboardData) return <div className="text-white p-4">No data available for {date}.</div>;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#0a0a0a] p-4 font-sans space-y-4 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center px-1 mb-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-[#53c97f]"></div>
          <h1 className="text-base font-bold tracking-wide">Apartment Core</h1>
        </div>
        <div className="flex items-center space-x-1.5 bg-transparent border border-white/10 rounded-full px-3 py-1.5">
          <span className="text-xs text-zinc-400 font-medium tracking-wider">{date}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Grid Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
          <span className="text-zinc-500">Units · {dashboardData.occupancy.total}</span>
          <span className="text-[#dfa553]">{dashboardData.occupancy.rate}% Full</span>
        </div>


        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: dashboardData.occupancy.total }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[3px] ${i < dashboardData.occupancy.occupied ? "bg-[#dfa553]" : "border border-white/10 bg-transparent"}`}
            />
          ))}
        </div>

        <div className="flex space-x-6 text-xs text-zinc-400 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#dfa553]"></div>
            <span>Occupied {dashboardData.occupancy.occupied}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-[2px] border border-white/10"></div>
            <span>Available {dashboardData.occupancy.available}</span>
          </div>
        </div>
      </div>

      {/* Today's Activity (Check-ins & Check-outs) */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Today's Activity</h2>
        <div className="space-y-5 divide-y divide-white/5">
          {/* Check-ins */}
          {dashboardData.check_ins.check_ins.map((item, i) => (
            <div key={`in-${i}`} className="flex justify-between items-center pt-2 first:pt-0">
              <div className="flex border-l-[3px] border-[#53c97f] pl-3.5 flex-col">
                <span className="text-sm font-bold text-white tracking-wide">{item.guest_name}</span>
                <span className="text-xs text-zinc-500 mt-0.5">Floor {item.apartments.floor} · Type {item.apartments.type}</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-[#53c97f] uppercase">Check-in</span>
            </div>
          ))}
          {/* Check-outs */}
          {dashboardData.check_outs.check_outs.map((item, i) => (
            <div key={`out-${i}`} className="flex justify-between items-center pt-2 first:pt-0">
              <div className="flex border-l-[3px] border-[#eb6f62] pl-3.5 flex-col">
                <span className="text-sm font-bold text-white tracking-wide">{item.guest_name}</span>
                <span className="text-xs text-zinc-500 mt-0.5">Floor {item.apartments.floor} · Type {item.apartments.type}</span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-[#eb6f62] uppercase">Departure</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Tenancies Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Active Tenancies</h2>
        <div className="space-y-5 divide-y divide-white/5">
          {dashboardData.occupied_rooms.map((room, i) => (
            <div key={i} className="flex justify-between items-center pt-2 first:pt-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide">{room.guest_name}</span>
                <span className="text-xs text-zinc-500 mt-0.5">Floor {room.apartments.floor} · Type {room.apartments.type} · {room.apartments.bedrooms} BR</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Revenue · ETB</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Gross Revenue</span>
            <span className="font-mono text-white">{dashboardData.revenue.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Refunds</span>
            <span className="font-mono text-white">{dashboardData.revenue.refunds.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Charges</span>
            <span className="font-mono text-white">{dashboardData.revenue.charges.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-white/5 font-bold text-base">
            <span className="text-white">Net Income</span>
            <span className="font-mono text-[#dfa553]">{dashboardData.revenue.net_income.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <ChatCard />
    </main>
  );
}
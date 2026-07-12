"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ChatCard from "../components/ChatCard";
import { authenticatedFetch } from "../lib/api";

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
  date: string;
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
    currency: string;
    revenue: number;
    refunds: number;
    charges: number;
    net_income: number;
  };
}

// Nested response wrapper to match your backend worker's output schema
interface DashboardResponse {
  user: {
    id: number;
    first_name: string;
  };
  dashboard: DashboardData;
}

export default function Home() {
  const [date, setDate] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await authenticatedFetch(`/api/dashboard?date=${date}`);
        const data = await res.json();
        setDashboardData(data as DashboardResponse);
      } catch (err: any) {
        if (err.message === "ACCESS_DENIED") {
          setAccessDenied(true);
        } else {
          console.error("Failed to fetch dashboard:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date]);

  if (accessDenied) {
    return (
      <div className="text-white p-10 text-center min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        Access Denied
      </div>
    );
  }

  if (loading || !date) {
    return (
      <div className="text-white p-4 min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        Authenticating...
      </div>
    );
  }

  // Safe validation pointing to the nested dashboard structure
  const isDataValid =
    dashboardData &&
    dashboardData.dashboard &&
    dashboardData.dashboard.occupancy &&
    dashboardData.dashboard.check_ins?.check_ins &&
    dashboardData.dashboard.check_outs?.check_outs &&
    dashboardData.dashboard.occupied_rooms &&
    dashboardData.dashboard.revenue;

  if (!isDataValid) {
    return (
      <main className="max-w-md mx-auto min-h-screen bg-[#0a0a0a] p-4 font-sans space-y-4 pb-10">
        <div className="text-zinc-400 p-5 border border-white/5 bg-[#131315] rounded-2xl mt-5">
          <p className="text-sm font-semibold text-white mb-2">Data Schema Mismatch</p>
          <p className="text-xs text-zinc-500 mb-4">
            The server structural wrapper was read, but fields inner properties are incomplete.
          </p>
          <pre className="text-[11px] bg-black/40 p-3 rounded-lg overflow-x-auto font-mono text-emerald-400 max-h-[200px] overflow-y-auto">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        </div>
        <ChatCard />
      </main>
    );
  }

  // Extract the dashboard data cleanly so layout bindings function immediately
  const data = dashboardData.dashboard;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#0a0a0a] p-4 font-sans space-y-4 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center px-1 mb-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-[#53c97f]"></div>
          <h1 className="text-base font-bold tracking-wide">Apartment Snapshot</h1>
        </div>
        <div className="flex items-center space-x-1.5 bg-transparent border border-white/10 rounded-full px-3 py-1.5">
          <span className="text-xs text-zinc-400 font-medium tracking-wider">{date}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Grid Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
          <span className="text-zinc-500">Units · {data.occupancy.total}</span>
          <span className="text-[#dfa553]">{data.occupancy.rate}% Full</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: data.occupancy.total }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[3px] ${i < data.occupancy.occupied ? "bg-[#dfa553]" : "border border-white/10 bg-transparent"}`}
            />
          ))}
        </div>

        <div className="flex space-x-6 text-xs text-zinc-400 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#dfa553]"></div>
            <span>Occupied {data.occupancy.occupied}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-[2px] border border-white/10"></div>
            <span>Available {data.occupancy.available}</span>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Today's Activity</h2>
        {data.check_ins.total === 0 && data.check_outs.total === 0 ? (
          <div className="text-xs text-zinc-500 italic text-center py-2">No activity schedules for today</div>
        ) : (
          <div className="space-y-5 divide-y divide-white/5">
            {data.check_ins.check_ins.map((item, i) => (
              <div key={`in-${i}`} className="flex justify-between items-center pt-2 first:pt-0">
                <div className="flex border-l-[3px] border-[#53c97f] pl-3.5 flex-col">
                  <span className="text-sm font-bold text-white tracking-wide">{item.guest_name}</span>
                  <span className="text-xs text-zinc-500 mt-0.5">Floor {item.apartments.floor} · Type {item.apartments.type}</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-[#53c97f] uppercase">Check-in</span>
              </div>
            ))}
            {data.check_outs.check_outs.map((item, i) => (
              <div key={`out-${i}`} className="flex justify-between items-center pt-2 first:pt-0">
                <div className="flex border-l-[3px] border-[#eb6f62] pl-3.5 flex-col">
                  <span className="text-sm font-bold text-white tracking-wide">{item.guest_name}</span>
                  <span className="text-xs text-zinc-500 mt-0.5">Floor {item.apartments.floor} · Type {item.apartments.type}</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-[#eb6f62] uppercase">Departure</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Tenancies Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-4">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Active Tenancies ({data.occupied_rooms.length})</h2>
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {data.occupied_rooms.map((room, i) => (
            <div key={i} className="min-w-[150px] bg-[#1a1a1c] border border-white/5 p-4 rounded-xl shrink-0">
              <div className="text-sm font-bold text-white truncate">{room.guest_name}</div>
              <div className="text-xs text-zinc-400 mt-1">Floor {room.apartments.floor} · Type {room.apartments.type}</div>
              <div className="text-[10px] text-[#dfa553] mt-3 font-medium uppercase tracking-wider">
                {room.apartments.bedrooms || 0} Bedrooms
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Revenue · {data.revenue.currency || "ETB"}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Gross Revenue</span>
            <span className="font-mono text-white">{data.revenue.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Refunds</span>
            <span className="font-mono text-white">{data.revenue.refunds.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Charges</span>
            <span className="font-mono text-white">{data.revenue.charges.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-white/5 font-bold text-base">
            <span className="text-white">Net Income</span>
            <span className="font-mono text-[#dfa553]">{data.revenue.net_income.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <ChatCard />
    </main>
  );
}
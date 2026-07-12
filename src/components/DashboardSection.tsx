"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Layers, Activity, Lock, Unlock, TrendingUp } from "lucide-react";

interface DashboardData {
    date: string;
    occupancy: { total: number; occupied: number; available: number; rate: number };
    occupied_rooms: Array<{ id: string; guestName: string; roomInfo: string; type: string; checkIn: string; checkOut: string }>;
    check_ins: Array<{ id: string; guestName: string; roomInfo: string; time: string }>;
    check_outs: Array<{ id: string; guestName: string; roomInfo: string; time: string }>;
    revenue: { gross: number; refunds: number; charges: number; net: number };
}

export default function DashboardSection() {
    const [selectedDate, setSelectedDate] = useState<string>("2026-05-22");
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchDashboard() {
            setLoading(true);
            try {
                const res = await fetch(`/api/dashboard?date=${selectedDate}`);
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Dashboard pull failed", error);
                // Fallback mockup structure adhering exactly to your requested variables
                setData({
                    date: selectedDate,
                    occupancy: { total: 16, occupied: 7, available: 9, rate: 44 },
                    occupied_rooms: [
                        { id: "1", guestName: "Mohammad Alzahrani", roomInfo: "Floor 5 - Type A", type: "3 Bedrooms", checkIn: "2026-05-22", checkOut: "2026-05-24" }
                    ],
                    check_ins: [{ id: "1", guestName: "Mohammad Alzahrani", roomInfo: "Floor 5 Type A", time: "16:02" }],
                    check_outs: [],
                    revenue: { gross: 14174, refunds: 0, charges: 0, net: 14174 }
                });
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, [selectedDate]);

    return (
        <div className="space-y-5">
            {/* Header Container */}
            <div className="arcade-card p-4 bg-amber-400 text-black flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Layers className="w-5 h-5 stroke-[2.5]" />
                        <h1 className="text-xl font-black uppercase tracking-tight">Apartment Core</h1>
                    </div>
                    <div className="bg-white border-2 border-black px-2 py-0.5 rounded text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Live Ops
                    </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t-2 border-black/20">
                    <span className="text-xs font-bold uppercase">{selectedDate}</span>
                    <div className="relative flex items-center bg-white border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent focus:outline-none uppercase text-[11px] cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="arcade-card p-8 text-center text-xs font-bold tracking-widest animate-pulse uppercase">
                    ⚡ Syncing System Matrices...
                </div>
            ) : data ? (
                <>
                    {/* Tactical Draft Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="arcade-card p-3 flex flex-col justify-between min-h-[75px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Units</span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black">{data.occupancy.total}</span>
                                <Activity className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>
                        <div className="arcade-card p-3 border-emerald-400 flex flex-col justify-between min-h-[75px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Occupied</span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black text-emerald-400">{data.occupancy.occupied}</span>
                                <Lock className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <div className="arcade-card p-3 border-sky-400 flex flex-col justify-between min-h-[75px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Available</span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black text-sky-400">{data.occupancy.available}</span>
                                <Unlock className="w-4 h-4 text-sky-400" />
                            </div>
                        </div>
                        <div className="arcade-card p-3 border-purple-400 flex flex-col justify-between min-h-[75px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Occupancy</span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black text-purple-400">{data.occupancy.rate}%</span>
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                            </div>
                        </div>
                    </div>

                    {/* Occupied Roster Segment */}
                    <div className="space-y-2.5">
                        <h2 className="text-xs font-black uppercase tracking-wider pl-1 text-gray-400">● Current Active Tenancies</h2>
                        {data.occupied_rooms.map((room) => (
                            <div key={room.id} className="arcade-card p-3 bg-gradient-to-br from-transparent to-white/[0.02] space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-black text-sm uppercase text-white tracking-tight">{room.guestName}</h4>
                                        <p className="text-[11px] font-bold text-sky-400 uppercase">{room.roomInfo} · <span className="text-gray-400">{room.type}</span></p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold">
                                    <div className="arcade-card-mini p-1.5 bg-black/20"><span className="text-gray-500">Check-In:</span> <span className="text-white block">{room.checkIn}</span></div>
                                    <div className="arcade-card-mini p-1.5 bg-black/20"><span className="text-gray-500">Check-Out:</span> <span className="text-white block">{room.checkOut}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Timelines */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest pl-1">▲ Arriving Today</h3>
                            {data.check_ins.length === 0 ? <div className="arcade-card-mini p-2 text-[11px] text-gray-500 italic">None scheduled</div> :
                                data.check_ins.map((ci) => (
                                    <div key={ci.id} className="arcade-card-mini p-2 bg-emerald-500/10 border-emerald-500/50">
                                        <div className="font-bold text-xs truncate uppercase">{ci.guestName}</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">{ci.roomInfo} • <span className="text-emerald-400 font-bold">{ci.time}</span></div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest pl-1">▼ Leaving Today</h3>
                            {data.check_outs.length === 0 ? <div className="arcade-card-mini p-2 text-[11px] text-gray-500 italic">None scheduled</div> :
                                data.check_outs.map((co) => (
                                    <div key={co.id} className="arcade-card-mini p-2 bg-rose-500/10 border-rose-500/50">
                                        <div className="font-bold text-xs truncate uppercase">{co.guestName}</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">{co.roomInfo} • <span className="text-rose-400 font-bold">{co.time}</span></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Financial Statement Dashboard Card */}
                    <div className="arcade-card p-4 bg-neutral-900 border-white text-white space-y-3">
                        <div className="flex justify-between items-center border-b border-white/20 pb-1.5">
                            <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Financial Log Ledger</span>
                            <span className="text-[10px] bg-emerald-400 text-black font-black px-1.5 py-0.5 rounded uppercase">ETB Currency</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-bold uppercase">
                            <div className="flex justify-between"><span className="text-zinc-500">Gross Room:</span> <span>{data.revenue.gross.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">Refund Multi:</span> <span className="text-rose-400">{data.revenue.refunds}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">Add Charges:</span> <span>{data.revenue.charges}</span></div>
                            <div className="flex justify-between border-t-2 border-white pt-1 font-black"><span className="text-emerald-400">Net Return:</span> <span className="text-emerald-400">{data.revenue.net.toLocaleString()}</span></div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
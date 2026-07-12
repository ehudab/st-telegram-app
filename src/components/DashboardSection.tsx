"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Home, TrendingUp } from "lucide-react";

interface DashboardData {
    date: string;
    occupancy: { total: number; occupied: number; available: number; rate: number };
    occupied_rooms: Array<{ id: string; guestName: string; roomInfo: string; type: string; checkIn: string; checkOut: string }>;
    check_ins: Array<{ id: string; guestName: string; roomInfo: string; time: string }>;
    check_outs: Array<{ id: string; guestName: string; roomInfo: string; time: string }>;
    revenue: { gross: number; refunds: number; charges: number; net: number };
}

function OccupancyRing({ rate }: { rate: number }) {
    const size = 64;
    const stroke = 7;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (rate / 100) * c;
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,0.15)" strokeWidth={stroke} fill="none" />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke="#101014"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-black">{rate}%</span>
            </div>
        </div>
    );
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
                setData({
                    date: selectedDate,
                    occupancy: { total: 16, occupied: 7, available: 9, rate: 44 },
                    occupied_rooms: [
                        { id: "1", guestName: "Mohammad Alzahrani", roomInfo: "Floor 5 · Type A", type: "3 Bedrooms", checkIn: "2026-05-22", checkOut: "2026-05-24" }
                    ],
                    check_ins: [{ id: "1", guestName: "Mohammad Alzahrani", roomInfo: "Floor 5 · Type A", time: "16:02" }],
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
        <div className="space-y-3">
            {/* Header */}
            <div className="rounded-3xl bg-[#1c1c24] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#8783f5] flex items-center justify-center">
                        <Home className="w-4 h-4 text-black" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tight">Apartment Core</h1>
                        <span className="text-[10px] font-semibold text-[#9696a3]">Live operations</span>
                    </div>
                </div>
                <label className="flex items-center gap-1 bg-[#26262f] rounded-full px-3 py-1.5 text-[11px] font-bold cursor-pointer">
                    {selectedDate}
                    <ChevronDown className="w-3 h-3 text-[#9696a3]" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="sr-only"
                    />
                </label>
            </div>

            {loading ? (
                <div className="rounded-3xl bg-[#1c1c24] p-8 text-center text-xs font-bold text-[#9696a3] animate-soft-pulse">
                    Loading dashboard…
                </div>
            ) : data ? (
                <>
                    {/* Occupancy hero card */}
                    <div className="rounded-3xl bg-[#f5c242] p-4 flex items-center justify-between text-black">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-black/60">Occupancy rate</span>
                            <p className="text-2xl font-black leading-tight">{data.occupancy.occupied} of {data.occupancy.total} units</p>
                            <p className="text-[11px] font-semibold text-black/60 mt-0.5">{data.occupancy.available} available today</p>
                        </div>
                        <OccupancyRing rate={data.occupancy.rate} />
                    </div>

                    {/* Stat tiles */}
                    <div className="grid grid-cols-3 gap-2.5">
                        <div className="rounded-2xl bg-[#1c1c24] p-3 flex flex-col gap-3">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-[#9696a3]">Total</span>
                            <span className="text-xl font-black">{data.occupancy.total}</span>
                        </div>
                        <div className="rounded-2xl bg-[#1c1c24] p-3 flex flex-col gap-3">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-[#3fd9a4]">Occupied</span>
                            <span className="text-xl font-black text-[#3fd9a4]">{data.occupancy.occupied}</span>
                        </div>
                        <div className="rounded-2xl bg-[#1c1c24] p-3 flex flex-col gap-3">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-[#8783f5]">Available</span>
                            <span className="text-xl font-black text-[#8783f5]">{data.occupancy.available}</span>
                        </div>
                    </div>

                    {/* Active tenancies */}
                    <div className="space-y-2">
                        <h2 className="text-[11px] font-black uppercase tracking-wide text-[#9696a3] pl-1">Active tenancies</h2>
                        {data.occupied_rooms.map((room) => (
                            <div key={room.id} className="rounded-2xl bg-[#1c1c24] p-3.5 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm">{room.guestName}</h4>
                                    <p className="text-[11px] font-semibold text-[#9696a3]">{room.roomInfo} · {room.type}</p>
                                </div>
                                <div className="text-right text-[10px] font-bold text-[#9696a3]">
                                    <div>{room.checkIn}</div>
                                    <div>→ {room.checkOut}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Arrivals / Departures */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1.5">
                            <h3 className="text-[10px] font-black uppercase tracking-wide text-[#3fd9a4] pl-1">Arriving today</h3>
                            {data.check_ins.length === 0 ? (
                                <div className="rounded-xl bg-[#1c1c24] p-2.5 text-[11px] text-[#9696a3] font-medium">None scheduled</div>
                            ) : (
                                data.check_ins.map((ci) => (
                                    <div key={ci.id} className="rounded-xl bg-[#1c1c24] p-2.5">
                                        <div className="font-bold text-xs truncate">{ci.guestName}</div>
                                        <div className="text-[10px] text-[#9696a3] font-semibold mt-0.5">{ci.roomInfo} · <span className="text-[#3fd9a4]">{ci.time}</span></div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-[10px] font-black uppercase tracking-wide text-[#ff7a59] pl-1">Leaving today</h3>
                            {data.check_outs.length === 0 ? (
                                <div className="rounded-xl bg-[#1c1c24] p-2.5 text-[11px] text-[#9696a3] font-medium">None scheduled</div>
                            ) : (
                                data.check_outs.map((co) => (
                                    <div key={co.id} className="rounded-xl bg-[#1c1c24] p-2.5">
                                        <div className="font-bold text-xs truncate">{co.guestName}</div>
                                        <div className="text-[10px] text-[#9696a3] font-semibold mt-0.5">{co.roomInfo} · <span className="text-[#ff7a59]">{co.time}</span></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="rounded-3xl bg-[#ff7a59] p-4 text-black space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-black/60">Revenue ledger</span>
                            <div className="flex items-center gap-1 bg-black/10 rounded-full px-2 py-0.5">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-[10px] font-black">ETB</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 text-xs font-bold">
                            <div>
                                <div className="text-[10px] font-semibold text-black/60">Gross</div>
                                <div>{data.revenue.gross.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-semibold text-black/60">Refunds</div>
                                <div>{data.revenue.refunds.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-semibold text-black/60">Charges</div>
                                <div>{data.revenue.charges.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-semibold text-black/60">Net</div>
                                <div className="text-base">{data.revenue.net.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

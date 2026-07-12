"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DashboardData {
    date: string;
    occupancy: { total: number; occupied: number; available: number; rate: number };
    occupied_rooms: Array<{ id: string; guestName: string; roomInfo: string; type: string; checkIn: string; checkOut: string }>;
    check_ins: Array<{ id: string; guestName: string; roomInfo: string; time: string }>;
    check_outs: Array<{ id: string; guestName: string; roomInfo: string; time: string }>;
    revenue: { gross: number; refunds: number; charges: number; net: number };
}

// Signature visualization: every unit as a cell, colored by status.
// Encodes the same info stat tiles would, but reads at a glance like a real building.
function UnitGrid({ total, occupied }: { total: number; occupied: number }) {
    const cells = Array.from({ length: total }, (_, i) => i < occupied);
    return (
        <div className="grid grid-cols-8 gap-1.5">
            {cells.map((isOccupied, i) => (
                <div
                    key={i}
                    className={`aspect-square rounded-[3px] ${isOccupied ? "bg-[var(--brass)]" : "bg-transparent border border-[var(--line)]"
                        }`}
                />
            ))}
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

    // Merge arrivals/departures into one chronological activity feed.
    const activity = data
        ? [
            ...data.check_ins.map((c) => ({ ...c, kind: "in" as const })),
            ...data.check_outs.map((c) => ({ ...c, kind: "out" as const })),
        ].sort((a, b) => a.time.localeCompare(b.time))
        : [];

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between px-1 pt-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                    <h1 className="font-display font-semibold text-[15px] tracking-tight">Apartment Core</h1>
                </div>
                <label className="flex items-center gap-1.5 border border-[var(--line)] rounded-full pl-3 pr-2 py-1 cursor-pointer">
                    <span className="font-mono text-[11px] text-[var(--muted)]">{selectedDate}</span>
                    <ChevronDown className="w-3 h-3 text-[var(--muted)]" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="sr-only"
                    />
                </label>
            </div>

            {loading ? (
                <div className="rounded-2xl bg-[var(--panel)] p-8 text-center font-mono text-[11px] text-[var(--muted)] animate-soft-pulse">
                    loading_dashboard…
                </div>
            ) : data ? (
                <>
                    {/* Unit grid — signature */}
                    <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Units · {data.occupancy.total}</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brass)]">{data.occupancy.rate}% full</span>
                        </div>
                        <UnitGrid total={data.occupancy.total} occupied={data.occupancy.occupied} />
                        <div className="flex items-center gap-4 pt-1 border-t border-[var(--line)]">
                            <div className="flex items-center gap-1.5 pt-3">
                                <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--brass)]" />
                                <span className="font-mono text-[10px] text-[var(--muted)]">Occupied {data.occupancy.occupied}</span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-3">
                                <span className="w-2.5 h-2.5 rounded-[2px] border border-[var(--line)]" />
                                <span className="font-mono text-[10px] text-[var(--muted)]">Available {data.occupancy.available}</span>
                            </div>
                        </div>
                    </div>

                    {/* Today's activity — merged feed */}
                    {activity.length > 0 && (
                        <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] overflow-hidden">
                            <div className="px-4 pt-3.5 pb-2">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Today&apos;s activity</span>
                            </div>
                            <div className="divide-y divide-[var(--line)]">
                                {activity.map((ev) => (
                                    <div key={`${ev.kind}-${ev.id}`} className="flex items-center gap-3 px-4 py-2.5">
                                        <span
                                            className={`w-1 self-stretch rounded-full ${ev.kind === "in" ? "bg-[var(--green)]" : "bg-[var(--rust)]"
                                                }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium truncate">{ev.guestName}</p>
                                            <p className="text-[11px] text-[var(--muted)] truncate">{ev.roomInfo}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-mono text-[11px]">{ev.time}</div>
                                            <div className={`font-mono text-[9px] uppercase ${ev.kind === "in" ? "text-[var(--green)]" : "text-[var(--rust)]"}`}>
                                                {ev.kind === "in" ? "arrival" : "departure"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active tenancies */}
                    <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] overflow-hidden">
                        <div className="px-4 pt-3.5 pb-2">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Active tenancies</span>
                        </div>
                        <div className="divide-y divide-[var(--line)]">
                            {data.occupied_rooms.map((room) => (
                                <div key={room.id} className="flex items-center justify-between px-4 py-2.5">
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-medium truncate">{room.guestName}</p>
                                        <p className="text-[11px] text-[var(--muted)] truncate">{room.roomInfo} · {room.type}</p>
                                    </div>
                                    <div className="text-right shrink-0 font-mono text-[10px] text-[var(--muted)]">
                                        <div>{room.checkIn}</div>
                                        <div>→ {room.checkOut}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] p-4 space-y-2.5">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Revenue · ETB</span>
                        <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-[var(--muted)]">Gross</span>
                                <span className="font-mono">{data.revenue.gross.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-[var(--muted)]">Refunds</span>
                                <span className="font-mono">{data.revenue.refunds.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-[var(--muted)]">Charges</span>
                                <span className="font-mono">{data.revenue.charges.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]">
                                <span className="text-[13px] font-medium">Net</span>
                                <span className="font-mono text-base text-[var(--brass)] font-semibold">{data.revenue.net.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
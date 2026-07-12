"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DashboardData {
    date: string;
    occupancy: { total: number; occupied: number; available: number; rate: number };
    occupied_rooms: Array<any>;
    check_ins: Array<any>;
    check_outs: Array<any>;
}

export default function DashboardSection() {
    const [selectedDate, setSelectedDate] = useState<string>("2026-05-22");

    // Using the exact data from the screenshot for perfect layout matching
    const data: DashboardData = {
        date: selectedDate,
        occupancy: { total: 16, occupied: 7, available: 9, rate: 44 },
        occupied_rooms: [
            { id: "1", guestName: "Mohammad Alzahrani", roomInfo: "Floor 5 · Type A · 3 Bedrooms", checkIn: "2026-05-22", checkOut: "2026-05-24" },
            { id: "2", guestName: "Liya Tesfaye", roomInfo: "Floor 2 · Type C · 1 Bedroom", checkIn: "2026-05-20", checkOut: "2026-05-26" }
        ],
        check_ins: [{ id: "1", guestName: "Mohammad Alzahrani", roomInfo: "Floor 5 · Type A", time: "16:02" }],
        check_outs: [{ id: "1", guestName: "Dawit Bekele", roomInfo: "Floor 3 · Type B", time: "11:15" }],
    };

    // Generate grid array (7 occupied, 9 available)
    const gridBoxes = Array.from({ length: data.occupancy.total }, (_, i) => i < data.occupancy.occupied);

    return (
        <div className="space-y-4 font-sans pb-4">

            {/* Top Header */}
            <div className="flex justify-between items-center mb-6 pt-2 px-1">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <h1 className="text-lg font-bold tracking-tight text-white">Apartment Core</h1>
                </div>
                <div className="flex items-center space-x-1.5 bg-transparent border border-white/10 rounded-full px-3 py-1.5">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-xs text-zinc-400 focus:outline-none w-[75px] cursor-pointer custom-date-input"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </div>
            </div>

            {/* Grid Unit Summary Card */}
            <div className="bg-[#141416] border border-white/5 rounded-[20px] p-5 space-y-5 shadow-sm">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                    <span className="text-zinc-500">Units • {data.occupancy.total}</span>
                    <span className="text-[#c69a54]">{data.occupancy.rate}% Full</span>
                </div>

                {/* 8-Column Box Grid */}
                <div className="grid grid-cols-8 gap-1.5">
                    {gridBoxes.map((isOccupied, index) => (
                        <div
                            key={index}
                            className={`aspect-square rounded-[2px] ${isOccupied
                                    ? "bg-[#c69a54]"
                                    : "border border-white/10 bg-transparent"
                                }`}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="flex space-x-5 text-xs text-zinc-400">
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#c69a54]"></div>
                        <span>Occupied {data.occupancy.occupied}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-sm border border-white/10"></div>
                        <span>Available {data.occupancy.available}</span>
                    </div>
                </div>
            </div>

            {/* Today's Activity Card */}
            <div className="bg-[#141416] border border-white/5 rounded-[20px] p-5 space-y-5">
                <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Today's Activity</h2>
                <div className="space-y-4 divide-y divide-white/5">

                    {/* Checkout Item */}
                    <div className="flex justify-between items-center pt-2 first:pt-0">
                        <div className="flex border-l-2 border-[#e56b55] pl-3 flex-col">
                            <span className="text-sm font-semibold text-white">{data.check_outs[0].guestName}</span>
                            <span className="text-xs text-zinc-500">{data.check_outs[0].roomInfo}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-white">{data.check_outs[0].time}</span>
                            <span className="text-[9px] font-bold tracking-widest text-[#e56b55] uppercase mt-0.5">Departure</span>
                        </div>
                    </div>

                    {/* Check-in Item */}
                    <div className="flex justify-between items-center pt-4">
                        <div className="flex border-l-2 border-[#4ade80] pl-3 flex-col">
                            <span className="text-sm font-semibold text-white">{data.check_ins[0].guestName}</span>
                            <span className="text-xs text-zinc-500">{data.check_ins[0].roomInfo}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-white">{data.check_ins[0].time}</span>
                            <span className="text-[9px] font-bold tracking-widest text-[#4ade80] uppercase mt-0.5">Arrival</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Active Tenancies Card */}
            <div className="bg-[#141416] border border-white/5 rounded-[20px] p-5 space-y-5">
                <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Active Tenancies</h2>
                <div className="space-y-4 divide-y divide-white/5">

                    {data.occupied_rooms.map((room, i) => (
                        <div key={room.id} className={`flex justify-between items-start ${i !== 0 ? 'pt-4' : ''}`}>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">{room.guestName}</span>
                                <span className="text-xs text-zinc-500 mt-0.5">{room.roomInfo}</span>
                            </div>
                            <div className="flex flex-col items-end text-xs text-zinc-500">
                                <span>{room.checkIn}</span>
                                <span>→ {room.checkOut}</span>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}
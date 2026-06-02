'use client';

import { useState } from 'react';

interface DatePickerProps {
  onDateSelect: (date: string) => void;
}

export default function CustomDatePicker({ onDateSelect }: DatePickerProps) {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const blankDays = [0];
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const highlightedDays = [9, 13];

  return (
    <div className="w-full max-w-[280px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm font-sans">
      <div className="flex items-center justify-between mb-4">
        <button className="text-gray-400 hover:text-gray-700 text-sm">‹</button>
        <div className="flex gap-1">
          <select className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded p-1 text-gray-700 outline-none">
            <option>Sep</option>
          </select>
          <select className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded p-1 text-gray-700 outline-none">
            <option>2025</option>
          </select>
        </div>
        <button className="text-gray-400 hover:text-gray-700 text-sm">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-[10px] font-medium text-gray-400">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {blankDays.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {daysInMonth.map((day) => {
          const isHighlighted = highlightedDays.includes(day);
          return (
            <button
              key={day}
              onClick={() => onDateSelect(`2025-09-${day.toString().padStart(2, '0')}`)}
              className={`text-xs p-1.5 rounded-lg transition-all flex items-center justify-center ${
                isHighlighted
                  ? 'bg-[#333333] text-white font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

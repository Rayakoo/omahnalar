'use client';

import { useState, useCallback, useMemo } from 'react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface DatePickerProps {
  onDateSelect: (date: string) => void;
}

export default function CustomDatePicker({ onDateSelect }: DatePickerProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = useCallback(() => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const nextMonth = useCallback(() => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const handleSelect = (day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelected(formatted);
    onDateSelect(formatted);
  };

  const isToday = (day: number) => {
    const d = new Date();
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    );
  };

  return (
    <div className="w-full max-w-[280px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm font-sans">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="text-gray-400 hover:text-gray-700 text-sm px-1"
        >
          ‹
        </button>

        <div className="flex gap-1">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded p-1 text-gray-700 outline-none"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded p-1 text-gray-700 outline-none"
          >
            {Array.from({ length: 11 }, (_, i) => 2025 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="text-gray-400 hover:text-gray-700 text-sm px-1"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <span key={day} className="text-[10px] font-medium text-gray-400">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selected === value;
          const highlight = isToday(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              className={`text-xs p-1.5 rounded-lg transition-all flex items-center justify-center ${
                isSelected
                  ? 'bg-[#4C4765] text-white font-bold'
                  : highlight
                    ? 'bg-[#F4C46B] text-[#4C4765] font-semibold'
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

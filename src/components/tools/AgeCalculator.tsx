import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Cake } from 'lucide-react';
import { ToolHeader } from './ToolHeader';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const calculateAge = () => {
    const b = new Date(birthDate);
    const t = new Date(targetDate);

    if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) {
      return null;
    }

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total units
    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday calculation
    let nextBdayYear = t.getFullYear();
    let nextBday = new Date(nextBdayYear, b.getMonth(), b.getDate());
    if (nextBday < t) {
      nextBday = new Date(nextBdayYear + 1, b.getMonth(), b.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysOfWeek[b.getDay()];

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      daysToNextBday,
      bornDay,
    };
  };

  const age = calculateAge();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Age Calculator"
        description="Determine your exact age in years, months, and days, total life statistics, and countdown to your next birthday."
        category="Calculators"
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Age at the Date of
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {age ? (
        <div className="space-y-6">
          {/* Main Primary Age Hero */}
          <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-indigo-200 mb-1">
                Calculated Age
              </div>
              <div className="text-3xl sm:text-5xl font-black tracking-tight">
                {age.years} <span className="text-2xl sm:text-3xl font-normal text-indigo-100">years</span> {age.months} <span className="text-2xl sm:text-3xl font-normal text-indigo-100">m</span> {age.days} <span className="text-2xl sm:text-3xl font-normal text-indigo-100">d</span>
              </div>
              <div className="text-xs text-indigo-200 mt-2">
                Born on a <strong className="text-white">{age.bornDay}</strong>
              </div>
            </div>

            <div className="mt-6 sm:mt-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
              <Cake className="w-8 h-8 mx-auto text-amber-300 mb-1" />
              <div className="text-2xl font-black">{age.daysToNextBday}</div>
              <div className="text-[11px] text-indigo-100 uppercase tracking-wider font-semibold">Days to Next Birthday</div>
            </div>
          </div>

          {/* Breakdown Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Days</div>
              <div className="text-2xl font-black text-slate-900">{age.totalDays.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Weeks</div>
              <div className="text-2xl font-black text-slate-900">{age.totalWeeks.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Hours</div>
              <div className="text-2xl font-black text-slate-900">{age.totalHours.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Minutes</div>
              <div className="text-2xl font-black text-slate-900">{age.totalMinutes.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Please select a valid date of birth earlier than the target date.
        </div>
      )}
    </div>
  );
};

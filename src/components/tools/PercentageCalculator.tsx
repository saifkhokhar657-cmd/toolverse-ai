import React, { useState } from 'react';
import { Percent, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<string>('15');
  const [m1Y, setM1Y] = useState<string>('200');

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState<string>('25');
  const [m2Y, setM2Y] = useState<string>('125');

  // Mode 3: Percentage change from X to Y
  const [m3X, setM3X] = useState<string>('100');
  const [m3Y, setM3Y] = useState<string>('150');

  // Mode 4: Add/Subtract X% to/from Y
  const [m4X, setM4X] = useState<string>('10');
  const [m4Y, setM4Y] = useState<string>('80');
  const [m4Op, setM4Op] = useState<'add' | 'subtract'>('add');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyVal = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Calculations
  const r1 = (parseFloat(m1X) / 100) * parseFloat(m1Y);
  const r2 = parseFloat(m2Y) !== 0 ? (parseFloat(m2X) / parseFloat(m2Y)) * 100 : 0;
  const diff3 = parseFloat(m3Y) - parseFloat(m3X);
  const r3 = parseFloat(m3X) !== 0 ? (diff3 / parseFloat(m3X)) * 100 : 0;
  const perc4 = (parseFloat(m4X) / 100) * parseFloat(m4Y);
  const r4 = m4Op === 'add' ? parseFloat(m4Y) + perc4 : parseFloat(m4Y) - perc4;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Percentage Calculator"
        description="Compute percentages, percentage increases/decreases, and proportions instantly with complete calculation formulas."
        category="Calculators"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: What is X% of Y? */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-extrabold">
                1
              </span>
              <span>What is X% of Y?</span>
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Percentage (X)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={m1X}
                    onChange={(e) => setM1X(e.target.value)}
                    className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold mt-5">of</span>
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Total (Y)</label>
                <input
                  type="number"
                  value={m1Y}
                  onChange={(e) => setM1Y(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Result:</span>
              <div className="text-xl font-black text-indigo-600">
                {isNaN(r1) ? '—' : Number(r1.toFixed(2))}
              </div>
              <span className="text-[10px] text-slate-400">Formula: ({m1X} ÷ 100) × {m1Y}</span>
            </div>
            <button
              onClick={() => copyVal(String(r1.toFixed(2)), 'm1')}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 cursor-pointer"
            >
              {copiedKey === 'm1' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 2: X is what percent of Y? */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-extrabold">
                2
              </span>
              <span>X is what percent of Y?</span>
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Part (X)</label>
                <input
                  type="number"
                  value={m2X}
                  onChange={(e) => setM2X(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <span className="text-xs text-slate-400 font-bold mt-5">is % of</span>
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Total (Y)</label>
                <input
                  type="number"
                  value={m2Y}
                  onChange={(e) => setM2Y(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Result:</span>
              <div className="text-xl font-black text-indigo-600">
                {isNaN(r2) ? '—' : `${Number(r2.toFixed(2))}%`}
              </div>
              <span className="text-[10px] text-slate-400">Formula: ({m2X} ÷ {m2Y}) × 100</span>
            </div>
            <button
              onClick={() => copyVal(`${r2.toFixed(2)}%`, 'm2')}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 cursor-pointer"
            >
              {copiedKey === 'm2' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 3: Percentage Increase / Decrease */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-extrabold">
                3
              </span>
              <span>Percentage Change (X to Y)</span>
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">From (Initial X)</label>
                <input
                  type="number"
                  value={m3X}
                  onChange={(e) => setM3X(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <span className="text-xs text-slate-400 font-bold mt-5">to</span>
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">To (Final Y)</label>
                <input
                  type="number"
                  value={m3Y}
                  onChange={(e) => setM3Y(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">
                {r3 >= 0 ? 'Percentage Increase' : 'Percentage Decrease'}:
              </span>
              <div className={`text-xl font-black ${r3 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isNaN(r3) ? '—' : `${r3 > 0 ? '+' : ''}${Number(r3.toFixed(2))}%`}
              </div>
              <span className="text-[10px] text-slate-400">Difference: {diff3 >= 0 ? `+${diff3}` : diff3}</span>
            </div>
            <button
              onClick={() => copyVal(`${r3.toFixed(2)}%`, 'm3')}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 cursor-pointer"
            >
              {copiedKey === 'm3' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card 4: Add or Subtract % */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-extrabold">
                4
              </span>
              <span>Add / Subtract % from Amount</span>
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Percentage (X)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={m4X}
                    onChange={(e) => setM4X(e.target.value)}
                    className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="mt-5">
                <select
                  value={m4Op}
                  onChange={(e) => setM4Op(e.target.value as any)}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="add">+ Add to</option>
                  <option value="subtract">- Subtract from</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Amount (Y)</label>
                <input
                  type="number"
                  value={m4Y}
                  onChange={(e) => setM4Y(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Final Value:</span>
              <div className="text-xl font-black text-indigo-600">
                {isNaN(r4) ? '—' : Number(r4.toFixed(2))}
              </div>
              <span className="text-[10px] text-slate-400">
                Delta ({m4Op === 'add' ? '+' : '-'}{m4X}%): {perc4.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => copyVal(String(r4.toFixed(2)), 'm4')}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 cursor-pointer"
            >
              {copiedKey === 'm4' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

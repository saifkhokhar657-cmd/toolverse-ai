import React, { useState } from 'react';
import { Activity, Heart, Info, ArrowRight } from 'lucide-react';
import { ToolHeader } from './ToolHeader';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Metric state
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);

  // Imperial state
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(154);

  // Math
  let bmi = 0;
  let healthyMinWeight = 0;
  let healthyMaxWeight = 0;

  if (unit === 'metric') {
    const heightM = heightCm / 100;
    if (heightM > 0) {
      bmi = weightKg / (heightM * heightM);
      healthyMinWeight = 18.5 * (heightM * heightM);
      healthyMaxWeight = 24.9 * (heightM * heightM);
    }
  } else {
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches > 0) {
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
      healthyMinWeight = (18.5 * (totalInches * totalInches)) / 703;
      healthyMaxWeight = (24.9 * (totalInches * totalInches)) / 703;
    }
  }

  const getBmiCategory = (score: number) => {
    if (score < 18.5) return { name: 'Underweight', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (score < 25) return { name: 'Normal Weight', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score < 30) return { name: 'Overweight', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { name: 'Obesity', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const category = getBmiCategory(bmi);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="BMI Calculator"
        description="Check your Body Mass Index (BMI), health risk classification, and optimal target weight ranges according to WHO criteria."
        category="Calculators"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          {/* Unit Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Measurement System
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  unit === 'metric'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Metric (cm, kg)
              </button>
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  unit === 'imperial'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Imperial (ft, in, lbs)
              </button>
            </div>
          </div>

          {/* Metric inputs */}
          {unit === 'metric' ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Height (cm)</label>
                  <span className="text-sm font-bold text-indigo-600">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={230}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Weight (kg)</label>
                  <span className="text-sm font-bold text-indigo-600">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Height (Feet)</label>
                  <input
                    type="number"
                    min={3}
                    max={7}
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Height (Inches)</label>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  min={60}
                  max={500}
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>
          )}

        </div>

        {/* Results gauge panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Your Body Mass Index (BMI)
            </span>
            <div className="text-4xl sm:text-5xl font-black text-indigo-600 tracking-tight">
              {bmi > 0 ? bmi.toFixed(1) : '—'}
            </div>
            
            <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-extrabold border ${category.bg} ${category.color} ${category.border}`}>
              {category.name}
            </div>
          </div>

          {/* Scale bar */}
          <div>
            <div className="h-3 w-full rounded-full overflow-hidden flex mb-2">
              <div className="bg-amber-400 flex-1" title="Underweight (< 18.5)" />
              <div className="bg-emerald-500 flex-1" title="Normal (18.5 - 24.9)" />
              <div className="bg-orange-400 flex-1" title="Overweight (25 - 29.9)" />
              <div className="bg-rose-500 flex-1" title="Obesity (≥ 30)" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>&lt; 18.5</span>
              <span>18.5 - 24.9</span>
              <span>25 - 29.9</span>
              <span>30+</span>
            </div>
          </div>

          {/* Healthy range recommendation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Recommended Healthy Weight Range</span>
            </div>
            <p>
              For your height, a normal BMI weight is between{' '}
              <strong className="text-slate-900">
                {healthyMinWeight.toFixed(1)} – {healthyMaxWeight.toFixed(1)}{' '}
                {unit === 'metric' ? 'kg' : 'lbs'}
              </strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

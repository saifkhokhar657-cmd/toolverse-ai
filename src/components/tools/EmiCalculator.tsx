import React, { useState } from 'react';
import { DollarSign, PieChart, Landmark, TrendingUp } from 'lucide-react';
import { ToolHeader } from './ToolHeader';

export const EmiCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(50000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // Math: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
  const principal = amount;
  const monthlyRate = rate / 12 / 100;
  const numberOfMonths = tenureYears * 12;

  const emi = numberOfMonths > 0 && monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1)
    : 0;

  const totalPayment = emi * numberOfMonths;
  const totalInterest = totalPayment - principal;

  const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 50;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="EMI Loan Calculator"
        description="Calculate your Equated Monthly Installment (EMI), total interest payable, and repayment schedule for mortgages, auto, or personal loans."
        category="Calculators"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders Input Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Loan Amount
              </label>
              <div className="flex items-center gap-1 font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                <span>$</span>
                <input
                  type="number"
                  min={1000}
                  max={2000000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-24 bg-transparent text-right font-extrabold text-indigo-600 focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>$5,000</span>
              <span>$500,000</span>
              <span>$1,000,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Interest Rate (% p.a.)
              </label>
              <div className="flex items-center gap-1 font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                <input
                  type="number"
                  min={1}
                  max={30}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-14 bg-transparent text-right font-extrabold text-indigo-600 focus:outline-none"
                />
                <span>%</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.25}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1%</span>
              <span>10%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Loan Tenure (Years)
              </label>
              <div className="flex items-center gap-1 font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                <input
                  type="number"
                  min={1}
                  max={35}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-12 bg-transparent text-right font-extrabold text-indigo-600 focus:outline-none"
                />
                <span>Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>

        </div>

        {/* Results Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Monthly Payment (EMI)
            </span>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
              {formatCurrency(emi)}
            </div>
            <span className="text-[11px] text-slate-400">per month for {numberOfMonths} months</span>
          </div>

          {/* Breakdown summary */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span> Principal Amount
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(principal)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Total Interest
              </span>
              <span className="font-bold text-amber-600">{formatCurrency(totalInterest)}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold text-slate-900">
              <span>Total Payment</span>
              <span>{formatCurrency(totalPayment)}</span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-2">
              <div
                style={{ width: `${principalPercent}%` }}
                className="bg-indigo-600 h-full transition-all"
                title={`Principal: ${principalPercent.toFixed(1)}%`}
              />
              <div
                style={{ width: `${interestPercent}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Interest: ${interestPercent.toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Principal: {principalPercent.toFixed(1)}%</span>
              <span>Interest: {interestPercent.toFixed(1)}%</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

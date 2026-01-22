// src/components/WeeklySummaryChart.js
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { parseISO, startOfWeek, format, subWeeks } from 'date-fns';

export default function WeeklySummaryChart({ plans }) {
  const data = useMemo(() => {
    const now = new Date();
    // last 6 Mondays
    const weeks = Array.from({ length: 6 }).map((_, i) => {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      return { weekStart, label: format(weekStart, 'MMM d') };
    }).reverse();

    const counts = weeks.map(w => ({ week: w.label, count: 0 }));

    plans.forEach(plan => {
      if (plan.completed && plan.completedDate) {
        const date = parseISO(plan.completedDate);
        for (let i = 0; i < weeks.length; i++) {
          const start = weeks[i].weekStart;
          const end = i < weeks.length - 1 ? weeks[i + 1].weekStart : now;
          if (date >= start && date < end) {
            counts[i].count += 1;
            break;
          }
        }
      }
    });

    return counts;
  }, [plans]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Weekly Completion Summary</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

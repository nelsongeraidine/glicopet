"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import type { Measurement } from "@/types/measurement";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Measurement }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const m = payload[0].payload;

  return (
    <div className="rounded-xl bg-white p-3 text-sm shadow-md">
      <p className="font-semibold">{m.dateTime}</p>
      {m.glucose !== undefined && <p>Glicemia: {m.glucose} mg/dL</p>}
      {m.insulin !== undefined && <p>Insulina: {m.insulin} U</p>}
      {m.food !== undefined && <p>Alimentação: {m.food} g</p>}
      {m.context && <p>Contexto: {m.context}</p>}
      {m.notes && <p>Observação: {m.notes}</p>}
    </div>
  );
}

export function GlucoseChart({
  measurements,
  referenceRangeMin,
  referenceRangeMax,
}: {
  measurements: Measurement[];
  referenceRangeMin?: number;
  referenceRangeMax?: number;
}) {
  const data = [...measurements].sort(
    (a, b) => a.dateTime.localeCompare(b.dateTime)
  );
  const hasReferenceRange = referenceRangeMin !== undefined && referenceRangeMax !== undefined;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F8F7FC" />
          <XAxis dataKey="dateTime" tick={{ fontSize: 11 }} minTickGap={20} />
          <YAxis
            yAxisId="glucose"
            tick={{ fontSize: 11 }}
            label={{ value: "mg/dL", angle: -90, position: "insideLeft", fontSize: 11 }}
          />
          {hasReferenceRange && (
            <ReferenceArea
              yAxisId="glucose"
              y1={referenceRangeMin}
              y2={referenceRangeMax}
              fill="#DDF1E7"
              fillOpacity={0.5}
              ifOverflow="extendDomain"
            />
          )}
          <YAxis
            yAxisId="insulin"
            orientation="right"
            tick={{ fontSize: 11 }}
            label={{ value: "U", angle: 90, position: "insideRight", fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="insulin"
            dataKey="insulin"
            name="Insulina (U)"
            fill="#DCEBFA"
            barSize={16}
          />
          <Line
            yAxisId="glucose"
            type="monotone"
            dataKey="glucose"
            name="Glicemia (mg/dL)"
            stroke="#B9A0E8"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

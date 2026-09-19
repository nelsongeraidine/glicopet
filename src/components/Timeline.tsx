import type { Measurement } from "@/types/measurement";
import { parseDateTime } from "@/utils/calculations";

type TimelineEvent = {
  key: string;
  dateTime: string;
  icon: string;
  label: string;
};

function eventsFromMeasurement(m: Measurement): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  if (m.glucose !== undefined) {
    events.push({ key: `${m.id}-glucose`, dateTime: m.dateTime, icon: "🩸", label: `${m.glucose} mg/dL` });
  }
  if (m.insulin !== undefined) {
    events.push({ key: `${m.id}-insulin`, dateTime: m.dateTime, icon: "💉", label: `${m.insulin} U de insulina` });
  }
  if (m.food !== undefined) {
    events.push({ key: `${m.id}-food`, dateTime: m.dateTime, icon: "🍽️", label: `${m.food} g de ração` });
  }
  return events;
}

export function Timeline({ measurements }: { measurements: Measurement[] }) {
  const events = measurements
    .flatMap(eventsFromMeasurement)
    .sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime));

  if (events.length === 0) return null;

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={event.key} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
          <span className="text-xl">{event.icon}</span>
          <div>
            <p className="text-sm font-medium">{event.label}</p>
            <p className="text-xs text-[#6F6B78]">{event.dateTime}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

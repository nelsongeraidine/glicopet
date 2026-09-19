export type MeasurementContext =
  | "Antes da alimentação"
  | "Após a alimentação"
  | "Antes da insulina"
  | "Após a insulina"
  | "Outro";

export interface Measurement {
  id: string;
  petName: string;
  date: string;
  time: string;
  dateTime: string;
  glucose?: number;
  insulin?: number;
  food?: number;
  context?: MeasurementContext | string;
  notes?: string;
  isDemo?: boolean;
}

export type NewMeasurement = Omit<Measurement, "id">;

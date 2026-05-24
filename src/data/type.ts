export interface HardDrive {
  id?: string;
  brand: string;
  model: string;
  capacity: string;
  rpm?: number | null;
  cache?: string | null;
  interface?: string | null;
  interfaceVersion?: string | null;
  technology: string;
  series?: string;
  formFactor?: string | null;
  formFactorHeight?: string | null;
  workloadRating?: string | null;
  warranty?: string | null;
  targetUse?: string | null;
  grade?: string | null;
  performance?: string | null;
  price?: string | null;
  notes?: string | null;
  MTBF?: string | null;
}

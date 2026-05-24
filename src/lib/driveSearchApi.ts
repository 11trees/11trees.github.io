import { HardDrive } from '@/data/type';

const SEARCH_API_URL =
  import.meta.env.VITE_HARD_DRIVE_SEARCH_API_URL ||
  'https://hard-drive-type-checker-worker.1996landi.workers.dev/api/search';

interface SearchApiDrive {
  brand: string;
  model: string;
  capacity: string;
  technology: string;
  series?: string;
  rpm?: number;
  cache?: string;
  interface?: string;
  formFactor?: string;
  workloadRating?: string;
  warranty?: string;
  targetUse?: string;
  performance?: string;
  price?: string;
  MTBF?: string;
  notes?: string;
}

interface SearchApiResponse {
  query: string;
  results: SearchApiDrive[];
}

interface SearchApiErrorResponse {
  error?: string;
}

export class DriveSearchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'DriveSearchError';
    this.status = status;
  }
}

const toHardDrive = (drive: SearchApiDrive, index: number): HardDrive => ({
  id: `${drive.model}-${index}`,
  brand: drive.brand,
  model: drive.model,
  capacity: drive.capacity,
  technology: drive.technology,
  series: drive.series,
  rpm: drive.rpm,
  cache: drive.cache,
  interface: drive.interface,
  formFactor: drive.formFactor,
  workloadRating: drive.workloadRating,
  warranty: drive.warranty,
  targetUse: drive.targetUse,
  performance: drive.performance,
  price: drive.price,
  MTBF: drive.MTBF,
  notes: drive.notes,
});

const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as SearchApiErrorResponse;
    return data.error || `Search failed with status ${response.status}.`;
  } catch {
    return `Search failed with status ${response.status}.`;
  }
};

export const searchHardDrives = async (
  query: string,
  signal?: AbortSignal
): Promise<HardDrive[]> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const url = `${SEARCH_API_URL}?q=${encodeURIComponent(trimmedQuery)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new DriveSearchError(await readErrorMessage(response), response.status);
  }

  const data = (await response.json()) as SearchApiResponse;
  return data.results.map(toHardDrive);
};

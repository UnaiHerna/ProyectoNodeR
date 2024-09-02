// apiHelper.ts

// Define the types for API parameters and responses
interface ApiParams {
  mltss_sp: number;
  so_aer_sp: number;
  q_int: number;
  tss_eff_sp: number;
  temp: number;
}

interface ApiResponse {
  v_conc_anx: number[];
  v_conc_aer: number[];
  precis: number;
  mltss: number;
  kla_aer: number;
  tss_eff: number;
  sludge_prod: number;
}

interface FetchOptions {
  variable?: string;
  equipo?: string;
  nombre?: string;
  start_date?: string; // Use start_date
  end_date?: string; // Use end_date
  tipo?: "timeseries" | "barchart"; // Default is 'timeseries'
}

interface SensorDataResponse {
  time: string; // Assuming time is in ISO format or a similar string representation
  value: number; // Assuming value is a number
  mode?: number; // Optional field
  consigna?: string; // Optional field
}

interface HeatmapDataResponse {
  id: number;
  temp: number;
  mltss: number;
  sludge_prod: number;
}

// Base URL for API
const BASE_URL = "http://13.51.207.212:8000";

// Build URL with query parameters
const buildUrl = (endpoint: string, params: FetchOptions): string => {
  let url = `${BASE_URL}${endpoint}?`;
  const queryParams: string[] = [];

  if (params.variable)
    queryParams.push(`variable=${encodeURIComponent(params.variable)}`);
  if (params.equipo)
    queryParams.push(`equipo=${encodeURIComponent(params.equipo)}`);
  if (params.nombre)
    queryParams.push(`nombre=${encodeURIComponent(params.nombre)}`);
  if (params.start_date) queryParams.push(`start_date=${params.start_date}`);
  if (params.end_date) queryParams.push(`end_date=${params.end_date}`);
  queryParams.push(`tipo=${encodeURIComponent(params.tipo || "timeseries")}`);

  url += queryParams.join("&");
  console.log("Constructed URL:", url);
  return url;
};

// Fetch data from the API
const fetchData = async <T,>(
  endpoint: string,
  params: FetchOptions
): Promise<T> => {
  const url = buildUrl(endpoint, params);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Define type for data points
interface DataPoint {
  time: string;
  value: number;
  mode?: number; // Optional field
  consigna?: string; // Optional field
}

// Functions to fetch specific types of data
export const fetchNH4Data = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<DataPoint[]> => {
  const data = await fetchData<SensorDataResponse[]>("/datos/sensorvacio/", {
    variable: "NH4",
    equipo: "AER.COMB",
    start_date,
    end_date,
    tipo,
  });

  return data.map(({ time, value }) => ({ time, value }));
};

export const fetchNH4FiltData = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<DataPoint[]> => {
  const data = await fetchData<SensorDataResponse[]>("/datos/senal/", {
    nombre: "nnh4_filt",
    start_date,
    end_date,
    tipo,
  });

  return data.map(({ time, value }) => ({ time, value }));
};

export const fetchDO_SPData = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<DataPoint[]> => {
  const data = await fetchData<SensorDataResponse[]>("/datos/consigna/", {
    nombre: "do_sp",
    start_date,
    end_date,
    tipo,
  });

  return data.map(({ time, value, mode, consigna }) => ({
    time,
    value,
    mode,
    consigna,
  }));
};

export const fetchQinfData = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<DataPoint[]> => {
  const data = await fetchData<SensorDataResponse[]>("/datos/sensorvacio/", {
    variable: "QW",
    equipo: "INF_PIPE.FM",
    start_date,
    end_date,
    tipo,
  });

  return data.map(({ time, value }) => ({ time, value }));
};

export const fetchDOSensData = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<DataPoint[]> => {
  const data = await fetchData<SensorDataResponse[]>("/datos/sensorvacio/", {
    variable: "do",
    equipo: "AER.DO",
    start_date,
    end_date,
    tipo,
  });

  return data.map(({ time, value }) => ({ time, value }));
};

// Function to build the query parameters string for the new API functionality
const buildQueryParams = (params: ApiParams): string => {
  const queryParams = new URLSearchParams({
    mltss_sp: params.mltss_sp.toString(),
    so_aer_sp: params.so_aer_sp.toString(),
    q_int: params.q_int.toString(),
    tss_eff_sp: params.tss_eff_sp.toString(),
    temp: params.temp.toString(),
  });
  return queryParams.toString();
};

// Function to fetch data from the new API functionality
export const fetchApi_R_Data = async (
  params: ApiParams
): Promise<ApiResponse> => {
  const query = buildQueryParams(params);
  const url = `${BASE_URL}/r?${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

// Function to fetch heatmap data
export const fetchHeatmapData = async (): Promise<HeatmapDataResponse[]> => {
  try {
    const response = await fetch(`${BASE_URL}/heatmap`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data: HeatmapDataResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    throw error;
  }
};

// Function to fetch data for a specific consigna
export const fetchNNH4_SPData = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<DataPoint[]> => {
  const data = await fetchData<SensorDataResponse[]>("/datos/consigna/", {
    nombre: "NNH4_SP",
    start_date,
    end_date,
    tipo,
  });

  return data.map(({ time, value }) => ({ time, value }));
};

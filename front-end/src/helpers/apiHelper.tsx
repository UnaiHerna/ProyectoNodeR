// Define the types for API parameters and responses
interface ApiParams {
  mltss_sp: number;
  so_aer_sp: number;
  q_int: number;
  tss_eff_sp: number;
  temp: number;
}

interface HeatmapDayData {
  day: string;
  week: number;
  average_value: number;
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

// Define the type for the response from /datos/consigna/avg_modo
interface NNH4_SPResponse  {
  consigna: string;
  Automatico: string; // Assuming percentage is a string
  Manual: string; // Assuming percentage is a string
}

// Define possible consigna names
type ConsignaName = 'nnh4_sp' | 'do_sp';

// Define the type for the response from /datos/consigna/avg_modo
interface AvgModoEntry {
  avg: number | null; // The average value can be null
  consigna: ConsignaName;
  mode: "MANUAL" | "AUTO";
}

// Define the type for the response array
interface AvgModoResponse {
  data: AvgModoEntry[];
  avg: number | null;
  mode: string | null;
}



// Base URL for API
const BASE_URL = "http://13.61.34.124:8000";

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
  if (params.tipo) queryParams.push(`tipo=${encodeURIComponent(params.tipo || "timeseries")}`);

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
  avg?: number | null,
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
  tipo: "timeseries" | "barchart"
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
export const fetchNh4_SPData = async (
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

// Function to fetch NNH4 SP data for a specific consigna
export const fetchNNH4_SPData = async (
  start_date: string,
  end_date: string,
  tipo: "timeseries" | "barchart" = "timeseries"
): Promise<{ consigna: string; automatico: number; manual: number }> => {
  const data = await fetchData<NNH4_SPResponse>("/datos/consigna/porcentaje", {
    nombre: "NNH4_SP",
    start_date,
    end_date,
    tipo,
  });

  // Convert percentage strings to numbers
  return {
    consigna: data.consigna,
    automatico: parseFloat(data.Automatico.replace('%', '')),
    manual: parseFloat(data.Manual.replace('%', '')),
  };
};

// Function to fetch consigna average mode data
export const fetchConsignaAvgModoData = async (
  nombre: ConsignaName,
  start_date: string,
  end_date: string
): Promise<{ consigna: ConsignaName; automatico: number; manual: number }> => {
  // Fetch data from the API
  const response = await fetchData<AvgModoResponse[]>("/datos/consigna/avg_modo", {
    nombre,
    start_date,
    end_date,
  });

  // Initialize values
  let automatico = 0;
  let manual = 0;

  // console.log(JSON.stringify(response));

  // Process each entry in the response array
  response.forEach(({ avg, mode }) => {
    if (mode === "AUTO" && avg !== null) {
      automatico = avg;
    } else if (mode === "MANUAL" && avg !== null) {
      manual = avg;
    }
  });

  // Return the processed data
  return {
    consigna: nombre,
    automatico,
    manual,
  };
};


// Función para construir la URL para el endpoint de heatmap
const buildHeatmapUrl = (year: string, variable: string, equipo: string): string => {
  return `${BASE_URL}/datos/sensorvacio/heatmap?variable=${encodeURIComponent(variable)}&equipo=${encodeURIComponent(equipo)}&year=${encodeURIComponent(year)}`;
};
// Función para obtener los datos del heatmap para un año específico
export const fetchHeatmapDataForYear = async (
  year: string,
  variable: string,
  equipo: string
): Promise<HeatmapDayData[]> => {
  const url = buildHeatmapUrl(year, variable, equipo);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Obtiene los datos en formato JSON
    const data: HeatmapDayData[] = await response.json();

    // Redondea los valores a enteros
    const roundedData = data.map(item => ({
      ...item,
      average_value: Math.round(item.average_value)
    }));

    return roundedData;
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    throw error;
  }
};
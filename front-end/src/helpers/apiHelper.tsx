// apiHelper.ts

// Define types for better clarity
interface FetchOptions {
  variable?: string;
  equipo?: string;
  nombre?: string;
  start_date?: string; // Use start_date
  end_date?: string; // Use end_date
  tipo?: "timeseries" | "barchart"; // Default is 'timeseries'
}

// Define the type for the API response
interface SensorDataResponse {
  time: string; // Assuming time is in ISO format or a similar string representation
  value: number; // Assuming value is a number
}

// Base URL for API
const BASE_URL = "http://13.60.162.78:8000";

// Build URL with query parameters
const buildUrl = (endpoint: string, params: FetchOptions): string => {
  // Base URL and endpoint
  let url = `${BASE_URL}${endpoint}?`;

  // Create an array to hold query parameter strings
  const queryParams: string[] = [];

  // Append each parameter if it exists
  if (params.variable) queryParams.push(`variable=${encodeURIComponent(params.variable)}`);
  if (params.equipo) queryParams.push(`equipo=${encodeURIComponent(params.equipo)}`);
  if (params.nombre) queryParams.push(`nombre=${encodeURIComponent(params.nombre)}`);
  if (params.start_date) queryParams.push(`start_date=${params.start_date}`);
  if (params.end_date) queryParams.push(`end_date=${params.end_date}`);
  queryParams.push(`tipo=${encodeURIComponent(params.tipo || 'timeseries')}`); // Default to 'timeseries' if tipo is not specified

  // Join all query parameters with '&'
  url += queryParams.join('&');

  // Log the constructed URL for debugging
  console.log("Constructed URL:", params.start_date, url);

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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Define type for data points
interface DataPoint {
  time: string; // Assuming time is in ISO format or a similar string representation
  value: number; // Assuming value is a number
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

  return data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
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

  return data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
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

  return data.map((item) => ({
    time: item.time,
    value: item.value,
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

  return data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
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

  return data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
};

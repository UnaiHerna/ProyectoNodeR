// apiHelper.ts
interface FetchOptions {
    variable?: string;
    equipo?: string;
    nombre?: string;
    startDate?: string;
    endDate?: string;
  }
  
  const BASE_URL = "http://16.171.35.71:8000";
  
  const buildUrl = (endpoint: string, params: FetchOptions): string => {
    const queryParams = new URLSearchParams({
      ...params,
      tipo: 'timeseries'
    }).toString();
    return `${BASE_URL}${endpoint}?${queryParams}`;
  };
  
  const fetchData = async (endpoint: string, params: FetchOptions) => {
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
      throw error;
    }
  };
  
  // Functions to fetch different types of data
  export const fetchNH4Data = async (startDate: string, endDate: string) => {
    return await fetchData('/datos/sensorvacio/', { variable: 'NH4', equipo: 'AER.COMB', startDate, endDate });
  };
  
  export const fetchNH4FiltData = async (startDate: string, endDate: string) => {
    return await fetchData('/datos/senal/', { nombre: 'nnh4_filt', startDate, endDate });
  };
  
  export const fetchDO_SPData = async (startDate: string, endDate: string) => {
    return await fetchData('/datos/consigna/', { nombre: 'do_sp', startDate, endDate });
  };
  
  export const fetchQinfData = async (startDate: string, endDate: string) => {
    return await fetchData('/datos/sensorvacio/', { variable: 'QW', equipo: 'INF_PIPE.FM', startDate, endDate });
  };
  
  export const fetchDOSensData = async (startDate: string, endDate: string) => {
    return await fetchData('/datos/sensorvacio/', { variable: 'do', equipo: 'AER.DO', startDate, endDate });
  };
  
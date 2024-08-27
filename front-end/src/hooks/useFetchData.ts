// src/hooks/useFetchData.ts

import { useState, useEffect } from 'react';

interface ApiData {
  // Define aquí los campos específicos de tus datos
  field1: string;
  field2: number;
}

const useFetchData = (params: { [key: string]: string }, shouldFetch: boolean) => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (shouldFetch) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // const queryString = new URLSearchParams(params).toString();
          const response = await fetch(`http://localhost:1234/r`);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const result: ApiData = await response.json();
          setData(result);
          console.log('Fetched data:', result); // Imprime los datos en la consola
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [params, shouldFetch]);

  return { data, loading };
};

export default useFetchData;

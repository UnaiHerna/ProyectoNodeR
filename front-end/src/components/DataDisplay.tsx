import React, { useState, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData'; // Asegúrate de que este hook esté correctamente importado

const DataDisplay: React.FC = () => {
  // Estado para los datos de la API
  const { data, loading, error } = useFetchData();

  // Estado para los datos de entrada
  const [vConcAnx, setVConcAnx] = useState<number[]>([]);
  const [vConcAer, setVConcAer] = useState<number[]>([]);
  const [inputAnx, setInputAnx] = useState<string>('');
  const [inputAer, setInputAer] = useState<string>('');

  // Función para manejar el cambio en los campos de entrada
  const handleAnxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAnx(event.target.value);
  };

  const handleAerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAer(event.target.value);
  };

  // Función para actualizar los valores de v_conc_anx y v_conc_aer
  const updateData = () => {
    const anxValues = inputAnx.split(',').map(value => parseFloat(value.trim()));
    const aerValues = inputAer.split(',').map(value => parseFloat(value.trim()));

    setVConcAnx(anxValues);
    setVConcAer(aerValues);
  };

  // Carga los datos automáticamente cuando `data` esté disponible
  useEffect(() => {
    if (data) {
      setInputAnx(data.v_conc_anx.join(', ') || '');
      setInputAer(data.v_conc_aer.join(', ') || '');
      setVConcAnx(data.v_conc_anx || []);
      setVConcAer(data.v_conc_aer || []);
    }
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="p-4 bg-gray-100 rounded shadow">
        <h1 className="text-xl font-bold mb-2">Ingreso de Datos</h1>
        <div className="mb-4">
          <label className="block mb-2">
            v_conc_anx (separado por comas):
            <input
              type="text"
              value={inputAnx}
              onChange={handleAnxChange}
              placeholder="198.5036, 35.2, ..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            v_conc_aer (separado por comas):
            <input
              type="text"
              value={inputAer}
              onChange={handleAerChange}
              placeholder="197.7297, 35.2, ..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <button
          onClick={updateData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Actualizar Datos
        </button>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Datos Ingresados</h2>
          <div className="mb-2">
            <h3 className="font-medium">v_conc_anx</h3>
            <p>{vConcAnx.join(', ') || 'No data entered'}</p>
          </div>
          <div>
            <h3 className="font-medium">v_conc_aer</h3>
            <p>{vConcAer.join(', ') || 'No data entered'}</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-100 rounded shadow">
        <h1 className="text-xl font-bold mb-2">Datos de la API</h1>
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">v_conc_anx</h2>
          <p>{data?.v_conc_anx.join(', ') || 'No data available'}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">v_conc_aer</h2>
          <p>{data?.v_conc_aer.join(', ') || 'No data available'}</p>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;

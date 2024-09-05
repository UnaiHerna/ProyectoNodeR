import React, { useEffect, useState } from 'react';
import { fetchApi_R_Data } from '../helpers/apiHelper'; 
import './App.css'; // Asegúrate de que la ruta sea correcta

// Define el tipo esperado para los datos
interface ApiResponse {
  v_conc_anx: number[];
  v_conc_aer: number[];
  precis: number;
  mltss: number;
  kla_aer: number;
  tss_eff: number;
  sludge_prod: number;
}

const DataDisplay: React.FC = () => {
  const [inputMltssSp, setInputMltssSp] = useState<string>('');
  const [inputSoAerSp, setInputSoAerSp] = useState<string>('');
  const [inputQInt, setInputQInt] = useState<string>('');
  const [inputTssEffSp, setInputTssEffSp] = useState<string>('');
  const [inputTemp, setInputTemp] = useState<string>('');
  
  const [data, setData] = useState<ApiResponse | null>(null);  // Estado para almacenar los datos de la API
  const [loading, setLoading] = useState<boolean>(false); // Estado para manejar la carga de datos
  const [shouldFetch, setShouldFetch] = useState<boolean>(false); // Control para la actualización de datos

  // Parámetros para la llamada a la API
  const params = {
    mltss_sp: parseFloat(inputMltssSp) || 0,
    so_aer_sp: parseFloat(inputSoAerSp) || 0,
    q_int: parseFloat(inputQInt) || 0,
    tss_eff_sp: parseFloat(inputTssEffSp) || 0,
    temp: parseFloat(inputTemp) || 0,
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  // Llamada a la API
  const fetchData = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const apiData = await fetchApi_R_Data(params); // Llama a la función del helper
      setData(apiData); // Almacena los datos obtenidos
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  // Actualiza los datos cuando shouldFetch cambia
  useEffect(() => {
    if (shouldFetch) {
      fetchData(); // Llama a la API cuando shouldFetch sea verdadero
      setShouldFetch(false); // Resetea shouldFetch
    }
  }, [shouldFetch]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-screen mt-[-1rem]">
        <div className="p-4 custom-background overflow-auto h-full">
          <h1 className="text-xl font-bold mb-2">Ingreso de Datos</h1>
          <div className="mb-4">
            <label className="block mb-2">
              mltss_sp:
              <input
                type="text"
                value={inputMltssSp}
                onChange={handleInputChange(setInputMltssSp)}
                placeholder="2500 - 4000"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              so_aer_sp:
              <input
                type="text"
                value={inputSoAerSp}
                onChange={handleInputChange(setInputSoAerSp)}
                placeholder="0.5 - 3.5"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              q_int:
              <input
                type="text"
                value={inputQInt}
                onChange={handleInputChange(setInputQInt)}
                placeholder="20648 - 100000"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              tss_eff_sp:
              <input
                type="text"
                value={inputTssEffSp}
                onChange={handleInputChange(setInputTssEffSp)}
                placeholder="0 - 20"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              temp:
              <input
                type="text"
                value={inputTemp}
                onChange={handleInputChange(setInputTemp)}
                placeholder="13 - 25"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
          </div>

          <button
            onClick={() => setShouldFetch(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Actualizar Datos
          </button>
        </div>

        {/* Datos de la API */}
        <div className="p-4 custom-background overflow-auto h-full">
          <h2 className="text-lg font-bold mb-2">Respuesta de R Api</h2>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : data ? (
            <div className="flex flex-wrap gap-2">
              <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex-1 min-w-[200px]">
                <p><strong>v_conc_anx:</strong></p>
                <ul className="list-disc ml-5">
                  {data.v_conc_anx.map((value, index) => (
                    <li key={index} className="text-gray-700">{value.toFixed(4)}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex-1 min-w-[200px]">
                <p><strong>v_conc_aer:</strong></p>
                <ul className="list-disc ml-5">
                  {data.v_conc_aer.map((value, index) => (
                    <li key={index} className="text-gray-700">{value.toFixed(4)}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex-1 min-w-[200px]">
                <p><strong>precis:</strong> {data.precis.toExponential(2)}</p>
                <p><strong>mltss:</strong> {data.mltss}</p>
                <p><strong>kla_aer:</strong> {data.kla_aer.toFixed(4)}</p>
                <p><strong>tss_eff:</strong> {data.tss_eff}</p>
                <p><strong>sludge_prod:</strong> {data.sludge_prod.toFixed(4)}</p>
              </div>
            </div>
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DataDisplay;

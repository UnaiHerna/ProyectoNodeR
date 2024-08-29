import React, { useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import './App.css'; // Asegúrate de que la ruta sea correcta
import SidebarAndNavbar from '../pages/Home/Home_components/Navbar';
import { useParams } from 'react-router-dom';

const DataDisplay: React.FC = () => {
  const [inputMltssSp, setInputMltssSp] = useState<string>('');
  const [inputSoAerSp, setInputSoAerSp] = useState<string>('');
  const [inputQInt, setInputQInt] = useState<string>('');
  const [inputTssEffSp, setInputTssEffSp] = useState<string>('');
  const [inputTemp, setInputTemp] = useState<string>('');
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  
  const { title } = useParams<{ title: string }>();

  const params = {
    mltss_sp: inputMltssSp,
    so_aer_sp: inputSoAerSp,
    q_int: inputQInt,
    tss_eff_sp: inputTssEffSp,
    temp: inputTemp
  };

  const { data, loading } = useFetchData(params, shouldFetch);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  const updateData = () => {
    setShouldFetch(true);
  };

  // Resetea shouldFetch para evitar solicitudes adicionales
  useEffect(() => {
    if (shouldFetch) {
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  return (
    <>
    <SidebarAndNavbar title={title}/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-screen">
      {/* Ingreso de Datos */}
      <div className="p-4 custom-background overflow-auto h-full">
        <h1 className="text-xl font-bold mb-2">Ingreso de Datos</h1>

        <div className="mb-4">
          <label className="block mb-2">
            mltss_sp:
            <input
              type="text"
              value={inputMltssSp}
              onChange={handleInputChange(setInputMltssSp)}
              placeholder="3000"
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
              placeholder="229.7024"
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
              placeholder="100"
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
              placeholder="10"
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
              placeholder="25"
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
      </div>

      {/* Datos de la API */}
      <div className="p-4 custom-background overflow-auto h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>
    </div>
  </>
  );
};

export default DataDisplay;

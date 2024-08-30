import React, { useEffect, useState } from "react";
import { fetchDO_SPData, fetchNH4FiltData } from "../../../helpers/apiHelper";

// Define una interfaz TypeScript para la respuesta de la API
interface ApiResponseItem {
  time: string;
  value: number;
  mode: number;
  consigna: string;
}

interface ModeComponentProps {
  nombre: string;
}

const ModeComponent: React.FC<ModeComponentProps> = ({ nombre }) => {
  const [displayValue, setDisplayValue] = useState<string>("");  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstado = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        let data: ApiResponseItem[] = [];

        if (nombre === "DO_SP") {
          data = await fetchDO_SPData(currentDate, currentDate);
        } else if (nombre === "NNH4_SP") {
          data = await fetchNH4FiltData(currentDate, currentDate);
        } else {
          setDisplayValue("No data available");
          return;
        }

        if (data.length > 0) {
          const firstItem = data[0];

          if (nombre === "DO_SP") {
            const modo = firstItem.mode === 1 ? "AUTO" : "MANUAL";
            setDisplayValue(modo);
          } else if (nombre === "NNH4_SP") {
            setDisplayValue(firstItem.value.toString());
          }
        } else {
          setDisplayValue("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setDisplayValue("");
      } finally {
        setLoading(false);
      }
    };

    fetchEstado();
  }, [nombre]);

  // Muestra un mensaje de carga si aún está esperando datos
  if (loading) {
    return (
      <div className="bg-white shadow-sm text-center rounded-lg border border-gray-200 w-[293px] h-[87px]">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Loading...</h2>
        <div className="sp-mode text-3xl font-semibold text-center text-blue-600">...</div>
      </div>
    );
  }

  // Muestra un mensaje de error si hubo problemas al cargar los datos
  if (error) {
    return (
      <div className="bg-white shadow-sm text-center rounded-lg border border-gray-200 w-[293px] h-[87px]">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Error</h2>
        <div className="sp-mode text-3xl font-semibold text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Renderiza el valor si todo está correcto
  return (
    <div className="bg-white shadow-sm text-center rounded-lg border border-gray-200 w-[293px] h-[87px]">
      <h2 className="text-lg font-bold mb-2 text-gray-800">
        {nombre === "DO_SP" ? "DO SP MODE" : "NNH4 SP VALUE"}
      </h2>
      <div className="sp-mode text-3xl font-semibold text-center text-blue-600">
        {displayValue}
      </div>
    </div>
  );
};

export default ModeComponent;

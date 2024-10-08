import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import {
  fetchDO_SPData,
  fetchNH4FiltData,
  fetchNH4Data,
  fetchQinfData,
  fetchDOSensData
} from "../../helpers/apiHelper";

// Tipos de datos de los puntos del gráfico
interface DataPoint {
  time: string | number;  // El tiempo puede ser string o Unix timestamp
  value: number;
}

// Configuración para los gráficos de línea y barra
interface ChartData {
  name: string;
  data: number[];
  type: 'line' | 'bar';
  smooth?: boolean;
  yAxisIndex?: number;
}

// Configuración para gráficos de pastel
interface PieData {
  name: string;
  value: number;
}

// Configuración para el dataset
interface DatasetDimension {
  product: string;
  [key: string]: number | string;
}

// Propiedades del componente
interface ChartProps {
  variables: string[]; // Variables a graficar
  startDate: string; // Fecha de inicio
  endDate: string; // Fecha final
  chartType: 'line' | 'bar' | 'pie'; // Tipo de gráfico
  zoomEnabled: boolean; // Si el zoom está habilitado o no
  yAxisLeft: string[]; // Variables asignadas al eje Y izquierdo
  yAxisRight?: string[]; // Variables asignadas al eje Y derecho (opcional)
  useDataset?: boolean; // Opción para usar dataset en lugar de series
}

// Cambiado para que `chartType` no sea `undefined`
type FetchFunction = (startDate: string, endDate: string, chartType: 'timeseries' | 'barchart') => Promise<DataPoint[]>;

const GeneralChartComponent: React.FC<ChartProps> = ({
  variables,
  startDate,
  endDate,
  chartType,
  zoomEnabled,
  yAxisLeft,
  yAxisRight = [], // Default to empty array if not provided
  useDataset = false
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [datasetSource, setDatasetSource] = useState<DatasetDimension[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);

  const fetchFunctions: Record<string, FetchFunction> = {
    NH4: fetchNH4Data,
    'NH4_FILT': fetchNH4FiltData,
    'DO_SP': fetchDO_SPData,
    QW: fetchQinfData,
    'DO': fetchDOSensData
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  useEffect(() => {
    const fetchDataForChart = async () => {
      try {
        const allData: ChartData[] = [];
        const dataset: DatasetDimension[] = [];
        const pieDataList: PieData[] = [];

        const fetchPromises = variables.map(async (variable) => {
          const fetchFunction = fetchFunctions[variable];
          if (fetchFunction) {
            const convertedChartType = chartType === 'line' ? 'timeseries' : 'barchart';

            const data = await fetchFunction(startDate, endDate, convertedChartType);
            if (data.length > 0) {
              if (useDataset) {
                dataset.push({
                  product: variable,
                  ...data.reduce<Record<string, number>>((acc, item) => {
                    acc[formatTimestamp(item.time as number)] = item.value;
                    return acc;
                  }, {}),
                });
              } else {
                if (chartType === 'pie') {
                  pieDataList.push({
                    name: variable,
                    value: data.reduce<number>((acc, item) => acc + item.value, 0),
                  });
                } else {
                  allData.push({
                    name: variable,
                    data: data.map((item) => item.value),
                    type: chartType,
                    smooth: chartType === 'line' ? false : undefined,
                    yAxisIndex: yAxisLeft.includes(variable) ? 0 : (yAxisRight.includes(variable) ? 1 : 0),
                  });

                  // Actualiza las categorías con los timestamps formateados
                  setCategories((prevCategories) => {
                    if (prevCategories.length === 0) {
                      return data.map((item) => formatTimestamp(item.time as number));
                    }
                    return prevCategories;
                  });
                }
              }
            }
          }
        });

        await Promise.all(fetchPromises);

        if (useDataset) {
          setDatasetSource(dataset);
        } else if (chartType === 'pie') {
          setPieData(pieDataList);
        } else {
          setChartData(allData);
        }
      } catch (error) {
        console.error("Error fetching data for chart:", error);
      }
    };

    fetchDataForChart();
  }, [startDate, endDate, chartType, variables, useDataset, yAxisLeft, yAxisRight]);

  const getOption = () => {
    const baseLegend = {
      bottom: '0%',
      top: "5%",
      left: 'center',
    };

    if (chartType === 'pie') {
      return {
        tooltip: {
          trigger: 'item',
        },
        legend: baseLegend,
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: pieData,
          },
        ],
      };
    }

    if (useDataset) {
      return {
        legend: baseLegend,
        tooltip: {},
        dataset: {
          dimensions: ['product', ...categories],
          source: datasetSource,
        },
        xAxis: { type: 'category' },
        yAxis: [
          { type: 'value', name: 'Axis Left', position: 'left' },
          { type: 'value', name: 'Axis Right', position: 'right' },
        ],
        series: Array(categories.length).fill({ type: chartType as 'line' | 'bar' }),
      };
    }

    return {
      xAxis: {
        type: 'category',
        data: categories, // Asegurarse de que las categorías están actualizadas
      },
      yAxis: [
        { type: 'value', name: 'Axis Left', scale: true, position: 'left' },
        ...(yAxisRight.length > 0 ? [{ type: 'value', name: 'Axis Right', scale: true, position: 'right' }] : []),
      ],
      dataZoom: zoomEnabled ? [{ type: 'inside' }, { type: 'slider' }] : [],
      series: chartData,
      tooltip: {
        trigger: 'axis',
      },
      legend: baseLegend,
    };
  };

  return (
    <ReactEcharts key={categories.join(',')} option={getOption()} style={{ height: '100%', width: '100%' }} />
  );
};

export default GeneralChartComponent;

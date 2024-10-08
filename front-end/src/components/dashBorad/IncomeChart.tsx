import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const LineChart: React.FC = () => {
  useEffect(() => {
    // Initialize chart on component mount
    const chartDom = document.getElementById('line-chart') as HTMLElement;
    const myChart = echarts.init(chartDom);

    // Chart configuration
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    };

    // Set the option for the chart
    myChart.setOption(option);

    // Clean up the chart instance on unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="line-chart" style={{ width: '100%', height: '400px' }} />;
};

export default LineChart;

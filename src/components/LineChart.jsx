import { Line } from 'react-chartjs-2';

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const LineChart = ({ datasetData, displayValue, displayLabel }) => {
  let data;

  if (datasetData) {
    const displayValueColumnIndex = datasetData.column_names.indexOf(displayValue);
    const displayLabelColumnIndex = datasetData.column_names.indexOf(displayLabel);
    const labels = [];
    const chartData = [];

    datasetData.data.forEach((slot) => {
      labels.push(slot[displayLabelColumnIndex]);
      chartData.push(slot[displayValueColumnIndex]);
    });

    data = {
      labels: labels.reverse(),
      datasets: [{
        data: chartData.reverse(),
      }],
    };
  }

  return (
    <>
      {
        data ? <Line options={options} data={data} /> : <p>No data to be rendered!</p>
      }
    </>
  );
};

export default  LineChart;

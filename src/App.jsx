import { useEffect, useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate';
import LineChart from './components/LineChart.jsx';
import { getDatasets, getTimeSeries } from './api.service.js';

const App = () => {
  const [selectedDateset, setSelectedDateset] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const buildDatasetLabel = (item) => `${item.dataset_code} - ${item.name}`;
  const buildDatasetValue = (item) => item.id;

  useEffect(() => {
    if (selectedDateset) {
      fetchTimeSeries(selectedDateset.database_code, selectedDateset.dataset_code)
    }
  }, [selectedDateset]);

  const fetchDatasets = async (_search, loadedOptions, { page }) => {
    const { data: options, meta } = await getDatasets(page);

    return {
      options,
      hasMore: !!meta?.next_page,
      additional: {
        page: page + 1,
      },
    };
  };

  const fetchTimeSeries = async (databaseCode, datasetCode) => {
    const timeSeries = await getTimeSeries(databaseCode, datasetCode);

    setTimeSeries(timeSeries);
  };

  return (
    <>
      <AsyncPaginate getOptionLabel={buildDatasetLabel}
                     getOptionValue={buildDatasetValue}
                     value={selectedDateset}
                     loadOptions={fetchDatasets}
                     additional={{ page: 1 }}
                     onChange={setSelectedDateset}
                     placeholder="Select a dataset..."
                     noOptionsMessage={() => 'There are no datasets to be displayed!'}
                     isSearchable={false}
      />

      <LineChart datasetData={timeSeries} displayValue="Close" displayLabel="Date" />
    </>
  );
};

export default App;

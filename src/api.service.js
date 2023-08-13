import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const DATABASE_CODE = import.meta.env.VITE_DATABASE_CODE;
const VITE_RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const VITE_RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST;
const isCORSEnabled = JSON.parse(localStorage.getItem('isCORSEnabled') ?? null);

export const getDatasets = async (page) => {
  try {
    const response = await axios.request(getRequestOptions(`${API_URL}/datasets/?api_key=${API_KEY}&database_code=${DATABASE_CODE}&current_page=${page}`));
    const { datasets, meta } = isCORSEnabled ? response.data : JSON.parse(response.data?.website);

    return {
      data: datasets,
      meta,
    };
  } catch (e) {
    handleError(e);

    return { data: [] };
  }
};

export const getTimeSeries = async (databaseCode, datasetCode) => {
  try {
    const response = await axios.request(getRequestOptions(`${API_URL}/datasets/${databaseCode}/${datasetCode}/data.json?api_key=${API_KEY}`));
    const { dataset_data } = isCORSEnabled ? response.data : JSON.parse(response.data?.website);

    return dataset_data;
  } catch (e) {
    handleError(e);

    return null;
  }
};

const getRequestOptions = (url) => {
  return {
    method: 'GET',
    url: isCORSEnabled ? url : `https://${VITE_RAPID_API_HOST}/proxy`,
    headers: isCORSEnabled
      ? { 'Accept': 'application/json' }
      : {
        'X-RapidAPI-Key': VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': VITE_RAPID_API_HOST,
      },
    params: isCORSEnabled ? null : { url },
  };
};

const handleError = (error) => {
  const message = error?.response?.data?.message ?? error.message;

  window.alert(message);
};

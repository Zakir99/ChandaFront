// src/hooks/useFetchData.js
import { useState, useEffect } from "react";
import axios from "axios";
import Config from "../Js/Config";


const useFetchData = ({ url, onSuccess, onError }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const starUrl = Config.apiUrl;
  const config = Config.getConfig();
  const completeUrl = starUrl + url;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(completeUrl, config);

      const result = response.data;

      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message;

      setError(message);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
// src/hooks/useDelete.js
import { useState } from "react";
import axios from "axios";
import Config from "../Js/Config";

const useDelete = ({ url, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const config = Config.getConfig();
  const starturl = Config.apiUrl;
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.delete(`${starturl}${url}/${id}`, config);

      const result = response.data;

      setSuccess(true);

      if (onSuccess) onSuccess(result);

      return result;

    } catch (err) {
      const message = err.response?.data?.message || err.message;

      setError(message);

      if (onError) onError(err);

      throw err;

    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error, success };
};

export default useDelete;
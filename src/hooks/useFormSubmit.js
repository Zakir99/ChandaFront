import { useState } from "react";
import axios from "axios";
import Config from "../Js/Config";

const useFormSubmit = ({ url, method = "POST", onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const startUrl = Config.apiUrl;
    const completeUrl = startUrl + url;
    const config = Config.getConfig();

    const submit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const requestConfig = { ...config };

            if (data instanceof FormData) {
                delete requestConfig.headers?.["Content-Type"];
            }

            let response;
            if (method === "POST") {
                response = await axios.post(completeUrl, data, requestConfig);
            } else if (method === "PUT") {
                response = await axios.put(completeUrl, data, requestConfig);
            } else if (method === "PATCH") {
                response = await axios.patch(completeUrl, data, requestConfig);
            } else {
                throw new Error(`Unsupported method: ${method}`);
            }

            const result = response.data;

            setSuccess(true);
            onSuccess?.(result);

            return result;

        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setError(message);
            onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error, success };
};

export default useFormSubmit;
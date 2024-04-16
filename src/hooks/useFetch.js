import {useCallback, useEffect, useState} from "react";
import {makeRequest} from "../makeRequest";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await makeRequest.get(url);
            setData(res.data.data);
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {data: data ? data[0] : data, loading, error};
};

export default useFetch;
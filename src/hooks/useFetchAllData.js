import {useCallback, useEffect, useState} from "react";
import {makeRequest} from "./makeRequest";

const useFetchAllData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await makeRequest.get(url);
            setData(res.data.data);
            return res.data.data; // Return the fetched data
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [url]);

    const refetch = useCallback(() => {
        return fetchData(); // Return the promise from fetchData
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {data, loading, error, refetch};
};

export default useFetchAllData;

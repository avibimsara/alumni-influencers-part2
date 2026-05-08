import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const useAnalytics = (endpoint, filters = {}) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Don't fetch if no endpoint provided
    if (!endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Strip empty filter values before sending
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        );

        const res = await api.get(endpoint, { params: cleanFilters });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(filters), retryCount]); // re-fetches when filters change

  return { data, loading, error };
};

export default useAnalytics;
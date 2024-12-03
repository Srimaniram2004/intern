import { useState, useEffect } from 'react';

const useKural = () => {
  const [dailyKural, setDailyKural] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKural = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/kural/daily-kural');
        if (!response.ok) {
          throw new Error('Failed to fetch daily Kural');
        }
        const data = await response.json();
        setDailyKural(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKural();
  }, []);

  return { dailyKural, loading, error };
};

export default useKural;

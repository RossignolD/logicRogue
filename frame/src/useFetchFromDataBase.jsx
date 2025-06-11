import { useState, useEffect } from "react";

function useFetch({ url, method = "GET", body = {} }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    body.playerId = "a422ea59-9549-4ef8-bb13-6cda3538a7f3";
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
        });
        setLoading(false);

        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch {
        setLoading(false);
        setError("An error occurred. Awkward..");
      }
    };

    fetchData();
  }, [url, method, JSON.stringify(body)]);

  return { data, loading, error };
}

export default useFetch;

import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

export function useProperties(filters) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api
      .listProperties(filters)
      .then((data) => {
        if (active) setProperties(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), version]);

  return { properties, loading, error, refetch };
}

export function useMeta() {
  const [meta, setMeta] = useState({ locations: [], types: [] });

  useEffect(() => {
    let active = true;
    api
      .getMeta()
      .then((data) => {
        if (active) setMeta(data);
      })
      .catch(() => {
        /* filter chips simply stay empty if this fails */
      });
    return () => {
      active = false;
    };
  }, []);

  return meta;
}

export function useStats(version = 0) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .getStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {
        /* the hero strip just hides numbers if this fails */
      });
    return () => {
      active = false;
    };
  }, [version]);

  return stats;
}

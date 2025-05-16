import React, { useEffect, useState, useRef } from "react";

/**
 * this is a simple caching and fetching component
 * I've used to use as a base for an INDEXDB module implementation
 */
const API = "https://rickandmortyapi.com/api/";
const ABORT_SIGNAL_ERR = "AbortError";

/*-------------------caching----------------------------*/
// this can be a redux/context api/indexedDB/local storage
const cachedData = new Map<string, string>();

const getCachedData = (country: string) => {
  if (cachedData.has(country)) {
    return cachedData.get(country);
  }
  return null;
};

const setCahcedData = (country: string, data: string) => {
  cachedData.set(country, data);
};
/*-------------------caching----------------------------*/

const fetchData = async (country: string, signal: AbortSignal) => {
  try {
    const url = `${API}${country}`;

    const response = await fetch(url, {
      signal: signal,
    });
    const result = await response.text();
    return result;
  } catch (err: any) {
    if (err.name !== ABORT_SIGNAL_ERR) {
      console.log(err);
    } else {
      console.log("canceled");
    }
    return "";
  }
};

const loadData = async (
  country: string,
  signal: AbortSignal,
  setDataLoaded: React.Dispatch<React.SetStateAction<string>>
) => {
  const cached = getCachedData(country);

  if (cached) {
    console.log("cachedData retrieved");
    return cached;
  }

  const result = await fetchData(country, signal);
  setDataLoaded(result);

  setCahcedData(country, result);
};

const ExternalRestCaching = () => {
  const [country, setCountry] = useState("");
  const [dataLoaded, setDataLoaded] = useState("");
  const abortController = useRef<null | AbortController>(null);

  useEffect(() => {
    if (abortController.current !== null) {
      abortController.current.abort();
    }

    // usecallback on this is futile.
    // putting in useEfffect will create a new function everytime country is changed.
    // The same will happen in the useCallback as well
    // const getData = async () => {
    //   try {
    //     const url = `https://rickandmortyapi.com/api/${country}`;

    //     const response = await fetch(url, {
    //       signal: abortController.current?.signal,
    //     });
    //     const result = await response.text();
    //     setDataLoaded(result);
    //   } catch (err: any) {
    //     if (err.name !== "AbortError") {
    //       console.log(err);
    //     } else {
    //       console.log("candceled");
    //     }
    //   }
    // };

    if (country !== "") {
      abortController.current = new AbortController();
      loadData(country, abortController.current.signal, setDataLoaded);
    } else {
      setDataLoaded("");
    }

    return () => {
      if (abortController.current !== null) {
        abortController.current.abort();
      }
    };
  }, [country]);

  return (
    <div>
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="">SELECT</option>
        <option value="episode">episode</option>
        <option value="location">location</option>
        <option value="character">character</option>
      </select>
      <pre>
        <code>{dataLoaded}</code>
      </pre>
    </div>
  );
};

export default ExternalRestCaching;

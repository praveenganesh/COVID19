import { useState, useEffect } from "react";
import axios from "axios";

export default function useCasesBiz(props) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [country, setCountry] = useState("India");
  const [type, setType] = useState(0);
  useEffect(() => {
    getCases();
    getCountries();
  }, []);
  useEffect(() => {
    document.getElementById("multi-bar").innerHTML = "";
    document.getElementById("pie").innerHTML = "";
    country && getCases();
  }, [country]);

  const PROXY_SERVER = "https://cors-anywhere.herokuapp.com/";
  const header = { "x-requested-with": true };

  const getCases = async () => {
    let url = `${PROXY_SERVER}https://api.covid19api.com/dayone/country/${country}`;
    setLoading(true);

    axios
      .get(url, header)
      .then((result) => {
        if (result.status === 200 || result.status === 304) {
          result.data.sort((a, b) => {
            return new Date(a) - new Date(b);
          });
          setLoading(false);
          setDateIndex(result.data.length - 1);
          setCases(result.data);
        }
      })
      .catch((e) => {
        setLoading(false);
        alert("unable to fetch data, try again later");
      });
  };

  const getCountries = async () => {
    let url = `${PROXY_SERVER}https://api.covid19api.com/countries`;
    let result = await axios.get(url, header);
    if (result.status === 200 || result.status === 304) {
      setCountries(result.data);
    } else {
      alert("unable to fetch countries, try again later");
    }
  };

  return {
    cases,
    setCases,
    getCases,
    loading,
    countries,
    setCountry,
    country,
    dateIndex,
    setDateIndex,
    type,
    setType,
  };
}

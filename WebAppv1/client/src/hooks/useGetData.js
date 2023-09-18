import { useEffect, useState } from "react";

export const useGetData = (element, user) => {
  const authString = "Bearer " + user.token;
  const urlString = 'http://localhost:4000/info/' + element;
  const [data, setData] = useState(null);
  useEffect(()=>{
    const getData = async () => {

        const response = await fetch(urlString, {
        headers: {
            Authorization: authString,
        },
        method: "GET",
        });

        const json = await response.json();

        if (response.ok) {
        setData(json);
        } else {
        throw new Error("Could not get data!");
        }
      };
    getData()
  },[element])
  return data; 
};

export const useGetCurrencies = () => {
  const urlString = "http://api.exchangeratesapi.io/v1/latest?access_key=1f474f5a3093fc1f969ccb9574e81d82"
  const [data, setData] = useState(null);
  useEffect(()=>{
    const getData = async () => {

        const response = await fetch(urlString, {
        method: "GET",
        });

        const json = await response.json();

        if (response.ok) {
        setData(json);
        } else {
        throw new Error("Could not get data!");
        }
      };
    getData()
  },[])
  return data; 
};


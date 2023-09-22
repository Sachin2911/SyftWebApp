import React, { useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ChatBot from '../components/ChatBot'
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import * as IoIcons from 'react-icons/io';
import { useGetData } from '../hooks/useGetData';
import { useAuthContext } from '../hooks/useAuthContext';
import { Line, CartesianGrid, Scatter, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { List } from '@mui/material';

function Kpi() {
  const [indicator, setIndicator] = useState(null)
  const [product, setProduct] = useState(null)
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [chartData, setChartData] = useState([]);
  const { user } = useAuthContext()
  const contacts = useGetData("item", user)
  const [chartKey, setChartKey] = useState(0);
  const [resampleRate, setResampleRate] = useState('day');
  const [predictionMade, setPredictionMade] = useState(false);
  const [multichart, setMultiChart] = useState()


  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function transformData(data) {
    // Create a map to store combined data
    const combinedDataMap = new Map();


    // Loop through each dataset
    data.forEach((dataset, idx) => {
        dataset.forEach((element, ind)=>{
          element.forEach((point, inder)=>{
            const date = point.issue_date;
            const value = point.value;
            
            // Check if this date is already in the map
            if (!combinedDataMap.has(date)) {
                combinedDataMap.set(date, { issue_date: date });
            }
            
            // Add the value to the right property (e.g., value1, value2)
            combinedDataMap.get(date)[`value${idx + 1}`] = value;
          })
        })
    });
    

    const result = [...combinedDataMap.values()];

    // Fill in missing values with 0
    result.forEach(item => {
        for (let i = 1; i <= data.length; i++) {
            if (!item.hasOwnProperty(`value${i}`)) {
                item[`value${i}`] = 0;
            }
        }
    });
    return result;
}

  const getPrediction = async() =>{
    try{
      const url = 'http://localhost:5000/api/predict'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: chartData }),
      });
      const data = await response.json();
      console.log(chartData)
    const latestDate = chartData[0][0].reduce((latest, curr) => {
      const currDate = new Date(curr.issue_date);
      
      return currDate > latest ? currDate : latest;
    }, new Date(chartData[0][0][0].issue_date));
    const nextMonthDate = dayjs(latestDate).add(1, 'month').format('MM-DD-YYYY'); 

    // Add ARIMA prediction
    const arimaDataPoint = {
        issue_date: nextMonthDate,
        value: data.arima[0],
        type: 'prediction'
    };

    // Add LSTM prediction
    const lstmDataPoint = {
        issue_date: nextMonthDate,
        value: data.lstm,
        type: 'prediction'
    };

    // Append new prediction points to chartData[0]
    console.log(chartData);

    setChartData(prevData => [[[...prevData[0][0], arimaDataPoint, lstmDataPoint]]]);
    console.log(arimaDataPoint);
    console.log(lstmDataPoint);
    console.log(chartData);
    setPredictionMade(true);
    }catch (error) {
      console.error('Error:', error);
    }
  }

  const getGraph = async() =>{
    if(indicator && product && selectedDateStart && selectedDateEnd){
      const query = indicator + "," + product + "," + selectedDateStart + "," + selectedDateEnd
      

      try{
        const url = 'http://localhost:5000/api/model'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_input: query }),
        });
    
        // Parse the JSON response
        const data = await response.json();
        const parsedDbInfo = JSON.parse(data.response);
        const formattedData = Object.keys(parsedDbInfo.issue_date).map((key) => ({
          issue_date: new Date(parsedDbInfo.issue_date[key]).toLocaleDateString(),
          value: parsedDbInfo[indicator][key],  // Here, use the selected indicator
        }));
        if (resampleRate === 'month') {
          const resampledData = {};
          formattedData.forEach((dataPoint) => {
            const date = new Date(dataPoint.issue_date);
            const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
            if (!resampledData[monthYearKey]) {
              resampledData[monthYearKey] = { count: 0, total: 0 };
            }
            resampledData[monthYearKey].count += 1;
            resampledData[monthYearKey].total += dataPoint.value;
          });
      
          const monthlyData = Object.keys(resampledData).map((key) => {
            const monthYearArr = key.split('-');
            const averageValue = resampledData[key].total / resampledData[key].count;
            return {
              issue_date: new Date(Number(monthYearArr[1]), Number(monthYearArr[0]) - 1).toLocaleDateString(),
              value: averageValue,
            };
          });
          setChartData(prevData => [...prevData, [monthlyData]])
        } else {
          setChartData(prevData => [...prevData, [formattedData]])
        }
        if(chartData.length > 1){
          
          console.log(transformData(chartData))
          setMultiChart(transformData(chartData))
        }
        setChartKey((prevKey) => prevKey + 1);
      }catch (error) {
        console.error('Error:', error);
      }
    }
  }

  useEffect(() => {
    if(chartData){
      console.log(chartData)
    }
  }, [chartData])
  

  return (
    <div className='dashboardContainer'>
      <div style={{width:"97vw", height:"85vh",
      display:"flex", flexDirection:"column", justifyContent:"space-around", alignItems:"center"}}>
        <div className='data-selector' style={{width:"75%", height:"10%",
        display:"flex", flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
        <FormControl style={{ width: 200, backgroundColor:"white"}}>
        <InputLabel id="indicator-select-label">Indicator</InputLabel>
        <Select
          labelId="indicator-select-label"
          id="indicator-select"
          value={indicator}
          label="Indicator"
          onChange={(event) =>{
            setIndicator(event.target.value)
          }}
        >
          <MenuItem value={"profit"}>Profit</MenuItem>
          <MenuItem value={"revenue"}>Revenue</MenuItem>
          <MenuItem value={"expense"}>Expense</MenuItem>
        </Select>
      </FormControl>

      <FormControl style={{ width: 200, backgroundColor:"white"}}>
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={product}
          label="Product"
          onChange={(event) =>{
            setProduct(event.target.value)
          }}
        > 
          <MenuItem value={"all"}>All</MenuItem>
          {contacts ? (
            contacts.map((contact, index) => (
              <MenuItem key={index} value={contact.code}>
                {contact.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">
              <em>Loading...</em>
            </MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl style={{ width: 150, backgroundColor:"white"}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={selectedDateStart}
          onChange={(newValue) => setSelectedDateStart(newValue)}
        />
      </LocalizationProvider>
      </FormControl>

      <FormControl style={{ width: 150, backgroundColor:"white"}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End Date"
          value={selectedDateEnd}
          onChange={(newValue) => setSelectedDateEnd(newValue)}
        />
      </LocalizationProvider>
      </FormControl>


      <FormControl style={{ width: 150, backgroundColor:"white"}}>
        <InputLabel id="resample-rate-label">Resample Rate</InputLabel>
        <Select
          labelId="resample-rate-label"
          id="resample-rate"
          value={resampleRate}
          label="Resample Rate"
          onChange={(event) => {
            setResampleRate(event.target.value);
          }}
        >
          <MenuItem value={"day"}>Day</MenuItem>
          <MenuItem value={"month"}>Month</MenuItem>
        </Select>
      </FormControl>

      <div style={{width:"10px"}}></div>
      <div style={{width:"10px"}}></div>
      <button onClick={getGraph} style={{background:"none", border:"none"}}>
      <div style={{width:"50px", height:"50px", borderRadius:"50px", backgroundColor:"#00A36C",
      display:"flex", justifyContent:"center", alignContent:"center", alignItems:"center"
      }}>
        <IoIcons.IoIosSearch color='white' size={35}/>
      </div>
      </button>
      
      {chartData.length > 0 && chartData.length <2 && (
        <button onClick={getPrediction} style={{background:"none", border:"none"}}>
      <div style={{width:"100px", height:"50px", borderRadius:"20px", backgroundColor:"#8884D8",
      display:"flex", justifyContent:"center", alignContent:"center", alignItems:"center", color:"white"
      }}>
        Predict
      </div>
      </button>
        )}
      </div>
      

      
      <div className='chart' style={{height: "84%", width: "90%", backgroundColor:"white",
      display:"flex", alignItems:"center", alignContent:"center", justifyContent:"center",
      borderRadius:"50px", boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.1)"
      }}>
         {multichart ? (
          <ResponsiveContainer width="90%" height="90%">
            <LineChart key={chartKey} data={multichart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="issue_date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Array.from({ length: chartData.length }).map((_, index) => (
                <Line 
                  key={index}
                  type="monotone" 
                  dataKey={`value${index + 1}`} 
                  stroke={getRandomColor()} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
  ) : (
    !!chartData.length && (
      <ResponsiveContainer width="90%" height="90%">
          <LineChart key={chartKey} data={chartData[0][0]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="issue_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
    )
  )}
      </div>
      

      <div>
      </div>
      </div>
      <ChatBot /> 
    </div>
  )
}
export default Kpi
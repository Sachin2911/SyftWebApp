import { useGetData } from '../hooks/useGetData';
import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAuthContext } from '../hooks/useAuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, ScatterChart, Legend
} from 'recharts';


const Management = () => {
  const { user } = useAuthContext();
  const items = useGetData("item", user);
  const [product, setProduct] = useState()
  const [threshold, setThreshold] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const itemls = ["FR001", "TIN001", "CIN001", "ARI001", "JAS001", "CHO001"]
  const [stlIndex, setstlIndex] = useState(0)
  const [stl, setstl] = useState();

  const getMonthNameWithYear = (dateStr) => {
    const dateObj = new Date(dateStr);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStr = monthNames[dateObj.getMonth()];
    const yearStr = dateObj.getFullYear().toString().substr(2,2);  // Get last two digits of the year
    return `${monthStr} ${yearStr}`;
  }

  const incrementStlIndex = () => {
    if (stlIndex < itemls.length - 1) {
      setstlIndex(stlIndex + 1);
    }
  };
  
  const decrementStlIndex = () => {
    if (stlIndex > 0) {
      setstlIndex(stlIndex - 1);
    }
  };
  
  const handleDelete = async (alertId) => {
    try {
          const url = `http://localhost:4000/info/alerts/${alertId}`;
          const authString = "Bearer " + user.token;
          const response = await fetch(url, {
              method: "DELETE",
              headers: {
                  Authorization: authString,
              },
          });

          if (response.ok) {
              setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== alertId));
          } else {
              console.error("Failed to delete alert.");
          }
      } catch (error) {
          console.error("Error deleting alert:", error);
      }
  };


  const fetchAlerts = async () => {
      try {
          const url = "http://localhost:4000/info/alerts";  // Update with the GET endpoint if different
          const authString = "Bearer " + user.token;
          const response = await fetch(url, {
              headers: {
                  Authorization: authString,
              }
          });

          const data = await response.json();
          setAlerts(data);
      } catch (error) {
          console.error("Error fetching alerts:", error);
      }
  };

  const fetchStl = async() =>{
    const code = itemls[stlIndex]
    try{
      const url = 'http://localhost:5000//api/decomposition'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: code }),
      });

      // Parse the JSON response
      const data = await response.json();
      setstl(data.response)

    }catch (error) {
      console.error('Error:', error);
    }
      

  }

  useEffect(() => {
      fetchAlerts();
      fetchStl();
  }, [stlIndex]);


  const getEmoji = (name) => {
    if (name.toLowerCase().includes("cupcake")) {
      return "🧁";
    } else if (name.toLowerCase().includes("cake")) {
      return "🍰";
    } else if (name.toLowerCase().includes("chocolate")) {
      return "🍫";
    } else {
      return "";
    }
  }

  const handleAddAlert = async () => {
      if (!product || !threshold) {
          setErrorMessage("Please select a product and set a threshold.");
          return;
      }

      const data = {
          productCode: product,
          threshold: threshold
      };

      try {
          const url = "http://localhost:4000/info/alerts"
          const authString = "Bearer " + user.token;
          console.log(data);
          const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: authString,
            },
              body: JSON.stringify(data)
          });

          if (response.ok) {
              setSuccessMessage("Alert added successfully!");
              setTimeout(() => {
                setSuccessMessage("");
              }, 3000);
              setErrorMessage(null);
              fetchAlerts()
          } else {
              const responseData = await response.json();
              setErrorMessage(responseData.message || "Failed to add alert.");
              setTimeout(() => {
                setErrorMessage("");
              }, 3000);
          }
      } catch (error) {
          setErrorMessage("Network error. Please try again later.");
      }
  };


  return (
    <div className='management-container' style={{
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
    }}>
      {/* Carousel Section */}
      <div className='carousel' style={{
        width: "99vw", height: "35vh", backgroundColor: "#31D6AD",
        display: "flex", flexDirection: "row", justifyContent: "space-around", alignContent: "center", alignItems: "center"
      }}>
        {items && (
          items.map((item) => {
            return (
              <div style={{
                width: "210px", height: "210px", backgroundColor: "white", borderRadius: "70px",
                display: "flex", alignContent: "flex-end", justifyContent: "center", alignItems: "center", boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.1)"
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5px" }}>
                  <div>{getEmoji(item.name)}</div>
                  <h6>{item.name}</h6>
                  <p>{item.code}</p>
                  <h2 style={{ color: item.quantity_on_hand < 10 ? 'red' : '#1AAC83' }}>{item.quantity_on_hand}</h2>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className='page' style={{
        width:"95vw", backgroundColor:"#F1F1F1", display:"flex", flexDirection:"row",
        justifyContent:"space-evenly", alignItems:"flex-start", margin:"50px"
      }}>

        <div className='alerts' style={{
          width:"33vw", height:"60vh", backgroundColor:"white", borderRadius:"20px",
          boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.1)"
        }}>
          <div className='alert-heading' style={{width:"100%", height:"15%", 
          backgroundColor:"#31D6AD", display:"flex", alignItems:"center",
          color:"white", borderRadius:"10px 10px 0 0"}}>
            <h3 style={{paddingLeft:"15px"}}>Set Alerts</h3>
          </div>
          <div className='alerts-creator' style={{
            display:"flex", flexDirection:"row", height:"20%",
            justifyContent:"space-evenly", alignItems:"center"
          }}>
            <h6>Add Data: </h6>
            <FormControl style={{ width: "150px", height:"60px", backgroundColor:"white"}}>
                <InputLabel id="product-select-label">Item Code</InputLabel>
                <Select

                    labelId="product-select-label"
                    id="product-select"
                    value={product}
                    label="Product"
                    onChange={(event) =>{
                        setProduct(event.target.value);
                    }}
                > 
                    {items ? (
                        items.map((item, index) => (
                            <MenuItem key={index} value={item.code}>
                                {item.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="">
                            <em>Loading...</em>
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
            <input style={{width:"170px", height:"60px"}}
                type="number"
                value={threshold}
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (Number(val) > 0)) {
                        setThreshold(val);
                    }
                }}
                placeholder="Set Threshold"
            />
            <button onClick={handleAddAlert} style={{border:"none", backgroundColor:"none", height:"30px"}}>
            ➕</button>
        </div>
        {successMessage && <div className="success-message" style={{color:"green"}}>{successMessage}</div>}
        {errorMessage && <div className="error-message" style={{color:"green"}}>{errorMessage}</div>}
        <div className='alerts-table'>
          <table>
              <thead>
                  <tr>
                      <th>Product Code</th>
                      <th>Threshold</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {alerts.map((alert, index) => (
                      <tr key={index}>
                          <td>{alert.productCode}</td>
                          <td>{alert.threshold}</td>
                          <td><button onClick={() => handleDelete(alert._id)}>Delete</button></td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

       
          </div>
          <div className='stl-decomposition' style={{
        width: "60vw", backgroundColor: "white", borderRadius: "20px",
        boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.1)"
      }}>
        {stl && (
          <div style={{}}>
          <div className='alert-heading' style={{width:"100%", height:"15%", 
          backgroundColor:"#31D6AD", display:"flex", alignItems:"center",
          color:"white", borderRadius:"10px 10px 0 0"}}>
            <h3 style={{paddingLeft:"15px", paddingTop:"5px"}}>STL Decomposition - {stl.item_code}</h3>
          </div>
            <div className='stl-control-buttons' style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width: "100%" }}>
            <button onClick={decrementStlIndex} disabled={stlIndex === 0}
            style={{backgroundColor:"none", border:"none"}}>←</button>
            <div className='stl-charts' style={{display:"flex", flexDirection:"row", margin:"20px",
            height:"270px"}}>
            {/* Line Chart for Observed, Residual, and Trend */}
            <LineChart
              width={420}
              height={300}
              data={stl.dates.map((date, index) => ({
                date,
                observed: stl.observed[index],
                seasonal: stl.seasonal[index],
                trend: stl.trend[index],
              }))}
              margin={{
                top: 5, right: 30, left: 20, bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(data) => getMonthNameWithYear(data.date)} angle={-40} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '30px' }}/>
              <Line type="monotone" dataKey="observed" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="seasonal" stroke="#82ca9d" />
              <Line type="monotone" dataKey="trend" stroke="#ff7300" />
            </LineChart>

            {/* Scatter Chart for Residual */}
            <ScatterChart
              width={420}
              height={300}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis dataKey={(data) => getMonthNameWithYear(data.date)} name="Date"
              angle={-45} textAnchor="end" />
              <YAxis dataKey="residual" name="Residual" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ paddingTop: '30px' }}/>
              <Scatter name="Residual" data={stl.dates.map((date, index) => ({
                date,
                residual: stl.residual[index],
              }))} fill="#82ca9d" />
            </ScatterChart>
            </div>
            <button onClick={incrementStlIndex} disabled={stlIndex === itemls.length - 1}
            style={{backgroundColor:"none", border:"none"}}>→</button>
            </div>
            <div className='info' style={{display:"flex", flexDirection:"column", alignContent:"center"}}>
              <div style={{display:"flex", justifyContent:"space-evenly"}}>
                <div><b>Seasonal Peak Month:</b> {stl.peak_revenue_month}</div>
                <div><b>Seasonal Trough Month:</b> {stl.trough_revenue_month}</div>
              </div>
              <div className='explanation alerts-table'>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '200px' }}>Key</th>
                      <th>Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><b>Dominant Seasonality:</b></td>
                      <td>By analyzing the seasonality plots, you can identify the months that consistently exhibit peaks and troughs. This can be useful for business planning and forecasting.</td>
                    </tr>
                    <tr>
                      <td><b>Trend Insights:</b></td>
                      <td>Understanding the trend component can help gauge the overall health and direction of the business. Is it growing, stable, or declining?</td>
                    </tr>
                    <tr>
                      <td><b>Residual Analysis:</b></td>
                      <td>Significant residuals (values far from zero) can indicate anomalies or events that the model couldn't account for using trend or seasonality.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
      
    </div>
  )
}

export default Management;
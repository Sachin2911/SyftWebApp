import { useGetData } from '../hooks/useGetData';
import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAuthContext } from '../hooks/useAuthContext';

const Management = () => {
  const { user } = useAuthContext();
  const items = useGetData("item", user);
  const [product, setProduct] = useState()
  const [threshold, setThreshold] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [alerts, setAlerts] = useState([]);

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

  useEffect(() => {
      fetchAlerts();
  }, []);


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
        width: "100vw", height: "35vh", backgroundColor: "#31D6AD",
        display: "flex", flexDirection: "row", justifyContent: "space-around", alignContent: "center", alignItems: "center"
      }}>
        {items && (
          items.map((item) => {
            return (
              <div style={{
                width: "210px", height: "210px", backgroundColor: "white", borderRadius: "70px",
                display: "flex", alignContent: "flex-end", justifyContent: "center", alignItems: "center",
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
        width:"100vw", height:"70vh", backgroundColor:"#F1F1F1", display:"flex", flexDirection:"row",
        justifyContent:"space-evenly", alignItems:"center"
      }}>

        <div className='alerts' style={{
          width:"33vw", height:"60vh", backgroundColor:"white", borderRadius:"20px"
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

          <div className='data-add' style={{
            width:"60vw", height:"60vh", backgroundColor:"white", borderRadius:"20px"
          }}>

          </div>
      </div>
      
    </div>
  )
}

export default Management;
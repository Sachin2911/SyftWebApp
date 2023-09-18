import { useState, useEffect } from "react";

export const useAggregateData = (data) => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      if (data) {
        const aggregatedData = aggregateByMonth(data);
        const chartFriendlyData = toChartData(aggregatedData);
        setChartData(chartFriendlyData);
      }
    }, [data]);
  
    const toChartData = (aggregatedData) => {
        if(aggregatedData==null){
          return null
        }
        return Object.keys(aggregatedData).map((key) => {
          const [year, month] = key.split("-").map(Number);
          const date = new Date(year, month);
          const monthYearString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
          return {
            date: monthYearString,
            total: aggregatedData[key]
          };
        });
      };

      const aggregateByMonth = (data) => {
        if(data==null){
          return null;
        }
        const aggregatedData = {};
      
        data.forEach((item) => {
          const date = new Date(item.date);
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${year}-${month}`;
      
          if (aggregatedData[key]) {
            aggregatedData[key] += item.total;
          } else {
            aggregatedData[key] = item.total;
          }
        });
      
        return aggregatedData;
      };
  
    return chartData;
  };
  
  export const useFilterData = (data, key, value) => {
    const [filteredData, setFilteredData] = useState(null);
  
    useEffect(() => {
      if (data) {
        const result = data.filter(item => item[key] === value);
        setFilteredData(result);
      }
    }, [data, key, value]);
  
    return filteredData;
  };

  export const useSumData = (data) => {
    const [sumData, setSumData] = useState(0);
  
    useEffect(() => {
      if (data) {
        let total = 0;
        data.forEach((item) => {
          total += (item["total"]);
        });
        setSumData(total);
      }
    }, [data]);
  
    return sumData;
  };

  export const useTurnOver = (data) => {
    const [sumData, setSumData] = useState(0);
  
    useEffect(() => {
      if (data) {
        let total = 0;
        data.forEach((item) => {
          total += (item["sale_unit_price"] * item["quantity_on_hand"]);
        });
        setSumData(total);
      }
    }, [data]);
  
    return sumData;
  };
  
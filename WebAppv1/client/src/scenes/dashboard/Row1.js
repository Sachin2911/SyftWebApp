import {DashboardBox, BoxHeader} from '../../components/ChartElements'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useAggregateData, useFilterData } from '../../hooks/useDataOperations'
import { useGetData } from "../../hooks/useGetData";
import { Bar, CartesianGrid, BarChart, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Row1 = () => {
  // Getting the user from the global context so that we can use the JWT token when we send the request
  const { user } = useAuthContext();

  // Getting the payment and item data from Mongo
  const dataPayment = useGetData("payment", user);
  const dataItem = useGetData("item", user);
  
  // Filtering the data to get revenue and expenses, then aggregating them by month
  const revenueChartData = useAggregateData(useFilterData(dataPayment, 'is_income', true));
  const expenseChartData = useAggregateData(useFilterData(dataPayment, 'is_income', false));
  
  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader title="Revenue and Expenses" sideText="+3%" />
        {/* Check is the data is avaialable then display */}
        { revenueChartData && (
          <ResponsiveContainer className="graphBox" width="95%" height="85%">
            <AreaChart data={revenueChartData}
              margin={{top: 5,right: 1,left: 10,bottom: 10}}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71f5de" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#71f5de" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickLine={false} style={{ fontSize: "15px" }} />
              <YAxis tickLine={false} style={{ fontSize: "15px" }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="total" stroke="#71f5de" fill="url(#colorRevenue)" name='Revenue' />
              <Area type="monotone" data={expenseChartData} dataKey="total" stroke="#ff7300" fill="url(#colorExpenses)" name='Expense' />
            </AreaChart>
      </ResponsiveContainer>)}
      </DashboardBox>
      
      <DashboardBox gridArea="b">
      <BoxHeader title="Inventory Overview" subtitle="Items currently available in inventory"></BoxHeader>
      {dataItem && (
        <ResponsiveContainer width="100%" height="80%">
        <BarChart width={500} height={300} data={dataItem}
          margin={{top: 5, right: 30, left: 10,bottom: 5,}}>
        <defs>
        <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={1} />
          <stop offset="20%" stopColor="#8884d8" stopOpacity={1} />
          <stop offset="40%" stopColor="#8884d8" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
        </linearGradient>
        </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" style={{ fontSize: "16px" }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity_on_hand" fill="url(#colorInventory)" />
        </BarChart>
      </ResponsiveContainer>
      )}
    </DashboardBox>
    </>
  );
};

export default Row1;

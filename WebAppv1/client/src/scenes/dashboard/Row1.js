import React from 'react';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGetData } from "../../hooks/useGetData";
import { useAggregateData } from "../../hooks/useAggregateData";
import { useFilterData } from "../../hooks/useFilterData";  
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Row1 = () => {
  const { user } = useAuthContext();
  const data = useGetData("payment", user);
  
  const revenueData = useFilterData(data, 'is_income', true);
  const expenseData = useFilterData(data, 'is_income', false);

  const revenueChartData = useAggregateData(revenueData);
  const expenseChartData = useAggregateData(expenseData);

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader title="Revenue and Expenses" sideText="+4%" />
        { data && (
          <ResponsiveContainer className="graphBox" width="95%" height="85%">
          <AreaChart
        data={revenueChartData}
        margin={{
          top: 5,
          right: 1,
          left: 10,
          bottom: 10,
        }}
>
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

      </ResponsiveContainer>
        )}
      </DashboardBox>
      
      <DashboardBox gridArea="b">
    <BoxHeader title="Profit and Revenue"
      subtitle="top line represents profit, bottom line represents revenue"
      sideText="+4%"></BoxHeader>
    </DashboardBox>


    <DashboardBox gridArea="c">
    <BoxHeader title="Revenue Month By Month"
      subtitle="graph representing the revenue month by month"
      sideText="+4%"></BoxHeader>
    </DashboardBox>

    </>
  );
};

export default Row1;

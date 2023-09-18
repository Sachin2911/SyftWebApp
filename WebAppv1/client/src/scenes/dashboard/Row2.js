import React from 'react'
import DashboardBox from '../../components/DashboardBox'
import BoxHeader from '../../components/BoxHeader'
import FlexBetween from '../../components/FlexBetween'
import {Box, Typography} from "@mui/material"
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGetData } from "../../hooks/useGetData";
import { useTurnOver } from '../../hooks/useTurnOver'
import { useSumData } from "../../hooks/useSumData"
import { useAggregateData } from "../../hooks/useAggregateData";
import { useFilterData } from "../../hooks/useFilterData";  
import RecentTransactions from "../../components/TransactionsTable"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell, Legend } from 'recharts';


function Row2() {
  const { user } = useAuthContext();
  const dataItem = useGetData("item", user);
  const sumDataItem = useTurnOver(dataItem);
  const dataPayment = useGetData("payment", user);

  const revenueData = useFilterData(dataPayment, 'is_income', true);
  const expenseData = useFilterData(dataPayment, 'is_income', false);

  const revenueChartData = useAggregateData(revenueData);
  const expenseChartData = useAggregateData(expenseData);

  // Getting the sum of what is owed
  const dataInvoice = useGetData("invoice", user);
  const dataInvoiceSale = useFilterData(dataInvoice, 'is_sale', true)
  const dataInvoiceSaleNotPaid = useFilterData(dataInvoiceSale, 'paid', false)
  const sumSaleNotPaid = useSumData(dataInvoiceSaleNotPaid)

  //Getting sum of what we owe
  const dataInvoiceExp = useFilterData(dataInvoice, 'is_sale', false)
  const dataInvoiceExpNotPaid = useFilterData(dataInvoiceExp, 'paid', false)
  const sumExpNotPaid = useSumData(dataInvoiceExpNotPaid)

  const cashflowData = [
    { name: 'Owed to us', value: parseFloat(sumSaleNotPaid || 0) },
    { name: 'We owe', value: parseFloat(sumExpNotPaid || 0) },
  ];
  

  let profitChartData = null;

  // Calculate profit data only if revenueChartData and expenseChartData are not null
  if (revenueChartData && expenseChartData) {
    profitChartData = revenueChartData.map((revenue, index) => ({
      date: revenue.date,
      total: revenue.total - (expenseChartData[index]?.total || 0),
    }));
  }

  return (
    <>
    <DashboardBox gridArea="d">
  <BoxHeader title="Cashflow movements due" sideText="+4%" />
  <div className='movements'>
  <PieChart width={200} height={200}>
    <Pie
      data={cashflowData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={60}
      fill="#82ca9d"
    >
      <Cell key="Owed to us" fill="#00A36C" />
      <Cell key="We owe" fill="#FF0000" />
    </Pie>
    <Tooltip />
  </PieChart>
  <div className='movement-nums'>
    <Typography  variant="h5" color={"#00A36C"}>
      {sumSaleNotPaid && `+R ${parseFloat(sumSaleNotPaid).toFixed(2).toLocaleString()}`}
    </Typography>
    <Typography variant="h5" color={"#FF0000"}>
      {sumExpNotPaid && `-R ${parseFloat(sumExpNotPaid).toFixed(2).toLocaleString()}`}
    </Typography>
    </div>
  </div>
  
</DashboardBox>


    <DashboardBox gridArea="c">
    <BoxHeader title="Most recent transactions"
      sideText="+4%"></BoxHeader>
      {dataPayment && (<RecentTransactions transactions={dataPayment} />)}
    </DashboardBox>

    <DashboardBox gridArea="e">
      <BoxHeader title="Potential Turnover" sideText="+10%"/>
      <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
      </FlexBetween>
      <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
      <Typography m="0.3rem 0" variant="h3" color={"#00A36C"}>{sumDataItem && `R ${sumDataItem.toLocaleString()}`}</Typography>
        <Typography style={{ fontSize: "15px" }}>Based on products available in inventory</Typography>
      </Box>
    </DashboardBox>

    <DashboardBox gridArea="f">
        <BoxHeader title="Profit and Revenue" sideText="-7%" />
        <ResponsiveContainer width="100%" height={300}>
  {revenueChartData && expenseChartData && profitChartData ? (
    <AreaChart
      data={revenueChartData}
      margin={{ top: 10, right: 50, left: 20, bottom: 20 }}
    >
      <XAxis dataKey="date" style={{ fontSize: "16px" }}/>
      <YAxis style={{ fontSize: "16px" }}/>
      <Tooltip />
      <Area type="monotone" data={expenseChartData} dataKey="total" stroke="#82ca9d" fill="#82ca9d" name="Expense" />
      <Area type="monotone" data={profitChartData} dataKey="total" stroke="#FF0000" fill="#FF0000" name="Profit" />
    </AreaChart>
  ) : (
    // You can display a loading spinner or some other placeholder here
    <div>Loading...</div>
  )}
</ResponsiveContainer>
      </DashboardBox>
    </>
  )
}

export default Row2

import React, { useEffect, useState } from 'react'
import {DashboardBox, BoxHeader, FlexBetween} from '../../components/ChartElements'
import {Box, Typography} from "@mui/material"
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGetCurrencies, useGetData } from "../../hooks/useGetData";
import { useAggregateData, useFilterData, useSumData, useTurnOver } from '../../hooks/useDataOperations' 
import RecentTransactions from "../../components/TransactionsTable"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'


function Row2() {
  // Getting the user from the global context so that we can use the JWT token when we send the request
  const { user } = useAuthContext();

  // Getting the data from mongo
  const dataItem = useGetData("item", user);
  const dataPayment = useGetData("payment", user);
  const dataInvoice = useGetData("invoice", user);
  const currencies = useGetCurrencies()

  //Operations
  const sumDataItem = useTurnOver(dataItem);
  const revenueChartData = useAggregateData(useFilterData(dataPayment, 'is_income', true));
  const expenseChartData = useAggregateData(useFilterData(dataPayment, 'is_income', false));
  const sumSaleNotPaid = useSumData(useFilterData(useFilterData(dataInvoice, 'is_sale', true), 'paid', false))
  const sumExpNotPaid = useSumData(useFilterData(useFilterData(dataInvoice, 'is_sale', false), 'paid', false))

  // Creating the data object for the pie
  const cashflowData = [
    { name: 'Owed', value: parseFloat(sumSaleNotPaid || 0) },
    { name: 'Due', value: parseFloat(sumExpNotPaid || 0) },
  ];

  // To get the profit we need to subtract the expenses from revenue
  // There are a few problems with the data we first need to fix
  //lets first order the objects by date

  const [profitChartData, setProfitChartData] = useState(null);

  useEffect(() => {
    if (revenueChartData && expenseChartData) {
      const sortedExpArray = [...expenseChartData].sort((a, b) => a.date.localeCompare(b.date));
      const sortedRevArray = [...revenueChartData].sort((a, b) => a.date.localeCompare(b.date));

      const expensesTotalsArray = sortedExpArray.map((item) => item.total);
      const expenseslen = [0, 0, ...expensesTotalsArray];
      const revenueTotalsArray = sortedRevArray.map((item) => item.total);

      const profitArray = revenueTotalsArray.map((num, idx) => num - expenseslen[idx]);

      const profitObj = sortedRevArray.map((obj, index) => ({
        ...obj,
        total: profitArray[index]
      }));

      setProfitChartData(profitObj);
      if(currencies){
        console.log(currencies.rates.NGN)
      }
    }
  }, [revenueChartData, expenseChartData]);

  return (
    <>
    <DashboardBox gridArea="d">
      <BoxHeader title="Cashflow movements due" sideText="+4%" />
      <div className='movements'>
      <PieChart width={200} height={200}>
        <Pie data={cashflowData} dataKey="value" nameKey="name"cx="50%"cy="50%"outerRadius={60}
          fill="#82ca9d">
          <Cell key="Owed" fill="#00A36C" />
          <Cell key="Due" fill="#FF0000" />
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
    <BoxHeader title="Most recent transactions"></BoxHeader>
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
        <BoxHeader title="Profit" sideText="+7%" />
        <ResponsiveContainer width="100%" height={300}>{revenueChartData && expenseChartData && profitChartData ? (
        <AreaChart data={revenueChartData} margin={{ top: 10, right: 50, left: 20, bottom: 20 }}>
          <XAxis dataKey="date" style={{ fontSize: "16px" }}/>
          <YAxis style={{ fontSize: "16px" }}/>
          <Tooltip />
          <Area type="monotone" data={profitChartData} dataKey="total" stroke="#FF0000" fill="#FF0000" name="Profit" />
        </AreaChart>) : (<div>Loading...</div>)}
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="g">
      <BoxHeader title="Exchange Rates" sideText="📈" />
      {currencies && (
        <div style={{fontSize:"30px"}} className='currency-block'>
          <div>🇬🇧 {currencies.rates.GBP.toFixed(3)}</div>
          <div>🇳🇿 {currencies.rates.NZD.toFixed(3)}</div>
          <div>🇿🇦 {currencies.rates.ZAR.toFixed(3)}</div>
          <div>🇳🇬 {currencies.rates.NGN.toFixed(3)}</div>
          <div>🇮🇳 {currencies.rates.INR.toFixed(3)}</div>
      </div>
      )}
      </DashboardBox>
    </>
  )
}

export default Row2

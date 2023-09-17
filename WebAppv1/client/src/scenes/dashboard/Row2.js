import React from 'react'
import DashboardBox from '../../components/DashboardBox'
import BoxHeader from '../../components/BoxHeader'
import FlexBetween from '../../components/FlexBetween'

function Row2() {
  return (
    <>
    <DashboardBox gridArea="d">
    <BoxHeader title="Operational vs Non-Operational Expenses"
      sideText="+4%"></BoxHeader>
    </DashboardBox>

    <DashboardBox gridArea="c">
    <BoxHeader title="Revenue Month By Month"
      subtitle="graph representing the revenue month by month"
      sideText="+4%"></BoxHeader>
    </DashboardBox>

    <DashboardBox gridArea="e">
      <BoxHeader title="Campaigns and Targets" sideText="+10%"/>
      <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
      </FlexBetween>
    </DashboardBox>

    <DashboardBox gridArea="f">
    <BoxHeader title="Product Prices vs Expenses" sideText="-7%"/>
    </DashboardBox>
    </>
  )
}

export default Row2

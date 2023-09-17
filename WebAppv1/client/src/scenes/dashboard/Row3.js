import React from 'react'
import DashboardBox from '../../components/DashboardBox'
import BoxHeader from '../../components/BoxHeader'
import FlexBetween from '../../components/FlexBetween'

function Row3() {
  return (
    <>
    <DashboardBox gridArea="g">
      <BoxHeader
        title="List of Products"
        sideText={`products`}
      />
    </DashboardBox>

    <DashboardBox gridArea="h">
      <BoxHeader
        title="Recent Orders"
        sideText={` latest transactions`}
      />
    </DashboardBox>

    <DashboardBox gridArea="i">
      <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
      <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
      </FlexBetween>
    </DashboardBox>

    <DashboardBox gridArea="j">
      <BoxHeader
        title="Overall Summary and Explanation Data"
        sideText="+15%"
      />
    </DashboardBox>
    </>
  )
}

export default Row3

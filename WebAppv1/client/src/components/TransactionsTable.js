import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function RecentTransactions({ transactions }) {
  // Sort the transactions by date in descending order
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Take the first 10 transactions
  const recentTransactions = sortedTransactions.slice(0, 10);

  return (
    <TableContainer style={{ maxHeight: 250, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Is Income</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentTransactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{`R ${transaction.total.toLocaleString()}`}</TableCell> {/* Added R for currency */}
              <TableCell>{transaction.is_income ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RecentTransactions;

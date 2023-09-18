import { useEffect, useState } from 'react';

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

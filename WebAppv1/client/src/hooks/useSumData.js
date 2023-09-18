import { useEffect, useState } from 'react';

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

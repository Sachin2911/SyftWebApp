import { useEffect, useState } from 'react';

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

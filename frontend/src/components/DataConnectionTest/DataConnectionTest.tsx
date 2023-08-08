import React, { useState, useEffect } from 'react';

interface BeerDataItem {
  //id: number;
  name: string;
  // Add more properties as needed
}

const DataFetchingComponent: React.FC = () => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3001/get'); // Replace with your API endpoint
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>Data Fetching Example</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};

export default DataFetchingComponent;

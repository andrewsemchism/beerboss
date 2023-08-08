import React, { useState, useEffect } from 'react';

interface DataItem {
  //id: number;
  name: string;
  // Add more properties as needed
}

const DataFetchingComponent: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3001'); // Replace with your API endpoint
        const jsonData: DataItem[] = await response.json();
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

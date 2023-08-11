import React, { useState, useEffect}  from 'react';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';

interface BeerDataItem {
  id: number;
  beer_name_formatted: string
  quantity: number;
  case_type: string;
  size_ml: number;
  main_price: number;
  original_price: number;
  deposit_price: number;
  abv: number;
  country: string;
  category: string;
  beer_type: string;
  url: string;
  dollars_per_drink: number;
  dollars_per_drink_after_deposit: number;
}

const All: React.FC = () => {
  const [data, setData] = useState<BeerDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/allbeer`);
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
        <div>
          {data.map((beer) => (
            <div key={beer.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
              <h3>{beer.beer_name_formatted}</h3>
              <p>Quantity: {beer.quantity}</p>
              <p>Case Type: {beer.case_type}</p>
              <p>Size (ml): {beer.size_ml}</p>
              <p>Main Price: ${beer.main_price}</p>
              <p>Original Price: ${beer.original_price}</p>
              <p>Deposit Price: ${beer.deposit_price}</p>
              <p>ABV: {beer.abv}%</p>
              <p>Country: {beer.country}</p>
              <p>Category: {beer.category}</p>
              <p>Beer Type: {beer.beer_type}</p>
              <p>URL: <a href={beer.url}>{beer.url}</a></p>
              <p>Dollars per Drink: ${beer.dollars_per_drink}</p>
              <p>Dollars per Drink after Deposit: ${beer.dollars_per_drink_after_deposit}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default All;
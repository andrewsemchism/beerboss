import React, { useState, useEffect, useMemo}  from 'react';
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

  const columns = useMemo<MRT_ColumnDef<BeerDataItem>[]>(
    () => [
      {
        header: 'Beer Name',
        accessorKey: 'beer_name_formatted', //using accessorKey dot notation to access nested data
      },
      {
        header: 'Quentity',
        accessorKey: 'quantity',
      },
      {
        header: 'Case Type',
        accessorKey: 'case_type',
      },
      {
        header: 'Size (ml)',
        accessorKey: 'size_ml',
      },
      {
        header: 'Price',
        accessorKey: 'main_price',
      },
      {
        header: 'ABV',
        accessorKey: 'abv',
      }
    ],
    [],
  );
  

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
        <MaterialReactTable
          columns={columns}
          data={data}
          />
      )}
    </div>
  );
}

export default All;
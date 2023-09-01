import React, { useState, useEffect, useMemo}  from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FilterButton from '../FilterButton/FilterButton';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import Select from 'react-select';
import styles from './All.module.css';

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

interface filters {
  regularCan: boolean;
  tallboyCan: boolean;
  regularBottle: boolean;
  largeBottle: boolean;
  smallKeg: boolean;
  largeKeg: boolean;
  packs: number[];
  packsOther: boolean;
  onSale: boolean;
  subtractDeposit: boolean;
  names: Set<string>;
}

function toggleItemInList(list: number[], item: number): number[] {
  const index = list.indexOf(item);

  if (index !== -1) {
    list.splice(index, 1);
  } else {
    list.push(item);
  }

  return list;
}

const All: React.FC = () => {
  const [data, setData] = useState<BeerDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<BeerDataItem[]>([]);
  const [beerNames, setBeerNames] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<filters>({
    regularCan: true,
    tallboyCan: true,
    regularBottle: true,
    largeBottle: true,
    smallKeg: true,
    largeKeg: true,
    packs: [1,6,12,15,18,20,24,28,30,48],
    packsOther: true,
    onSale: false,
    subtractDeposit: false,
    names: new Set(),
  });
  // Todo: Find a better way to force the table to update the columns when enabling the "Subtract Depot" filter
  const [tableKey, setTableKey] = useState<number>(0);

  const containerFilter = (item: BeerDataItem, newFilter: filters) => {
    return (
      (newFilter.regularCan && item.case_type === 'Can' &&  item.size_ml <= 355) ||
      (newFilter.tallboyCan && item.case_type === 'Can' &&  item.size_ml > 355) ||
      (newFilter.regularBottle && item.case_type === 'Bottle' && item.size_ml < 400) ||
      (newFilter.largeBottle && item.case_type === 'Bottle' && item.size_ml > 400) ||
      (newFilter.smallKeg && item.case_type === 'Keg' && item.size_ml < 30000) ||
      (newFilter.largeKeg && item.case_type === 'Keg' && item.size_ml >= 30000)
    );
  }

  const nameFilter = (item: BeerDataItem, newFilter: filters) => {
    return newFilter.names.has(item.beer_name_formatted) || newFilter.names.size === 0;
  }

  const packFilter = (item: BeerDataItem, newFilter: filters) => {
    const packFilterOptions = [1,6,12,15,18,20,24,28,30,48];
    return newFilter.packs.includes(item.quantity) || (newFilter.packsOther && !packFilterOptions.includes(item.quantity));
  }

  const saleFilter = (item: BeerDataItem, newFilter: filters) => {
    return newFilter.onSale ? item.original_price !== -1 : true;
  }

  const handleFilterChange = (newFilter: filters) => {
    // Increment table key
    setTableKey((prevKey) => prevKey + 1);
    // Set the filters
    setFilters(newFilter);
    // Update the filtered data
    setFilteredData(data.filter((item) => {
      // Filter by bottle/can/keg type
      return containerFilter(item, newFilter) && packFilter(item, newFilter) && nameFilter(item, newFilter) && saleFilter(item, newFilter);
    }));
  }

  const columns = useMemo<MRT_ColumnDef<BeerDataItem>[]>(
    () => [
      {
        header: 'Beer Name',
        accessorKey: 'beer_name_formatted', //using accessorKey dot notation to access nested data
        maxSize: 100,
        Cell: ({ cell }) => (
          <a href={cell.row.original.url} target="_blank" rel="noopener noreferrer">
            {cell.row.original.beer_name_formatted}
          </a>
        ),
      },
      {
        header: 'Type',
        accessorKey: 'beer_type',
        maxSize: 50,
      },
      {
        header: 'ABV',
        accessorKey: 'abv',
        Cell: ({ cell }) => <span>{cell.getValue<number>()}%</span>,
        maxSize: 50,
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        maxSize: 25,
      },
      {
        header: 'Size (ml)',
        accessorKey: 'size_ml',
        maxSize: 50,
      },
      {
        header: 'Container Type',
        accessorKey: 'case_type',
        maxSize: 50,
      },
      {
        header: 'Price',
        accessorKey: 'main_price',
        Cell: ({ cell }) => <span>${cell.getValue<number>().toFixed(2)}</span>,
        maxSize: 50,
      },
      {
        header: 'Price Minus Deposit',
        accessorKey: 'deposit_price',
        Cell: ({ cell }) => <span>${cell.getValue<number>().toFixed(2)}</span>,
        maxSize: 50,
      },
      {
        header: 'Cost per Serving of Alcohol',
        accessorKey: 'dollars_per_drink',
        Cell: ({ cell }) => <span>${cell.getValue<number>().toFixed(2)}</span>,
        maxSize: 150,
      },
      {
        header: 'Cost per Serving of Alcohol (after deposit)',
        accessorKey: 'dollars_per_drink_after_deposit',
        Cell: ({ cell }) => <span>${cell.getValue<number>().toFixed(2)}</span>,
        maxSize: 150,
      }
    ],
    [],
  );
  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/allbeer`);
        const jsonData = await response.json();
        const parsedData: BeerDataItem[] = jsonData;
        setData(parsedData);
        setBeerNames(new Set(parsedData.map((item) => item.beer_name_formatted)));
        setFilteredData(parsedData.filter((item) => {
          // Filter by bottle/can/keg type
          return containerFilter(item, filters) && packFilter(item, filters) && nameFilter(item, filters)
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  
  return (
    <Container className={styles.allBeerPrices}>
      <Row>
        <Col>
          <h1>All Beer Prices</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>This table contains a list of all beer store products in every package size available. There are over 800 beers and 3000 purchasing options! Use the search bar and filters to narrow down your options. By default, the table is sorted so the best value beers appear at the top (lowest cost per serving of alcohol).</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} lg={3}> {/* Cans, Bottles, Kegs Filter */}
          <Row>
            <Col className={styles.filterHeading}>
              Can
            </Col>
            <Col className={styles.filterHeading}>
              Bottle
            </Col>
            <Col className={styles.filterHeading}>
              Keg
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="95%" text="Regular" isEnabled={filters.regularCan} onClick={() => handleFilterChange({...filters, regularCan: !filters.regularCan})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="Regular" isEnabled={filters.regularBottle} onClick={() => handleFilterChange({...filters, regularBottle: !filters.regularBottle})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="< 30 L" isEnabled={filters.smallKeg} onClick={() => handleFilterChange({...filters, smallKeg: !filters.smallKeg})}/>
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="95%" text="TallBoy" isEnabled={filters.tallboyCan} onClick={() => handleFilterChange({...filters, tallboyCan: !filters.tallboyCan})}/>
            </Col>
            <Col className="p-0">
            <FilterButton width="95%" text="Large" isEnabled={filters.largeBottle} onClick={() => handleFilterChange({...filters, largeBottle: !filters.largeBottle})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="30 L +" isEnabled={filters.largeKeg} onClick={() => handleFilterChange({...filters, largeKeg: !filters.largeKeg})}/>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col className={styles.filterHeading}>
              Pack Size
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="95%" text="1" isEnabled={filters.packs.includes(1)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 1)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="6" isEnabled={filters.packs.includes(6)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 6)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="12" isEnabled={filters.packs.includes(12)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 12)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="15" isEnabled={filters.packs.includes(15)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 15)})}/>
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="95%" text="18" isEnabled={filters.packs.includes(18)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 18)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="20" isEnabled={filters.packs.includes(20)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 20)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="24" isEnabled={filters.packs.includes(24)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 24)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="28" isEnabled={filters.packs.includes(28)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 28)})}/>
            </Col>
          </Row>
          <Row>
            <Col xs={3} className="p-0">
              <FilterButton width="95%" text="30" isEnabled={filters.packs.includes(30)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 30)})}/>
            </Col>
            <Col xs={3} className="p-0">
              <FilterButton width="95%" text="48" isEnabled={filters.packs.includes(48)} onClick={() => handleFilterChange({...filters, packs: toggleItemInList(filters.packs, 48)})}/>
            </Col>
            <Col className="p-0">
              <FilterButton width="95%" text="Other" isEnabled={filters.packsOther} onClick={() => handleFilterChange({...filters, packsOther: !filters.packsOther})}/>
            </Col>
          </Row>

        </Col>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col className={styles.filterHeading}>
              Options
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="100%" text="Only Show Items On Sale" isEnabled={filters.onSale} onClick={() => handleFilterChange({...filters, onSale: !filters.onSale})}/>
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="100%" text="Subtract Deposit From Price" isEnabled={filters.subtractDeposit} onClick={() => handleFilterChange({...filters, subtractDeposit: !filters.subtractDeposit})}/>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Row>
            <Col className={styles.filterHeading}>
              Beer Filter
            </Col>
          </Row>
          <Select
            isMulti
            options={Array.from(beerNames).map((name) => ({ value: name, label: name })).sort((a, b) => a.label.localeCompare(b.label))}
            value={Array.from(filters.names).map((name) => ({ value: name, label: name }))}
            onChange={(selectedOptions) => {
              const selectedNames = new Set<string>(selectedOptions.map((option) => option.value));
              handleFilterChange({ ...filters, names: selectedNames });
            }}
            placeholder="Select Beers"
          />
        </Col>
      </Row>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable
          key={tableKey}
          columns={columns}
          data={filteredData}
          enableColumnFilters={false}
          initialState={{
            columnVisibility: {
              deposit_price: filters.subtractDeposit,
              dollars_per_drink_after_deposit: filters.subtractDeposit,
              main_price: !filters.subtractDeposit,
              dollars_per_drink: !filters.subtractDeposit,
            },
            sorting: [
              {
                id: filters.subtractDeposit ? 'dollars_per_drink_after_deposit' : 'dollars_per_drink',
                desc: false,
              },
            ]
          }}
          enableHiding={false}
          enableTopToolbar={false}
          />
      )}
    </Container>
  );
}

export default All;
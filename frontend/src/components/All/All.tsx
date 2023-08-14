import React, { useState, useEffect, useMemo}  from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FilterButton from '../FilterButton/FilterButton';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
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
  name: string[];
}

function toggleItemInList(list: number[], item: number): number[] {
  const index = list.indexOf(item);

  if (index !== -1) {
    // Item is present, remove it
    list.splice(index, 1);
  } else {
    // Item is not present, add it
    list.push(item);
  }

  return list;
}

const All: React.FC = () => {
  const [data, setData] = useState<BeerDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<BeerDataItem[]>([]);
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
    name: [],
  });

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
    return newFilter.name.includes(item.beer_name_formatted) || newFilter.name.length === 0;
  }

  const packFilter = (item: BeerDataItem, newFilter: filters) => {
    const packFilterOptions = [1,6,12,15,18,20,24,28,30,48];
    return newFilter.packs.includes(item.quantity) || (newFilter.packsOther && !packFilterOptions.includes(item.quantity));
  }

  const handleFilterChange = (newFilter: filters) => {
    // Set the filters
    setFilters(newFilter);
    // Update the filtered data
    setFilteredData(data.filter((item) => {
      // Filter by bottle/can/keg type
      return containerFilter(item, newFilter) && packFilter(item, newFilter) && nameFilter(item, newFilter)
    }));
  }

  const columns = useMemo<MRT_ColumnDef<BeerDataItem>[]>(
    () => [
      {
        header: 'Beer Name',
        accessorKey: 'beer_name_formatted', //using accessorKey dot notation to access nested data
        filterFn: 'nameFilterFn',
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        filterFn: 'quantityFilterFn',
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
        const parsedData: BeerDataItem[] = jsonData;
        setData(parsedData);
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
              <FilterButton width="100%" text="Subtract Deposit From Price" isEnabled={filters.subtractDeposit} onClick={() => handleFilterChange({...filters, onSale: !filters.subtractDeposit})}/>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6} lg={3}>
          
        </Col>
      </Row>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={filteredData}
          enableColumnFilters={false}
          />
      )}
    </Container>
  );
}

export default All;
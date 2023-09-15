import React, { useState, useEffect, useMemo}  from 'react';
import ColourPopupModal from '../ColourPopupModal/ColourPopupModal';
import { Container, Row, Col } from 'react-bootstrap';
import FilterButton from '../FilterButton/FilterButton';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import Select from 'react-select';
import styles from './Value.module.css';

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
  name: string;
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

const Value: React.FC = () => {
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
    name: "",
  });

  // Todo: Find a better way to force the table to update the columns when enabling the "Subtract Depot" filter
  const [tableKey, setTableKey] = useState<number>(0);

  const getColor = (costPerServing: number, bestPrice: number) => {
    const getColorInRange = (startColor: number[], endColor: number[], percent: number) => {
      const r = Math.min(startColor[0] + (endColor[0] - startColor[0]) * percent, 255);
      const g = Math.min(startColor[1] + (endColor[1] - startColor[1]) * percent, 255);
      const b = Math.min(startColor[2] + (endColor[2] - startColor[2]) * percent, 255);
      return `rgb(${r}, ${g}, ${b})`;
    };
  
    const percentDifference = ((costPerServing - bestPrice) / bestPrice);
  
    if (percentDifference >= 0 && percentDifference <= 0.1) {
      // Generate a color between green and yellow
      const percentInRange = percentDifference / 0.1;
      return getColorInRange([153, 255, 153], [255, 255, 153], percentInRange);
    } else if (percentDifference > 0.1 && percentDifference <= 0.2) {
      // Generate a color between yellow and red
      const percentInRange = (percentDifference - 0.1) / 0.1;
      return getColorInRange([255, 255, 153], [255, 204, 153], percentInRange);
    } else if (percentDifference > 0.2) {
      // Generate a red
      const percentInRange = Math.min((percentDifference - 0.2) / 0.4, 1);
      return getColorInRange([255, 204, 153], [247, 121, 116], percentInRange);
    } else {
      // Default color (shouldn't happen)
      return 'rgb(255, 255, 255)';
    }
  };
  

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
    return newFilter.name === item.beer_name_formatted;
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
    }).sort((a, b) => newFilter.subtractDeposit ? a.dollars_per_drink_after_deposit - b.dollars_per_drink_after_deposit: a.dollars_per_drink - b.dollars_per_drink ));
  }

  const columns = useMemo<MRT_ColumnDef<BeerDataItem>[]>(
    () => [
      {
        header: 'Cost per Serving (355ml)',
        accessorKey: 'dollars_per_drink',
        Cell: ({ cell }) => {
          const price = cell.row.original.main_price;
          const sizeMl = cell.row.original.size_ml;
          const quantity = cell.row.original.quantity;
  
          if (price && sizeMl && quantity) {
            const costPerServing = ((price / (sizeMl * quantity))*355);
            const bestPriceType = filters.subtractDeposit ? 'deposit_price' : 'main_price';
            const bestPriceCostPerServing = ((filteredData[0][bestPriceType] / (filteredData[0].size_ml * filteredData[0].quantity))*355);
            return <div style={{
              backgroundColor: getColor(costPerServing, bestPriceCostPerServing),
              width: '100%',
              height: '100%',
              padding: '12px'
            }}>${costPerServing.toFixed(2)}</div>;
          }
  
          return <span>-</span>;
        },
        maxSize: 150,
        enableSorting: false,
      },
      {
        header: 'Cost per Serving (355ml) (after deposit)',
        accessorKey: 'dollars_per_drink_after_deposit',
        Cell: ({ cell }) => {
          const price = cell.row.original.deposit_price;
          const sizeMl = cell.row.original.size_ml;
          const quantity = cell.row.original.quantity;
  
          if (price && sizeMl && quantity) {
            const costPerServing = ((price / (sizeMl * quantity))*355);
            const bestPriceType = filters.subtractDeposit ? 'deposit_price' : 'main_price';
            const bestPriceCostPerServing = ((filteredData[0][bestPriceType] / (filteredData[0].size_ml * filteredData[0].quantity))*355);
            console.log("Best Price", bestPriceCostPerServing)
            console.log(bestPriceCostPerServing)
            return <div style={{
              backgroundColor: getColor(costPerServing, bestPriceCostPerServing),
              width: '100%',
              height: '100%',
              padding: '12px'
            }}>${costPerServing.toFixed(2)}</div>;
          }
  
          return <span>-</span>;
        },
        maxSize: 150,
        enableSorting: false,
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        maxSize: 25,
        enableSorting: false,
      },
      {
        header: 'Size (ml)',
        accessorKey: 'size_ml',
        maxSize: 50,
        enableSorting: false,
      },
      {
        header: 'Container',
        accessorKey: 'case_type',
        maxSize: 50,
        enableSorting: false,
      },
      {
        header: 'Price',
        accessorKey: 'main_price',
        Cell: ({ cell }) => <span>${cell.getValue<number>().toFixed(2)}</span>,
        maxSize: 50,
        enableSorting: false,
      },
      {
        header: 'Price Minus Deposit',
        accessorKey: 'deposit_price',
        Cell: ({ cell }) => <span>${cell.getValue<number>().toFixed(2)}</span>,
        maxSize: 50,
        enableSorting: false,
      },
    ],
    [filteredData, filters],
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

  useEffect(() => {
    document.title = "Beer Boss - Best Value Analyzer"
  }, []);

  
  return (
    <Container fluid className={styles.allBeerPrices}>
      <Row>
        <Col>
          <h1>Best Value Analyzer</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <p>The best value analyzer helps you find the best purchasing option for any beer. Simply select your desired drink and the table will show you all the purchasing options. The table will be sorted with the best value options at the top.</p>
          <p>The “Cost per serving” column is colour coded from green to red to indicate the relative value of each purchasing option. <ColourPopupModal/></p>
        </Col>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Col xs={12} md={6} lg={3} xl={3}>
          <Row>
            <Col className={styles.filterHeading}>
              Select Beer
            </Col>
          </Row>
          { /* Temporary solution to fix the menu being hidden by the table. (menuPortalTarget and styles) */ }
          <Select
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            options={Array.from(beerNames).map((name) => ({ value: name, label: name })).sort((a, b) => a.label.localeCompare(b.label))}
            value={{ value: filters.name, label: filters.name }}
            onChange={(selectedOption) => {
              const selectedName: string = selectedOption ? selectedOption.value : ""
              handleFilterChange({ ...filters, name: selectedName });
            }}
            placeholder="Select Beer"
          />
        </Col>
        {/* Cans, bottles, and keg filters are disabled on this page for now.
        <Col xs={12} md={6} lg={3} xl={3}>
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
        */ }
        <Col xs={12} md={6} lg={3} xl={2}>
          <Row>
            <Col className={styles.filterHeading}>
              Options
            </Col>
          </Row>
          <Row>
            <Col className="p-0">
              <FilterButton width="100%" text="Subtract Deposit From Price" isEnabled={filters.subtractDeposit} onClick={() => handleFilterChange({...filters, subtractDeposit: !filters.subtractDeposit})}/>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} xl={11}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <MaterialReactTable
              key={tableKey}
              columns={columns}
              data={filteredData}
              enableColumnFilters={false}
              enablePagination={false}
              renderEmptyRowsFallback={() => <p className={styles.noSelectedBeerMessage}>Please select a beer above.</p>}
              initialState={{
                columnVisibility: {
                  deposit_price: filters.subtractDeposit,
                  dollars_per_drink_after_deposit: filters.subtractDeposit,
                  main_price: !filters.subtractDeposit,
                  dollars_per_drink: !filters.subtractDeposit,
                },
              }}
              enableHiding={false}
              enableTopToolbar={false}
              muiTableHeadCellColumnActionsButtonProps={{
                sx: {
                  display: 'none',
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  paddingRight: '0',
                }
              }}
              muiTableBodyCellProps={{
                sx: {
                  padding: '0 0 0 5px'
                }
              }}
              />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Value;
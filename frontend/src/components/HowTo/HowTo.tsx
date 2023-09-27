import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import PreviewCard from '../PreviewCard/PreviewCard';
import styles from './HowTo.module.css'
import beer from './beer.png';
import money from './money.png';

const HowTo: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToAll = () => {
    navigate('/all');
  };
  const handleNavigateToValue = () => {
    navigate('/value');
  };

  return (
    <Container className={styles.howTo}>
        <h2>How To Use Beer Boss</h2>
        <p>Beer Boss scrapes all the data from the official Ontario Beer Store website and finds the best prices. Beer Boss has two main tools:</p>
        <Row>
          <Col>
          <PreviewCard
            title="All Beer Prices" 
            description='This tool contains a table with every beer available from the Beer Store. The table is sorted by cost per serving of alcohol, so you can easily find the absolute cheapest beers.' 
            imageUrl={beer}
            clickHandler={handleNavigateToAll}
            />
          </Col>
        </Row>
        <Row>
          <Col>
          <PreviewCard
            title="Best Value Analyzer" 
            description='This tool allows you to find the most cost-effective way to buy your favourite beer. The table is sorted so the cheapest purchasing options appear at the top.' 
            clickHandler={handleNavigateToValue}
            imageUrl={money}/>
          </Col>
        </Row>
    </Container> 
  );
};

export default HowTo;

import React from 'react';
import styles from './LoadingSpinner.module.css';
import { Row, Col } from 'react-bootstrap';

const LoadingSpinner: React.FC = () => {
  return (
    <Row className="justify-content-center">
      <Col xs="auto">
        <div className={styles.loadingSpinner} />
      </Col>      
    </Row>
  );
};

export default LoadingSpinner;
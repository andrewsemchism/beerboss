import React, { useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import lottie from 'lottie-web';
import beerBanner from './beerBanner.json';
import styles from './Banner.module.css';


const Banner: React.FC = () => {

  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: animationContainer.current!,
      renderer: 'svg',
      autoplay: true,
      loop: false,
      animationData: beerBanner
    });

    return () => lottie.destroy();
  }, []);

  return (
    <div className={styles.mainBanner}>
      <Container fluid="xl">
        <Row className="justify-content-center">
          <Col xs={8} className="align-self-center">
            <h1>SAVE MONEY ON BEER FROM THE BEER STORE</h1>
            <Row className={`${styles.startNowButtonRow} justify-content-center`}>
              <Col className="d-flex justify-content-center">
                <button className={styles.startNowButton}>Start Now</button>
              </Col>
            </Row>
          </Col>
          <Col xs={4}>
            <div ref={animationContainer}></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Banner;

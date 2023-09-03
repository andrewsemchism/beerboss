import React from 'react';
import styles from './About.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GitHubButton from 'react-github-btn'

const About: React.FC = () => {
  return (
    <>
    <Container className={styles.about}>
      <Row className="justify-content-center">
        <Col>
          <h1>FAQ</h1>
        </Col>
      </Row>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is the purpose of this website? What can I do with it?</Accordion.Header>
          <Accordion.Body>
            <p>You can use this site to make smart purchasing decisions when buying from The Beer Store. This site makes it easy for you to compare beers, so you get the most bang for your buck! If you aren't picky about what you drink and want to get the most alcohol for the least amount of money, you can simply sort the 'All Beer Prices' table by 'Cost per serving of alcohol.'</p>
            
            <p>If you have your mind set on one particular beer, you can use the 'Best Value Analyzer' to determine what package size has the best value (larger packs are frequently the best value, but not always!).</p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>What is "Cost per serving of alcohol" in the table?</Accordion.Header>
          <Accordion.Body>
            Cost per serving of alcohol is the most important metric in determining beer value. Beer Boss makes it easy to find which beers have a very low cost per serving of alcohol. For the purposes of this website, one 'serving' is equivalent to the alcohol contained in a regular 5% can of beer (355ml with a 5% ABV). A standard drink contains about 17.75 ml of pure alcohol (355ml * 5% = 17.75ml). A 6 pack of 355ml cans of Budweiser costs $13.25. Budweiser has an ABV of 5%. So, the cost per drink for that pack is $2.21. Knowing the cost per serving of alcohol allows you to compare beers to find the best value options.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Why do I see the same beer name appearing multiple times on the 'All Beer Prices' page?</Accordion.Header>
          <Accordion.Body>
            The table lists every purchasing option available for every beer (24 pack, 6 pack, bottles, cans, etc.). This is why you will see the same beer name multiple times.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
    <Container className={styles.github}>
      <GitHubButton href="https://github.com/andrewsemchism" data-size="large" aria-label="Follow @andrewsemchism on GitHub">Follow @andrewsemchism</GitHubButton>
      <div></div>
      <GitHubButton href="https://github.com/andrewsemchism/beerboss/issues" data-icon="octicon-issue-opened" data-size="large" aria-label="Issue andrewsemchism/beerboss on GitHub">Issue</GitHubButton>
    </Container>
    </>
  );
}

export default About;

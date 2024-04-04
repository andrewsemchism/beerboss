import React, { useState } from 'react';
import { Navbar, Nav, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CustomNav.css';

const CustomNav: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>('');
  const [expanded, setExpanded] = useState(false);

  const handleNavLinkClick = (page: string) => {
    setExpanded(false);
    setActivePage(page);
    navigate('/' + page);
  };

  return (
    <>
      <Alert variant="danger" className="nav-alert" style={{ margin: 0, textAlign: 'center' }}>
        Prices <b>last updated March 19th, 2024</b>. The Beer Store has updated their website and the data scraping script is now broken. A fix is coming soon!
      </Alert>
      <Navbar id="beerNav" bg="dark" expand="lg" variant="dark" expanded={expanded}>
        <Navbar.Brand onClick={() => handleNavLinkClick('')}>BEER BOSS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarmenu" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="navbarmenu">
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link
                className={activePage === 'all' ? 'active' : ''}
                onClick={() => handleNavLinkClick('all')}
              >
                ALL BEER PRICES
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={activePage === 'value' ? 'active' : ''}
                onClick={() => handleNavLinkClick('value')}
              >
                BEST VALUE ANALYZER
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={activePage === 'about' ? 'active' : ''}
                onClick={() => handleNavLinkClick('about')}
              >
                ABOUT
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default CustomNav;

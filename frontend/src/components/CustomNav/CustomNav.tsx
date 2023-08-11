import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CustomNav.css'

const CustomNav: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>('');

  const handleNavLinkClick = (page: string) => {
    setActivePage(page);
    navigate('/' + page);
  };

  return (
    <Navbar id="beerNav" bg="dark" expand="lg" variant="dark">
      <Navbar.Brand onClick={() => handleNavLinkClick('')}>BEER BOSS</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarmenu" />
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
  );
  
};

export default CustomNav;

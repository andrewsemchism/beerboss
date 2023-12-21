import React from "react";
import Banner from "../Banner/Banner";
import HowTo from "../HowTo/HowTo";
import footer from "./footer.svg";
import BeerStats from "../BeerStats/BeerStats";

const Home: React.FC = () => {
  return (
    <>
      <Banner />
      <HowTo />
      <BeerStats />
      <img
        style={{
          marginTop: "50px",
          width: "100%",
          display: "block",
          position: "relative",
          bottom: "-1px",
        }}
        src={footer}
        alt=""
      />
      <div style={{ height: "50px", backgroundColor: "#3a4047" }}></div>
    </>
  );
};

export default Home;

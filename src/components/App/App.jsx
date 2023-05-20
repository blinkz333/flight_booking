import React, { useState, useEffect } from "react";

import Header from "../Header";

import STYLES from "./App.scss";
import { Button, Card, CardBody, CardColumns } from "reactstrap";

import { BsArrowRight } from "react-icons/bs";

const getClassName = (className) => STYLES[className] || "UNKNOWN";

const App = () => {
  const [agency, setagency] = useState([]);
  const [legs, setLegs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("data/flights.json");
    const { itineraries, legs } = await response.json();
    const sort_rating = itineraries.sort(
      (a, b) => b.agent_rating - a.agent_rating
    );

    setagency(sort_rating);
    setLegs(legs);
  };

  const _renderFlight = (legs_data) => {
    const mapped_legs = legs_data.legs_agent.map((items) => {
      const itineraries_legs = items;
      if (legs.length > 0) {
        const value = legs.find((items) => items.id === itineraries_legs);
        return value;
      }
    });
    return (
      <>
        {mapped_legs.length > 0 &&
          mapped_legs.map((items, index) => (
            <>
              <div key={index}>
                <img
                  width="25"
                  height="25"
                  src={`https://logos.skyscnr.com/images/airlines/favicon/${items?.airline_id}.png`}
                />
                <div className={getClassName("Box__time_start")}>
                  <div className={getClassName("Box__text_time")}>
                    {("0" + new Date(items?.departure_time).getHours()).slice(
                      -2
                    )}
                    :
                    {("0" + new Date(items?.departure_time).getMinutes()).slice(
                      -2
                    )}
                  </div>
                  <div className={getClassName("Box__text_location")}>
                    {items?.departure_airport}
                  </div>
                </div>

                <div className={getClassName("Box__arrow")}>
                  <BsArrowRight size={25} color="#c2c9cd" strokeWidth="2" />
                </div>

                <div className={getClassName("Box__time_arrival")}>
                  <div className={getClassName("Box__text_time")}>
                    {("0" + new Date(items?.arrival_time).getHours()).slice(-2)}
                    :
                    {("0" + new Date(items?.arrival_time).getMinutes()).slice(
                      -2
                    )}
                  </div>
                  <div className={getClassName("Box__text_location")}>
                    {items?.arrival_airport}
                  </div>
                </div>
                <div className={getClassName("Box__cal_time")}>
                  <div className={getClassName("Box__text_cal")}>{`${Math.floor(
                    items?.duration_mins / 60
                  )}h ${items?.duration_mins % 60 < 10 ? "0" : ""}${
                    items?.duration_mins % 60
                  }`}</div>
                  {items?.stops === 0 ? (
                    <div className={getClassName("Box__text_condition")}>
                      Direct
                    </div>
                  ) : (
                    <div className={getClassName("Box__text_condition_stop")}>
                      {items?.stops} Stop
                    </div>
                  )}
                </div>
              </div>
              <br />
            </>
          ))}
      </>
    );
  };

  return (
    <>
      <div className={getClassName("App")}>
        <Header />
        <main className={getClassName("App__main")}>
          <CardColumns>
            {agency.length > 0 &&
              agency.map((items, key) => (
                <>
                  <Card key={key}>
                    <CardBody>
                      <_renderFlight legs_agent={items.legs} />
                      <br />
                      <div className={getClassName("App__price")}>
                        <div className={getClassName("App__price_text")}>
                          {items.price}
                        </div>
                        <div className={getClassName("App__agent_contact")}>
                          {items.agent}
                        </div>
                      </div>
                      <div>
                        <Button className={getClassName("App__button")}>
                          Select
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                  <br />
                </>
              ))}
          </CardColumns>
        </main>
      </div>
    </>
  );
};

export default App;

import React from "react";
import "./App.css";
import useCharts from "./Charts";

import useCasesBiz from "./Hooks/CasesBiz";

const renderIndicator = (biz) => {
  if (biz.type === 2) return null;
  let colors = ["orange", "red", "green", "blue"];
  return (
    <div className="container">
      <div className="color-indicater">
        <div className="indicator-wrap">
          <div className="indicator" style={{ background: colors[0] }} />
          <div>Confirmed</div>
        </div>
        <div className="indicator-wrap">
          <div className="indicator" style={{ background: colors[1] }} />
          <div>Deaths</div>
        </div>
        <div className="indicator-wrap">
          <div className="indicator" style={{ background: colors[2] }} />
          <div>Recoverd</div>
        </div>
        <div className="indicator-wrap">
          <div className="indicator" style={{ background: colors[3] }} />
          <div>Active</div>
        </div>
      </div>
    </div>
  );
};

function App(props) {
  let biz = useCasesBiz(props);
  let Charts = useCharts(props);

  if (biz.loading) {
    return (
      <div className="App">
        <header className="App-header">
          <p>loading ....</p>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <div className="grid-wrap">
            <div className="side-bar">
              <div className="buttons-wrap">
                <div>
                  <button
                    className={`${biz.type === 0 && `active`}`}
                    onClick={() => biz.setType(0)}
                  >
                    Line
                  </button>
                </div>
                <div>
                  <button
                    className={`${biz.type === 1 && `active`}`}
                    onClick={() => biz.setType(1)}
                  >
                    Bar
                  </button>
                </div>
                <div>
                  <button
                    className={`${biz.type === 2 && `active`}`}
                    onClick={() => biz.setType(2)}
                  >
                    Pie
                  </button>
                </div>
              </div>
              <p className="align-left">Country</p>
              <div className="country-select-wrap">
                <select
                  value={biz.country}
                  onChange={(e) => biz.setCountry(e.target.value)}
                >
                  {biz.countries.map((country, i) => {
                    return (
                      <option key={i} value={country.slug}>
                        {country.Country}
                      </option>
                    );
                  })}
                </select>
              </div>
              {biz.type !== 0 && (
                <>
                  <p className="align-left">Date and Time</p>
                  <div className="country-select-wrap">
                    <select
                      id="date-select"
                      value={biz.dateIndex}
                      onChange={(e) => {
                        document.getElementById("multi-bar").innerHTML = "";
                        document.getElementById("pie").innerHTML = "";
                        biz.setDateIndex(e.target.value);
                      }}
                    >
                      {biz.cases.map((caseItem, i) => {
                        if (caseItem.Date) {
                          let displayDate = caseItem.Date + "";
                          displayDate = displayDate
                            .split("T")
                            .join(` - `)
                            .replace("Z", "");

                          return (
                            <option key={i} value={i}>
                              {displayDate}
                            </option>
                          );
                        }
                        return null;
                      })}
                    </select>
                  </div>
                </>
              )}
              <div>
                <img
                  className="virus"
                  src="https://i.ibb.co/pnGvz9J/pngfuel-com.png"
                />
                <p className="quote">COVID-19</p>
              </div>
            </div>

            <div className="chart-wrap">
              {renderIndicator(biz)}
              <div
                id="multi-line"
                style={{ display: biz.type === 0 ? "block" : "none" }}
              >
                {biz.cases.length > 0 && Charts.drawMultilineChart(biz.cases)}
              </div>

              <div
                id="multi-bar"
                style={{ display: biz.type === 1 ? "block" : "none" }}
              >
                {biz.cases.length > 0 &&
                  biz.type === 1 &&
                  Charts.drawMultiBarChart(biz.cases, biz.dateIndex)}
              </div>

              <div
                id="pie"
                style={{ display: biz.type === 2 ? "block" : "none" }}
              >
                {biz.cases.length > 0 &&
                  biz.type === 2 &&
                  Charts.drawPieChart(biz.cases, biz.dateIndex)}
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;

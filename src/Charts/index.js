import * as d3 from "d3";

export default function useCharts() {
  const drawMultilineChart = (dataPassed) => {
    let margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let valueline = d3
      .line()
      .x(function (d) {
        return x(d.Date);
      })
      .y(function (d) {
        return y(d.Confirmed);
      });

    let valueline2 = d3
      .line()
      .x(function (d) {
        return x(d.Date);
      })
      .y(function (d) {
        return y(d.Deaths);
      });

    let valueline3 = d3
      .line()
      .x(function (d) {
        return x(d.Date);
      })
      .y(function (d) {
        return y(d.Recovered);
      });

    let valueline4 = d3
      .line()
      .x(function (d) {
        return x(d.Date);
      })
      .y(function (d) {
        return y(d.Active);
      });

    let parseTime = d3.timeParse("%Y-%m-%d");

    function make_x_gridlines() {
      return d3.axisBottom(x).ticks(10);
    }

    function make_y_gridlines() {
      return d3.axisLeft(y).ticks(10);
    }

    function draw(data) {
      data.forEach(function (d) {
        let date = new Date(d.Date);
        date =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();
        d.Date = +parseTime(date);
        d.Confirmed = +d.Confirmed;
        d.Deaths = +d.Deaths;
        d.Recovered = +d.Recovered;
        d.Active = +d.Active;
      });

      data.sort(function (a, b) {
        return a["Date"] - b["Date"];
      });

      x.domain(
        d3.extent(data, function (d) {
          return d.Date;
        })
      );
      y.domain([
        0,
        d3.max(data, function (d) {
          return Math.max(d.Confirmed, d.Deaths, d.Recovered);
        }),
      ]);

      let svg = d3
        .select("#multi-line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .attr("class", "grid")
        .call(make_y_gridlines().tickSize(-width).tickFormat(""));

      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines().tickSize(-height).tickFormat(""));
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg
        .append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

      svg
        .append("path")
        .data([data])
        .attr("class", "line2")
        .attr("d", valueline2);

      svg
        .append("path")
        .data([data])
        .attr("class", "line3")
        .attr("d", valueline3);

      svg
        .append("path")
        .data([data])
        .attr("class", "line4")
        .attr("d", valueline4);

      svg.append("g").call(d3.axisLeft(y));
    }

    document.getElementById("multi-line") &&
      !document.getElementById("multi-line").childElementCount &&
      draw(dataPassed);
  };

  const drawMultiBarChart = (data, index) => {
    data = data[index];

    if (
      document.getElementById("multi-bar") &&
      !document.getElementById("multi-bar").childElementCount
    ) {
      data = [
        { name: "Confirmed", value: data.Confirmed },
        { name: "Death", value: data.Deaths },
        { name: "Recoverd", value: data.Recovered },
        { name: "Active", value: data.Active },
      ];
      let margin = { top: 30, right: 0, bottom: 30, left: 40 };
      let height = 500;
      let width = 800;
      let colors = ["#fcba03", "#f44336", "#4caf50", "#304ffe"];
      let yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, data.format))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .append("text")
              .attr("x", -margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(data.y)
          );
      let xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .tickFormat((i) => data[i].name)
            .tickSizeOuter(0)
        );

      let y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      let x = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      let svg = d3
        .select("#multi-bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => y(d.value))
        .attr("fill", (_, i) => colors[i])
        .attr("height", (d) => y(0) - y(d.value))
        .attr("width", x.bandwidth());

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);
    }
  };

  const drawPieChart = (dataPassed, index) => {
    dataPassed = dataPassed[index];

    if (
      document.getElementById("pie") &&
      !document.getElementById("pie").childElementCount
    ) {
      let svg = d3
        .select("#pie")
        .append("svg")
        .attr("width", 800)
        .attr("height", 500)
        .append("g");

      svg.append("g").attr("class", "slices");
      svg.append("g").attr("class", "labels");
      svg.append("g").attr("class", "lines");
      let width = 800;
      let height = 500;
      let radius = Math.min(width, height) / 2;
      let color = ["#fcba03", "#f44336", "#304ffe", "#4caf50"];
      let labels = ["Confirmed", "Deaths", "Active", "Recoverd"];
      let data = [
        dataPassed.Confirmed,
        dataPassed.Deaths,
        dataPassed.Active,
        dataPassed.Recovered,
      ];

      let pie = d3
        .pie()
        .sort(null)
        .value((d) => d);
      let arc = d3
        .arc()
        .innerRadius(radius * 0.8)
        .outerRadius(radius * 0.6);

      let outerArc = d3
        .arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9);

      svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      svg
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color[i]);
      svg.append("g").classed("labels", true);
      svg.append("g").classed("lines", true);

      svg
        .select(".lines")
        .selectAll("polyline")
        .data(pie(data))
        .enter()
        .append("polyline")
        .attr("points", function (d) {
          var pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos];
        });

      svg
        .select(".labels")
        .selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .html(function (d) {
          return `(${d.data}) - ${labels[d.index]}`;
        })
        .attr("transform", function (d) {
          //
          var pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        })
        .style("text-anchor", function (d) {
          //
          return midAngle(d) < Math.PI ? "start" : "end";
        });

      svg
        .append("text")
        .attr("class", "toolCircle")
        .attr("dy", -15)
        .html("COVID-19")
        .style("font-size", ".9em")
        .style("text-anchor", "middle");

      function midAngle(d) {
        //
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }
    }
  };
  return { drawMultilineChart, drawMultiBarChart, drawPieChart };
}

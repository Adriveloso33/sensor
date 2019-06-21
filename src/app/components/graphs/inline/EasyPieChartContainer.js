import React from "react";

import ReactDOM from "react-dom";

import "smartadmin-plugins/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js";

export default class EasyPieChartContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chart = false;

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    let element = $(this.refs.chart).find(".easy-pie-chart")[0];
    let chart = $(element);
    this.chart = chart;

    let barColor = chart.css("color") || chart.data("pie-color"),
      trackColor = chart.data("pie-track-color") || "rgba(255,255,255,0.5)",
      size = parseInt(chart.data("pie-size")) || 25;

    chart.easyPieChart({
      barColor: barColor,
      trackColor: trackColor,
      scaleColor: false,
      lineCap: "butt",
      // lineWidth: parseInt(size / 8.5),
      lineWidth: 3,
      animate: 1500,
      rotate: -90,
      size: size
    });

    this.update();
  }

  update() {
    let element = $(this.refs.chart).find(".easy-pie-chart")[0];
    let chart = $(element).find(".percent");
    let span = $(chart[0]);

    let value = this.props.value;
    let max = this.props.max;
    var newValue = parseInt((value * 100) / max);
    //var newValue = value;

    /* improve this */
    if (this.chart) {
      this.chart.data("easyPieChart").disableAnimation();
      this.chart.data("easyPieChart").update(0);

      this.chart.data("easyPieChart").enableAnimation();
      this.chart.data("easyPieChart").update(value);
    }
    span.text(value);
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {
    if (!this.props.noUpdate) this.update();
  }

  render() {
    return (
      <div ref="chart" className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

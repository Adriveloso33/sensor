const spline = {
  title: {
    text: 'VoLTE SCORE',
    style: {
      color: '#fff'
    }
  },
  subtitle: {
    text: 'VoLTE SCORE',
    style: {
      color: '#fff'
    }
  },
  chart: {
    type: 'spline',
    zoomType: 'xy',
    backgroundColor: null,
    resetZoomButton: {
      position: {
        x: 0,
        y: -50
      }
    }
  },
  tooltip: {
    shared: true,
    crosshairs: true
  },
  legend: {
    enabled: true,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    itemHoverStyle: {
      color: 'rgba(255,255,255,0.5)'
    }
  },
  xAxis: [
    {
      title: {
        text: null,
        style: {}
      },
      type: 'datetime',
      labels: {
        format: '{value:%Y/%m/%d}',
        rotation: -45,
        style: {
          color: 'rgba(255,255,255,1)'
        }
      },
      tickAmount: undefined,
      gridLineWidth: 0,
      crosshair: false
    }
  ],
  yAxis: [
    {
      title: {
        text: null,
        style: {}
      },
      labels: {
        style: {
          color: 'rgba(255,255,255,1)'
        }
      },
      gridLineColor: 'rgba(255,255,255,0.5)',
      crosshair: false,
      tickAmount: 5,
      plotLines: null
    },
    {
      title: {
        text: null,
        style: {}
      },
      labels: {
        style: {
          color: 'rgba(255,255,255,0.5)'
        }
      },
      min: 0,
      gridLineColor: 'rgba(255,255,255,0.5)',
      crosshair: false,
      tickAmount: 5,
      plotLines: null,
      opposite: true
    }
  ],
  plotOptions: {
    series: {
      cursor: 'pointer',
      marker: {
        lineWidth: 1
      }
    },
    column: {
      pointWidth: null
    },
    line: {
      enableMouseTracking: false,
      allowPointSelect: false,
      marker: {
        enabled: false
      },
      zIndex: -1
    }
  },
  lang: {
    noData: 'No data'
  },
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#fff'
    }
  },
  series: [],
  exporting: {
    fallbackToExportServer: false,
    buttons: {
      contextButton: {
        symbolStroke: '#fff',
        theme: {
          stroke: null,
          states: {
            hover: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: '#fff'
            },
            select: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }
    }
  }
};

const column = {
  title: {
    text: 'VoLTE Score',
    style: {
      color: '#fff'
    }
  },
  chart: {
    type: 'column',
    zoomType: 'xy',
    backgroundColor: null,
    resetZoomButton: {
      position: {
        // align: 'right', // by default
        // verticalAlign: 'top', // by default
        x: 0,
        y: -50
      }
    }
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    labelFormatter: function() {
      let { name } = this;
      let color = 'rgba(255,255,255,1)';

      switch (name) {
        case 'Acc VoLTE':
          color = 'rgba(255,255,255,0.5)';
          break;
        default:
          break;
      }
      return `<span style="color: ${color}">${name}</span>`;
    },
    itemHoverStyle: {
      color: 'rgba(255,255,255,0.5)'
    }
  },
  lang: {
    noData: 'There is no data for the graph.'
  },
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#303030'
    }
  },
  xAxis: [
    {
      title: {
        text: null,
        style: {}
      },
      type: 'datetime',
      //  tickInterval: 24 * 3600 * 1000,
      labels: {
        format: '{value:%e/%m/%Y}',
        rotation: -45,
        style: {
          color: 'rgba(255,255,255,1)'
        }
      },
      //tickAmount: undefined,
      gridLineWidth: 0,
      crosshair: false
    }
  ],
  yAxis: [
    {
      title: {
        text: null,
        style: {}
      },
      labels: {
        style: {
          color: 'rgba(255,255,255,1)'
        }
      },
      min: 0,
      max: 100,
      gridLineColor: 'rgba(255,255,255,0.5)',
      crosshair: false,
      tickAmount: 5,
      plotLines: null
    },
    {
      title: {
        text: null,
        style: {}
      },
      labels: {
        style: {
          color: 'rgba(255,255,255,0.5)'
        }
      },
      min: 0,
      gridLineColor: 'rgba(255,255,255,0.5)',
      crosshair: false,
      tickAmount: 5,
      plotLines: null,
      opposite: true
    }
  ],
  plotOptions: {
    series: {
      cursor: 'pointer',
      events: {
        click: function(event) {}
      }
    },
    column: {
      border: 0,
      borderWidth: 0,
      pointPadding: 0.2,
      shadow: true,
      pointWidth: null
    }
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true
  },
  series: [],
  exporting: {
    fallbackToExportServer: false,
    buttons: {
      contextButton: {
        symbolStroke: '#fff',
        theme: {
          stroke: null,
          states: {
            hover: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: '#fff'
            },
            select: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }
    }
  }
};

const pie = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
    backgroundColor: null,
    options3d: {
      enabled: true,
      alpha: 45
    }
  },
  title: {
    text: false,
    style: {
      color: 'rgba(255, 255, 255, 1)'
    }
  },
  legend: {
    enabled: true,
    itemStyle: {
      color: 'rgba(255, 255, 255, 1)',
      fontWeight: 'bold'
    },
    itemHoverStyle: {
      color: 'rgba(0, 191, 255,0.5)'
    }
  },
  tooltip: {
    //  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      innerSize: 100,
      depth: 45,
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        color: 'rgba(255, 255, 255, 1)',
        connectorWidth: 3
      },
      showInLegend: true
    },
    series: {
      turboThreshold: 0
    }
  },
  series: [],
  exporting: {
    fallbackToExportServer: false,
    buttons: {
      contextButton: {
        symbolStroke: '#fff',
        theme: {
          stroke: null,
          states: {
            hover: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: '#fff'
            },
            select: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }
    }
  }
};

const stacked = {
  chart: {
    type: 'area',
    backgroundColor: null
  },
  title: {
    text: 'Historic and Estimated Worldwide Population Growth by Region',
    style: {
      color: 'rgba(255, 255, 255, 1)'
    }
  },
  subtitle: {
    text: 'Source: Wikipedia.org',
    style: {
      color: 'rgba(255, 255, 255, 1)'
    }
  },
  xAxis: {
    tickmarkPlacement: 'on',
    title: {
      enabled: false
    }
  },
  yAxis: [
    {
      title: {
        text: 'Billions'
      },
      labels: {
        formatter: function() {
          return this.value / 1000;
        }
      }
    }
  ],
  legend: {
    itemStyle: {
      color: 'rgba(255, 255, 255, 1)',
      fontWeight: 'bold'
    },
    itemHoverStyle: {
      color: 'rgba(0, 191, 255,0.5)'
    }
  },
  tooltip: {
    split: true,
    valueSuffix: ' millions'
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      lineColor: '#666666',
      lineWidth: 1,
      marker: {
        lineWidth: 1,
        lineColor: '#666666'
      }
    }
  },
  series: []
};

const areaspline = {
  title: {
    text: false,
    style: {
      color: '#000000'
    }
  },
  fillColor: '#91C1EF',
  subtitle: {
    text: false,
    style: {
      color: '#000000'
    }
  },
  chart: {
    type: 'areaspline',
    zoomType: 'xy',
    backgroundColor: null
  },
  tooltip: {
    shared: true,
    crosshairs: true
  },
  legend: {},
  xAxis: [
    {
      title: {
        text: null
      },
      type: null,
      dateTimeLabelFormats: {
        day: '%e. %b',
        month: "%b '%y",
        year: '%Y'
      },
      lineColor: 'rgba(0,0,0,0.3)',
      gridLineColor: 'rgba(0,0,0,0.1)',
      tickColor: 'rgba(0,0,0,0.3)',
      tickAmount: null,
      gridLineWidth: 0,
      labels: {
        format: null,
        rotation: 0,
        style: {}
      }
    }
  ],
  yAxis: [
    {
      title: {
        text: null,
        style: {
          color: '#000000'
        }
      },
      labels: {
        style: {}
      },
      gridLineColor: 'rgba(0,0,0,0.1)',
      crosshair: false,
      tickAmount: null,
      plotLines: null
    }
  ],
  plotOptions: {
    areaspline: {
      fillOpacity: 0.5
    },
    series: {
      cursor: 'pointer',
      point: {
        events: {
          click: function(e) {
            alert(this.x);
          }
        }
      },
      marker: {
        enabled: false,
        lineWidth: 1
      },
      threshold: 0,
      negativeColor: '#FF0000'
    },
    column: {
      pointWidth: null
    }
  },
  series: [],
  colors: ['#00FF00', '#FF0000', '#0000FF', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
};

const solidgauge = {
  chart: {
    type: 'solidgauge',
    backgroundColor: '#FFFFFF'
  },
  title: {
    text: false,
    style: {
      color: '#000000'
    }
  },
  subtitle: {
    text: false,
    style: {
      color: '#000000'
    }
  },
  pane: {
    center: ['50%', '50%'],
    size: '100%',
    startAngle: 0,
    endAngle: 360,
    background: {
      backgroundColor: '#EEE',
      innerRadius: '60%',
      outerRadius: '100%',
      shape: 'arc'
    }
  },
  tooltip: {
    enabled: false
  },
  legend: {},
  plotOptions: {
    series: {
      threshold: 0,
      negativeColor: '#FF0000'
    },
    column: {
      pointWidth: null
    }
  },
  xAxis: [
    {
      title: {
        text: null,
        style: {}
      },
      type: null,
      dateTimeLabelFormats: {
        day: '%e. %b',
        month: "%b '%y",
        year: '%Y'
      },
      labels: {
        rotation: 0
      },
      tickAmount: undefined,
      gridLineWidth: 0,
      crosshair: false
    }
  ],
  yAxis: [
    {
      stops: [
        [0.1, '#55BF3B'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16
      },
      min: 0,
      max: 200,
      title: {
        text: 'Speed'
      }
    }
  ],
  series: [],
  colors: ['#00FF00', '#FF0000', '#0000FF', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
};

const column3d = {
  chart: {
    type: 'column',
    backgroundColor: null,
    options3d: {
      enabled: true,
      alpha: 10,
      beta: 15,
      depth: 50,
      viewDistance: 25
    }
  },
  title: {
    text: 'Chart rotation demo'
  },
  subtitle: {
    text: 'Test options by dragging the sliders below'
  },
  plotOptions: {
    column: {
      depth: 25
    }
  },
  series: []
};

const polar = {
  chart: {
    polar: true,
    type: 'line',
    backgroundColor: null
  },

  title: {
    text: 'Budget vs spending',
    x: -80
  },

  pane: {
    size: '80%',
    lineColor: '#000'
  },

  xAxis: [
    {
      categories: ['Sales', 'Marketing', 'Development'],
      tickmarkPlacement: 'on',
      lineWidth: 0
    }
  ],

  yAxis: [
    {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      lineColor: '#000'
    }
  ],
  plotOptions: {},
  tooltip: {
    shared: true,
    pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
  },

  legend: {
    align: 'right',
    verticalAlign: 'top',
    y: 70,
    layout: 'vertical'
  },

  series: []
};

const heatmap = {
  chart: {
    type: 'heatmap',
    backgroundColor: false,
    marginTop: 100,
    spacingBottom: 65
  },

  boost: {
    useGPUTranslations: true
  },

  title: {
    text: 'Highcharts heat map',
    align: 'left',
    x: 40
  },

  subtitle: {
    text: 'Temperature variation by day and hour through 2013',
    align: 'left',
    x: 40
  },
  legend: {
    enabled: true,
    align: 'center',
    margin: 0,
    layout: 'horizontal',
    verticalAlign: 'top'
  },
  xAxis: {
    type: 'datetime',
    min: Date.UTC(2013, 0, 1),
    max: Date.UTC(2014, 0, 1),
    labels: {
      align: 'left',
      x: 5,
      y: 14,
      format: '{value:%B}' // long month
    },
    showLastLabel: false,
    tickLength: 16
  },

  yAxis: {
    title: {
      text: null
    },
    labels: {
      format: '{value}:00'
    },
    minPadding: 0,
    maxPadding: 0,
    startOnTick: false,
    endOnTick: false,
    tickPositions: [0, 6, 12, 18, 24],
    tickWidth: 1,
    min: 0,
    max: 23,
    reversed: true
  },

  colorAxis: {
    stops: [[0, '#3060cf'], [0.5, '#fffbbc'], [0.9, '#c4463a'], [1, '#c4463a']],
    min: -15,
    max: 25,
    startOnTick: false,
    endOnTick: false,
    labels: {
      format: '{value}℃'
    }
  }
};

const pressets = {
  spline: spline,
  column: column,
  solidgauge: solidgauge,
  areaspline: areaspline,
  pie: pie,
  stacked: stacked,
  column3d: column3d,
  polar: polar,
  heatmap: heatmap
};

export default pressets;

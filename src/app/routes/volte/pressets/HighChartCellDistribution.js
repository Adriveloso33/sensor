const column = {
  title: {
    text: 'VoLTE SCORE',
    style: {
      color: '#fff',
    },
  },
  subtitle: {
    text: 'VoLTE SCORE',
    style: {
      color: '#fff',
    },
  },
  chart: {
    type: 'column',
    zoomType: 'xy',
    backgroundColor: null,
  },
  tooltip: {
    shared: true,
    crosshairs: true,
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    itemHoverStyle: {
      color: 'rgba(255,255,255,0.5)',
    },
  },
  xAxis: [
    {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          color: 'rgba(255,255,255,1)',
        },
      },
      tickAmount: undefined,
      gridLineWidth: 0,
      crosshair: false,
    },
  ],
  yAxis: [
    {
      title: {
        text: null,
        style: {},
      },
      labels: {
        style: {
          color: 'rgba(255,255,255,1)',
        },
      },
      gridLineColor: 'rgba(255,255,255,0.5)',
      crosshair: false,
      tickAmount: 5,
      plotLines: null,
    },
    {
      title: {
        text: null,
        style: {},
      },
      labels: {
        style: {
          color: 'rgba(255,255,255,0.5)',
        },
      },
      min: 0,
      gridLineColor: 'rgba(255,255,255,0.5)',
      crosshair: false,
      tickAmount: 5,
      plotLines: null,
      opposite: true,
    },
  ],
  plotOptions: {
    series: {
      cursor: 'pointer',
      borderWidth: 0,
      marker: {
        lineWidth: 1,
      },
    },
    column: {
      pointWidth: null,
    },
  },
  lang: {
    noData: 'Add some KPI from the table.',
  },
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#fff',
    },
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
              stroke: '#fff',
            },
            select: {
              fill: 'rgba(18, 47, 51, 0.2)',
              stroke: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
    },
  },
};

const pressets = {
  column: column,
};

export default pressets;

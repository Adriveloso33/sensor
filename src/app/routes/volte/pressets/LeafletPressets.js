const geojson = {
  center: [23.059405, -101.953574],
  zoom: 4,
  zoomControl: true,
  minZoom: 4,
  maxZoom: 15,
  attributionControl: false,
  mapLayers: [
    {
      type: 'geojson',
      url: 'assets/maps/discovery/mex.geojson',
      options: {
        dataType: 'json',
        styles: {
          default: {
            weight: 1,
            color: 'white',
            opacity: 1,
            fillColor: 'grey',
            fillOpacity: 0.5,
          },
          mouseover: {
            weight: 2,
            color: 'white',
            // fillColor: 'green',
            dashArray: '',
            fillOpacity: 0.8,
          },
          click: {
            weight: 2,
            color: 'white',
            fillColor: 'yellow',
            dashArray: '',
            fillOpacity: 0.7,
          },
        },
      },
    },
  ],
  mapEvents: {
    click: null,
    dblclick: null,
  },
};

const pressets = {
  geojson: geojson,
};

export default pressets;

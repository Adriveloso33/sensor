import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';
import Loader from '../../../../components/dashboards/components/Loader';
import { checkAuthError } from '../../../../components/auth/actions';
import LeafletMap from 'wdna-leaflet';
import NoData from '../../../../components/dashboards/components/NoData';

import Auth from '../../../../components/auth/Auth';
import pressets from '../../pressets/LeafletPressets';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

 

const iconsUrl = 'assets/img/icons/maps/entropy';
const mapKpi = 'VOLTE_CQI';

export default class MainMap extends React.Component {
  constructor(props) {
    super(props);

    this.map = null;
    this.pid = getStr();

    this.state = {
      options: false,
      threshold: false,
      alias: false,
      loading: false
    };
  }

  componentDidMount() {
    this.exportFunctions();
  }

  componentWillReceiveProps(nextProps, nextContex) {
    if (nextContex != this.context) {
      let nextState = nextContex.parentState || {};
      let currentState = this.context.parentState || {};

      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(this.parseFilterData(nextState.mainFilter));
      }
    }
  }

  exportFunctions = () => {
    this.context.updateParent({
      mapFlyToMarker: this.mapFlyToMarker
    });
  };

  parseFilterData = (mainFilter) => {
    let filter = _.cloneDeep(mainFilter);
    const kpi = filter.arrOrderBy[0].id;

    // filter.arrFilterDate[0].date1 = filter.arrFilterDate[0].date2;
    filter.aaKpiCounters = [`${kpi}`];

    return filter;
  };

  /**
   * Get and set map data from the server
   */
  setData = (filter) => {
    let { url } = this.props || {};
    if (!url) return;

    this.startLoading();
    this.clearMapData(() => {
      axios
        .post(
          url,
          {
            api_token: Auth.getToken(),
            ...filter
          },
          { cancelToken: source.token }
        )
        .then((resp) => {
          let { data } = resp;

          if (data) {
            this.setState({
              data: data.data,
              alias: data.alias,
              options: this.getOptions(data, data.alias),
              threshold: data.threshold
            });
          }
          this.finishLoading();
        })
        .catch((err) => {
          this.finishLoading();
          if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving map data');
        });
    });
  };

  getRegionValue = (regionName, kpi) => {
    let { data } = this.state;
    let { parentState } = this.context || {};
    let { mainFilter } = parentState || {};
    let date = mainFilter.date || moment().format('YYYY-MM-DD');
    let value = null;

    data &&
      data.forEach((row) => {
        let { REGION, DATE } = row;
        let kpiValue = row[mapKpi];

        if (REGION === regionName && DATE == date) {
          value = kpiValue;
        }
      });

    return value;
  };

  getRegionColor = (regionName, kpi) => {
    let { threshold } = this.state;
    let value = this.getRegionValue(regionName);
    let regionColor = null;

    if (threshold[kpi]) {
      let ranges = threshold[kpi];

      ranges &&
        ranges.forEach((r) => {
          let { min, max, color } = r;

          if (min && max && value >= min && value <= max) regionColor = color;
          if (!min && value <= max) regionColor = color;
          if (!max && value >= min) regionColor = color;
        });
    }

    return regionColor || '';
  };

  getFeatureName = (feature) => {
    let regionName = feature.properties.name;

    let value = this.getRegionValue(regionName, mapKpi) || 0;

    return `${regionName} - ${value.toFixed(1)}%`;
  };

  _onEachFeature = (feature, layer, map) => {
    layer.bindTooltip(this.getFeatureName(feature)).addTo(map);
  };

  _setRegionColors = (feature) => {
    let regionName = feature.properties.name;
    let color = this.getRegionColor(regionName, mapKpi) || '';

    return {
      weight: 1,
      color: 'white',
      opacity: 1,
      fillColor: color,
      fillOpacity: 0.8
    };
  };

  getMapPopupBody = (marker, alias) => {
    let { data } = marker || {};
    let pBody = '';

    data &&
      data.forEach((kpi) => {
        let { variable, value } = kpi;

        pBody = `${pBody} <p>${this.parseKpiName(variable, alias)}: ${value}</p>`;
      });

    return `<b>${marker.title}</b> <p>${pBody}</p>`;
  };

  mapFlyToMarker = (markerTitle) => {
    let { options } = this.state;
    let { map } = this;
    let point = false;

    if (options.mapMarkers) {
      let markers = options.mapMarkers;

      markers &&
        markers.forEach((marker) => {
          if (marker.options && marker.options.title == markerTitle) {
            point = marker.point;
          }
        });
    }

    if (point && map) map.flyTo(point, 12);
  };

  parseKpiName = (kpi, alias) => {
    if (alias && alias[kpi]) return alias[kpi];

    return kpi;
  };

  /**
   * Map options
   */
  getOptions = (data, alias) => {
    let options = _.cloneDeep(pressets['geojson']);

    options.mapMarkers = [];

    // Iterate over all data and set the markers
    let { point } = data || {};
    point &&
      point.forEach((marker) => {
        options.mapMarkers.push({
          point: marker.point,
          popup: this.getMapPopupBody(marker, alias),
          options: {
            icon: {
              iconUrl: `${iconsUrl}/marker_tower_corp.png`,
              iconSize: [30, 30]
            },
            title: marker.title
          }
        });
      });

    return options;
  };

  /**
   * Returns true or false if the map has some relevant data
   */
  mapHasSomeData = (mapOptions) => {
    if (!mapOptions) return false;

    if (mapOptions.mapMarkers && mapOptions.mapMarkers.length > 0) return true;

    return false;
  };

  mapInstance = (map, id) => {
    this.map = map;
    this.id = id;

    // set maps bounds to Mexico
    var southWest = [35.947152, -119.945623],
      northEast = [13.441082, -86.101378];

    // set bounds
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.panInsideBounds(bounds);

    this.finishLoading();
  };

  clearMapData = (cb) => {
    this.setState(
      {
        data: false,
        options: false,
        threshold: false
      },
      () => {
        if (typeof cb === 'function') cb();
      }
    );
  };

  startLoading = () => {
    this.setState({
      loading: true
    });

    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false
    });

    store.dispatch(finishProcess(this.pid));
  };

  render() {
    let { options, loading } = this.state;
    let { props } = this;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        editbutton={false}
        fullscreenbutton={true}
        colorbutton={false}
        deletebutton={false}
        custombutton={true}
      >
        <header>
          <span className="widget-icon">
            <i className="fa fa-map-marker" />
          </span>
          <h2>{props.title}</h2>
        </header>
        <div className="widget-body">
          <Loader show={loading} />
          <NoData show={!loading && !this.mapHasSomeData(options)} text={'No GEO information.'} />
          {options &&
            this.mapHasSomeData(options) && (
              <LeafletMap
                type="2d"
                options={this.state.options}
                markersMode="cluster"
                onEachFeature={this._onEachFeature}
                mapInstance={this.mapInstance}
              />
            )}
        </div>
      </JarvisWidget>
    );
  }
}

MainMap.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired
};

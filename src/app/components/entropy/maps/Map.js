import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';

import Loader from '../../../../components/dashboards/components/Loader';

import LeafletMap from 'wdna-leaflet';
import { checkAuthError } from '../../../../components/auth/actions';
import Auth from '../../../../components/auth/Auth';
import pressets from '../../pressets/LeafletDashboard';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

import { getParentItem } from '../../../../helpers/GlobalHelper';
import { getDateColumnId, getColumnIdbyAlias } from '../../../../helpers/TableHelper';

const iconsUrl = 'assets/img/icons/maps/entropy';

export default class MainMap extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      options: false,
      threshold: false,
      data: false,
      alias_id: false,
      alias: false,
      element: false,
      mapKpi: false,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      /* Map listen states */

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(nextState.mainFilter);
      }
    }
  }

  /**
   * Get and set map data from the server
   */
  setData = (filter) => {
    let { url } = this.props || {};
    if (!url) return;

    this.startLoading();
    axios
      .post(
        url,
        {
          api_token: Auth.getToken(),
          ...filter,
        },
        {
          cancelToken: source.token,
        }
      )
      .then((resp) => {
        let { data } = resp;
        this.setState({
          data: data.data,
          options: this.getOptions(data),
          threshold: data.threshold,
          alias: data.alias,
          alias_id: data.alias_id,
          mapKpi: this.getColIdToRepresent(data),
        });
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving map data');
      });
  };

  getMainFilterState = () => {
    const mainFilter = getParentItem(this, 'mainFilter');

    return mainFilter || {};
  };

  getColumnIdbyAlias = (alias) => {
    let colId = '';
    const { alias_id } = this.state || {};

    for (let key in alias_id) {
      let value = alias_id[key];
      if (value === alias) colId = key;
    }

    return colId;
  };

  getColumnIdbyDate = () => {
    const mainFilter = this.getMainFilterState();
    const { groupDateTime } = mainFilter || {};
    let colId = 'DATE';

    switch (groupDateTime) {
      case '7d':
        colId = 'WEEK';
        break;
      case '30d':
        colId = 'MONTH';
        break;
      case '24h':
        colId = 'DATE';
        break;
      default:
        break;
    }

    return colId;
  };

  revertDate = (timeStamp, granularity) => {
    let newDate = null;

    switch (granularity) {
      case 'WEEK':
        newDate = moment.utc(timeStamp).format('YYYY-WW');
        break;
      case 'MONTH':
        newDate = moment.utc(timeStamp).format('YYYY-MM');
        break;
      case 'DATE':
        newDate = moment.utc(timeStamp).format('YYYY-MM-DD');
        break;
    }

    return newDate || moment().format('YYYY-MM-DD');
  };

  parseDate = (date, granularity) => {
    let newDate = null;

    switch (granularity) {
      case 'WEEK':
        newDate = moment.utc(date, 'YYYY-WW').format('x');
        break;
      case 'MONTH':
        newDate = moment.utc(date, 'YYYY-MM').format('x');
        break;
      case 'DATE':
        newDate = moment.utc(date, 'YYYY-MM-DD').format('x');
        break;
    }

    return newDate ? parseInt(newDate) : '';
  };

  getMainFilterDate = () => {
    const mainFilter = getParentItem(this, 'mainFilter');
    const currentDate = mainFilter.arrFilterDate[0].date2;

    return moment.utc(currentDate, 'YYYY-MM-DD').format('x');
  };

  getFilterDate = () => {
    const currentDate = parseInt(this.getMainFilterDate());
    const mainFilter = getParentItem(this, 'mainFilter');
    const granularity = getDateColumnId(mainFilter);

    const date = this.revertDate(currentDate, granularity);

    return date;
  };

  getRegionValue = (regionName, mapKpi) => {
    const { data, alias_id } = this.state || {};
    const date = this.getFilterDate();
    let value = null;

    let dateAlias = this.getColumnIdbyDate();

    let col1 = this.getColIdByAlias('REGION');
    let col2 = getColumnIdbyAlias(dateAlias, alias_id);

    data &&
      data.forEach((row) => {
        let REGION = row[col1];
        let DATE = row[col2];
        let kpiValue = row[mapKpi];

        if (REGION == regionName && DATE == date) {
          value = kpiValue;
        }
      });

    return value;
  };

  getRegionColor = (regionName, kpi) => {
    const { threshold } = this.state || {};
    let value = this.getRegionValue(regionName, kpi);
    let regionColor = 'white';

    if (threshold[kpi] && value) {
      let ranges = threshold[kpi];

      ranges &&
        ranges.forEach((r) => {
          let { min, max, color } = r;

          if (min && max && value >= min && value <= max) regionColor = color;
          if (!min && value <= max) regionColor = color;
          if (!max && value >= min) regionColor = color;
        });
    }

    return regionColor;
  };

  getFeatureName = (feature) => {
    let regionName = feature.properties.name;
    const { mapKpi } = this.state || {};
    let text = '';
    let value = this.getRegionValue(regionName, mapKpi);

    if (value) {
      text = `${regionName} - ${Number(value).toFixed(1)}%`;
    } else {
      text = `${regionName} - No data`;
    }

    return text;
  };

  _onEachFeature = (feature, layer, map) => {
    layer.bindTooltip(this.getFeatureName(feature)).addTo(map);
  };

  _setRegionColors = (feature) => {
    let regionName = feature.properties.name;

    const { mapKpi } = this.state || {};
    let color = this.getRegionColor(regionName, mapKpi);

    return {
      weight: 1,
      color: 'white',
      opacity: 1,
      fillColor: color,
      fillOpacity: 0.8,
    };
  };

  getLegendItems = (threshold, elemKey) => {
    let items = [];

    if (threshold[elemKey]) {
      let levels = threshold[elemKey];

      levels &&
        levels.forEach((range) => {
          const { color, max, min } = range;

          items.push({ color: color, icon: 'fa fa-circle', value: `${min || 0}-${max || 100}%` });
        });
    }

    return items;
  };

  getColIdToRepresent = (data) => {
    const { alias_id, element } = data || {};
    let kpi = 'K#VOLTE_CQI'; // default KPI
    let colId = 'COL_3'; // default Alias
    if (element && element[0]) kpi = element[0];

    if (alias_id) {
      for (let key in alias_id) {
        let value = alias_id[key];
        if (value === kpi) colId = key;
      }
    }

    return colId;
  };

  getColIdByAlias = (colAlias) => {
    const { alias } = this.state || {};
    let colId = '';

    if (alias) {
      for (let key in alias) {
        let value = alias[key];
        if (value === colAlias) colId = key;
      }
    }

    return colId;
  };

  /**
   * Map options
   */
  getOptions = (data) => {
    let options = _.cloneDeep(pressets['geojson']);

    options.mapLayers[0].options.styles.default = this._setRegionColors;

    options.mapMarkers = [];

    // Iterate over all data and set the markers
    let { point } = data || {};
    point &&
      point.forEach((marker) => {
        options.mapMarkers.push({
          point: marker.point,
          popup: `<b>${marker.title}</b> <p>${marker.description}</p>`,
          options: {
            icon: {
              iconUrl: `${iconsUrl}/marker_tower_corp.png`,
              iconSize: [30, 30],
            },
            title: marker.title,
          },
        });
      });

    const colId = this.getColIdToRepresent(data);
    const { alias } = data || {};
    const kpiAlias = alias ? alias[colId] : colId;

    options.mapLegend.data = this.getLegendItems(data.threshold, colId);
    options.mapLegend.title = `${kpiAlias} <br> <span>${this.getFilterDate()}</span>`;

    return options;
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
        threshold: false,
      },
      () => {
        if (typeof cb === 'function') cb();
      }
    );
  };

  startLoading = () => {
    this.setState({
      loading: true,
    });

    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false,
    });

    store.dispatch(finishProcess(this.pid));
  };

  render() {
    let { data, options, threshold, loading, mapKpi } = this.state || {};
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
          {data && mapKpi && options && threshold && (
            <LeafletMap
              type="2d"
              options={options}
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
  updateParent: PropTypes.func.isRequired,
};

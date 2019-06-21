import React from 'react';
import PropTypes from 'prop-types';
import { JarvisWidget } from '../../../components';
import ConfigDashboard from '../../../components/config-dashboard/components/ConfigDashboard';
import { addTab, removeTab } from '../../../components/tabs/TabsActions';
// import CustomDashboardFilter from '../../analytics/containers/CustomDashboardFilter';



export default class Edit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const currentState = this.context.parentState || {};
      const nextState = nextContext.parentState || {};

      const currentFilter = currentState.mainFilter;
      const nextFilter = nextState.mainFilter;

      if (!_.isEqual(currentFilter, nextFilter)) {
        this.updateMainFilter(nextFilter);
      }
    }
  }

  updateMainFilter = (nextFilter) => {
    const nextFilterCopy = _.cloneDeep(nextFilter);

    this.setState({
      mainFilter: nextFilterCopy,
    });
  };

  saveDashboard = () => {
    console.log('Guardando dashboard...');
  };

  loadDashboard = (configWindows) => {
    // SETUP DATA FOR NEW TABS
    this.saveDashboard();

    const tabData = {
      id: getStr(),
      title: 'Edit custom dashboard',
      active: true,
      // component: CustomDashboardFilter,
      route: '',
      props: {
        configWindows,
      },
    };

    store.dispatch(addTab(tabData));
    this.removeCurrentTab();
  };

  removeCurrentTab = () => {
    store.dispatch(removeTab(this.props.tabId));
  };

  render() {
    const { id } = this.props;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        editbutton={false}
        fullscreenbutton={true}
        colorbutton={false}
        deletebutton={false}
        custombutton={true}
        className="jarviswidget-auto-height"
      >
        <header>
          <span className="widget-icon">
            <i className="fa fa-bar-chart-o" />
          </span>
          <h2>Panel config</h2>
        </header>
        <ConfigDashboard id={id} onFinish={this.loadDashboard} />
      </JarvisWidget>
    );
  }
}

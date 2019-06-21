import React from 'react';
import PropTypes from 'prop-types';
import GridTable from 'wdna-grid-table';

import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';
import { getLicenses } from '../../requests';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      alias: false,
      pagination: true,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext !== this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (nextState.reloadTable !== currentState.reloadTable) {
        this.load();
      }
    }
  }

  load = () => {
    this.startLoading();
    getLicenses()
      .then((resp) => {
        this.setState({
          data: resp.data,
          alias: resp.alias,
        });
        this.finishLoading();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoading();
      });
  };

  togglePagination = () => {
    const pag = this.state.pagination;
    this.setState({
      pagination: !pag,
    });
  };

  startLoading = () => {
    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    store.dispatch(finishProcess(this.pid));
  };

  render() {
    const { data, alias, pagination } = this.state;
    return (
      <div id="content">
        <div className="row">
          <JarvisWidget
            editbutton={false}
            togglebutton
            fullscreenbutton
            colorbutton={false}
            deletebutton={false}
            height="calc(80vh)"
          >
            <header>
              <span className="widget-icon">
                {' '}
                <i className="fa fa-edit" />{' '}
              </span>
              <h2>Licenses List </h2>
            </header>
            <div>
              <div className="jarviswidget-editbox">{/* This area used as dropdown edit box */}</div>
              <div className="widget-body">
                {data && (
                  <GridTable
                    data={data}
                    search
                    exportBtn
                    filtersBtn
                    resetBtn
                    options={{
                      enableFilter: true,
                      enableStatusBar: true,
                      alwaysShowStatusBar: false,
                      rowSelection: 'multiple',
                      pagination,
                    }}
                    hiddenCols={['id']}
                    alias={alias}
                    custom
                    additional
                    buttons
                    contextMenuItems={[
                      {
                        name: 'Toggle pagination',
                        action: this.togglePagination,
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </JarvisWidget>
        </div>
      </div>
    );
  }
}

MainTable.contextTypes = {
  router: PropTypes.object.isRequired,
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};

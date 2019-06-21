import React from 'react';
import PropTypes from 'prop-types';
import GridTable from 'wdna-grid-table';

import { SmartMessageBox } from '../../../../components/utils/actions/MessageActions';
import { JarvisWidget } from '../../../../components';

import { createTab } from '../../../../helpers/TabsHelper';
import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';
import { getAllGroups, deleteGroup } from '../../../../components/user';
import GroupForm from './GroupForm';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
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

  editRow = (rowData) => {
    const tabId = getStr();
    const dataTab1 = {
      tabId,
      title: 'Edit Group',
      active: true,
      component: GroupForm,
      props: {
        tabId,
        groupId: rowData.id,
      },
    };
    createTab(dataTab1);
  };

  load = () => {
    this.startLoading();
    getAllGroups()
      .then((resp) => {
        const groupList = resp;
        this.setState({
          groupList,
        });
        this.finishLoading();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoading();
      });
  };

  deleteRow = (rowData) => {
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed === 'Yes') {
          const { id } = rowData;
          this.startLoading();
          deleteGroup(id)
            .then(() => {
              successMessage('Success', 'Group successfully deleted', 5000);
              this.load();
            })
            .catch((error) => {
              this.finishLoading();
              const errorMsg = getErrorMessage(error);
              errorMessage('Error', errorMsg);
            });
        }
      }
    );
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
    const { pagination } = this.state;
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
              <h2>Group List </h2>
            </header>
            <div>
              <div className="jarviswidget-editbox">{/* This area used as dropdown edit box */}</div>
              <div className="widget-body">
                {this.state.groupList && (
                  <GridTable
                    data={this.state.groupList}
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
                    alias={{
                      id: 'Group ID',
                      name: 'Name',
                      app_id: 'App_id',
                    }}
                    custom
                    additional
                    buttons
                    actionTitle="Actions"
                    actionButtons={[
                      {
                        text: 'Edit',
                        icon: 'glyphicon glyphicon-edit',
                        action: this.editRow,
                        class: 'btn btn-info btn-xs',
                      },
                      {
                        text: 'Delete',
                        icon: 'glyphicon glyphicon-remove',
                        action: this.deleteRow,
                        class: 'btn btn-danger btn-xs',
                      },
                    ]}
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

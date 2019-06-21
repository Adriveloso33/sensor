import React from 'react';
import PropTypes from 'prop-types';
import GridTable from 'wdna-grid-table';

import Loader from '../../../../components/dashboards/components/Loader';
import { createTab } from '../../../../helpers/TabsHelper';
import Form from '../../containers/users/Form';

import { SmartMessageBox } from '../../../../components/utils/actions/MessageActions';
import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications/index';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';
import { getUsers } from '../../requests';
import { getAllRoles, deleteUser } from '../../../../components/user';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      pagination: true,
      loading: true,

      usersList: null,
    };
  }

  componentDidMount() {
    this.loadUsersList();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext !== this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (nextState.reloadTable !== currentState.reloadTable) {
        this.loadUsersList();
      }
    }
  }

  loadUsersList = () => {
    this.startLoading();
    Promise.all([getUsers(), getAllRoles()])
      .then(([usersList, rolesList]) => {
        this.processUsersRoles(usersList, rolesList);
        this.finishLoading();
      })
      .catch((error) => {
        errorMessage('Error', error.message);
        this.finishLoading();
      });
  };

  processUsersRoles = (usersList, rolesList) => {
    const usersWithRoles = this.assignRolesToUsers(usersList, rolesList);

    const cleanedUsers = this.removeExtraData(usersWithRoles);

    this.setState({
      usersList: cleanedUsers,
    });
  };

  removeExtraData = (usersList = []) => usersList.map(this.removeExtra);

  removeExtra = (userInfo) => {
    const cleanedUser = { ...userInfo };

    delete cleanedUser.extra;
    delete cleanedUser.job;

    return cleanedUser;
  };

  assignRolesToUsers = (usersList, rolesList) => {
    return usersList.map((userInfo) => {
      const userInfoWithRole = {
        ...userInfo,
      };

      userInfoWithRole.role = this.getRoleName(userInfo.role_id, rolesList);
      return userInfoWithRole;
    });
  };

  getRoleName = (roleId, rolesList = []) => {
    const roleInfo = rolesList.find((role) => roleId === role.id);
    return roleInfo.name;
  };

  editUser = (userData) => {
    const tabId = getStr();
    const dataTab1 = {
      tabId,
      title: 'Edit User',
      active: true,
      component: Form,
      props: {
        tabId,
        userId: userData.id,
      },
    };
    createTab(dataTab1);
  };

  deleteUser = (userData) => {
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed === 'Yes') {
          const { id } = userData;

          this.startLoading();
          deleteUser(id)
            .then(this.loadUsersList)
            .catch((error) => {
              this.finishLoading();
              errorMessage('Error', error.message);
            });
        }
      }
    );
  };

  togglePagination = () => {
    this.setState((prevState) => ({
      pagination: !prevState.pagination,
    }));
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

              <h2>Users List </h2>
            </header>
            <div>
              <div className="widget-body">
                <Loader show={this.state.loading} />
                {this.state.usersList && (
                  <GridTable
                    data={this.state.usersList}
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
                    hiddenCols={['id', 'api_token', 'role_id', 'job', 'area_id', 'superuser']}
                    alias={{
                      name: 'Name',
                      email: 'E-Mail',
                      role: 'Role',
                    }}
                    custom
                    additional
                    buttons
                    actionTitle="Actions"
                    actionButtons={[
                      {
                        text: 'Edit',
                        icon: 'glyphicon glyphicon-edit',
                        action: this.editUser,
                        class: 'btn btn-info btn-xs',
                      },
                      {
                        text: 'Delete',
                        icon: 'glyphicon glyphicon-remove',
                        action: this.deleteUser,
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

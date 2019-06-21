import React from 'react';
import PropTypes from 'prop-types';
import { SmartMessageBox } from '../../../components/utils/actions/MessageActions';
import { WidgetGrid, JarvisWidget } from '../../../components';
import GridTable from 'wdna-grid-table';
import { getItems, deleteItem, addShortcutRequest, deleteShortcutRequest } from '../requests/index';
import { errorMessage } from '../../../components/notifications/index';
import { getErrorMessage } from '../../../components/utils/ResponseHandler';
import Loader from '../../../components/dashboards/components/Loader';
import { initProcess, finishProcess } from '../../../components/scheduler/SchedulerActions';

 
import { refresh } from '../../../components/navigation/NavigationActions';

const DateFormat = 'YYYY-MM-DD HH:mm';

class ButtonDeleteActions extends React.Component {
  executeCallBack = (cb) => {
    const { value } = this.props || {};

    if (typeof cb === 'function') cb(value);
  };

  executeHandler = (cb) => {
    const { onRemove } = this.props || {};
    const { data } = this.props;

    this.executeCallBack(onRemove(data));

    if (typeof cb === 'function') cb();
  };

  handleClick = (event) => {
    event.preventDefault();
    this.executeHandler(event);
  };

  render() {
    const btnText = 'Remove';
    const { disabled } = this.props;

    return (
      <span>
        {!disabled && (
          <button type="button" className={`btn btn-danger btn-xs`} onClick={this.handleClick}>
            <i className={'glyphicon glyphicon-remove'} /> {btnText}
          </button>
        )}
      </span>
    );
  }
}

class ButtonRunActions extends React.Component {
  executeCallBack = (cb) => {
    const { value } = this.props || {};

    if (typeof cb === 'function') cb(value);
  };

  executeHandler = (cb) => {
    const { onClickRun } = this.props || {};
    const { data } = this.props;

    this.executeCallBack(onClickRun(data));

    if (typeof cb === 'function') cb();
  };

  handleClick = (event) => {
    event.preventDefault();
    this.executeHandler(event);
  };

  render() {
    const btnText = 'Run';

    return (
      <span className={'margin-left-5'}>
        <button type="button" className={`btn btn-info btn-xs`} onClick={this.handleClick}>
          {btnText}
        </button>
      </span>
    );
  }
}

class ButtonEditActions extends React.Component {
  executeCallBack = (cb) => {
    const { value } = this.props || {};

    if (typeof cb === 'function') cb(value);
  };

  executeHandler = (cb) => {
    const { onEdit } = this.props || {};
    const { data } = this.props;

    this.executeCallBack(onEdit(data));

    if (typeof cb === 'function') cb();
  };

  handleClick = (event) => {
    event.preventDefault();
    this.executeHandler(event);
  };

  render() {
    const btnText = 'Edit';
    const isOwner = _.get(this.props, 'data.owner') == 'yes';

    return (
      <span>
        {isOwner && (
          <button type="button" className={`btn btn-info btn-xs`} onClick={this.handleClick}>
            {btnText}
          </button>
        )}
      </span>
    );
  }
}

class ButtonsActions extends React.Component {
  render() {
    return (
      <span>
        <ButtonDeleteActions {...this.props} />
        <ButtonEditActions {...this.props} />
        <ButtonRunActions {...this.props} />
      </span>
    );
  }
}

class ButtonAddShortcut extends React.Component {
  executeCallBack = (cb) => {
    const { value } = this.props || {};

    if (typeof cb === 'function') cb(value);
  };

  executeHandler = (cb) => {
    const { onAdd } = this.props || {};
    const { data } = this.props;

    this.executeCallBack(onAdd(data));

    if (typeof cb === 'function') cb();
  };

  handleClick = (event) => {
    event.preventDefault();
    this.executeHandler(event);
  };

  render() {
    const { data } = this.props;
    const { id_shortcut } = data;
    const btnText = 'Add';

    return (
      !id_shortcut && (
        <span className={'margin-left-5'}>
          <button type="button" className={`btn btn-info btn-xs`} onClick={this.handleClick}>
            <i className={'glyphicon glyphicon-plus'} /> {btnText}
          </button>
        </span>
      )
    );
  }
}

class ButtonRemoveShortcut extends React.Component {
  executeCallBack = (cb) => {
    const { value } = this.props || {};

    if (typeof cb === 'function') cb(value);
  };

  executeHandler = (cb) => {
    const { onRemove } = this.props || {};
    const { data } = this.props;

    this.executeCallBack(onRemove(data));

    if (typeof cb === 'function') cb();
  };

  handleClick = (event) => {
    event.preventDefault();
    this.executeHandler(event);
  };

  render() {
    const { data } = this.props;
    const { id_shortcut } = data;
    const btnText = 'Remove';

    return (
      id_shortcut && (
        <span className={'margin-left-5'}>
          <button type="button" className={`btn btn-danger btn-xs`} onClick={this.handleClick}>
            <i className={'glyphicon glyphicon-remove'} /> {btnText}
          </button>
        </span>
      )
    );
  }
}

class ButtonsShortcut extends React.Component {
  render() {
    return (
      <span>
        <ButtonAddShortcut {...this.props} />
        <ButtonRemoveShortcut {...this.props} />
      </span>
    );
  }
}

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      alias: false,
      pagination: true,
      resetTable: 0,
      floatingFilter: false,
      loading: true,
    };

    this.deleteRow = this.deleteRow.bind(this);
    this.newRow = this.newRow.bind(this);
  }

  componentDidMount() {
    this.load();
  }

  addActionColumn = (data) => {
    data.map((value) => {
      value.Shortcut = null;
      value.Actions = null;

      return value;
    });
  };

  load = () => {
    this.startLoading();

    getItems()
      .then((resp) => {
        this.addActionColumn(resp);
        this.setState({ tableList: resp }, this.finishLoading);
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);

        this.finishLoading();
      });
  };

  refreshNavMenu = () => {
    const refreshId = getStr();

    store.dispatch(refresh(refreshId));
  };

  runRow = (rowData) => {
    const { id } = rowData;

    this.context.router.history.push(`/analytics/dashboard/${id}`);
  };

  editRow = (rowData) => {
    const { id } = rowData;

    this.context.router.history.push(`/dashboard/edit/${id}`);
  };

  deleteRow(rowData) {
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed == 'Yes') {
          const { id } = rowData;

          deleteItem(id)
            .then(() => {
              this.refreshNavMenu();
              this.load();
            })
            .catch((error) => {
              const errorMsg = getErrorMessage(error);
              errorMessage('Error', errorMsg);
            });
        }
      }
    );
  }

  newRow() {
    this.context.router.history.push(`/dashboard/new`);
  }

  removeShortcut = (rowData) => {
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed == 'Yes') {
          const { id_shortcut } = rowData;

          deleteShortcutRequest(id_shortcut)
            .then(() => {
              this.refreshNavMenu();
              this.load();
            })
            .catch((error) => {
              const errorMsg = getErrorMessage(error);
              errorMessage('Error', errorMsg);
            });
        }
      }
    );
  };

  addShortcut = (rowData) => {
    const { id } = rowData;

    addShortcutRequest(id)
      .then(() => {
        this.refreshNavMenu();
        this.load();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
      });
  };

  togglePagination = (params) => {
    this.setState({
      pagination: !this.state.pagination,
    });
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

  /**
   * Returns color
   * @param {Number} value
   * @param {String} colId
   */
  getCellIconColor = (value) => {
    if (value == 0) {
      return 'red';
    } else if (value == 1) {
      return 'green';
    }
  };

  customCellRender = (props) => {
    const { value, colDef } = props;
    const { field } = colDef || {};

    if (field === 'created_at') {
      const dateAsUTC = moment
        .utc(value)
        .local()
        .format(DateFormat);
      return <span>{dateAsUTC}</span>;
    }

    let childProps = {},
      ChildComponent = null;

    const { data } = props;
    const disabled = data.owner == 'no';

    switch (field) {
      case 'Actions':
        childProps = {
          ...props,
          disabled,
          onRemove: this.deleteRow,
          onClickRun: this.runRow,
          onEdit: this.editRow,
        };
        ChildComponent = ButtonsActions;

        break;
      case 'Shortcut':
        childProps = {
          ...props,
          disabled,
          onRemove: this.removeShortcut,
          onAdd: this.addShortcut,
        };
        ChildComponent = ButtonsShortcut;

        break;
      default:
        break;
    }

    if (!ChildComponent) return <span>{value}</span>;

    return <ChildComponent {...childProps} />;
  };

  onGridReady = (params) => {
    setTimeout(() => {
      params.columnApi.autoSizeAllColumns();
    }, 100);
  };

  render() {
    const { pagination, loading, tableList } = this.state;

    return (
      <div id="content">
        {/* widget grid */}
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12 col-md-12 col-lg-12">
              <JarvisWidget
                editbutton={false}
                togglebutton={false}
                editbutton={false}
                fullscreenbutton={false}
                colorbutton={false}
                deletebutton={false}
                height={'calc(80vh)'} // normal style
              >
                <header>
                  <span className="widget-icon">
                    <i className="fa fa-edit" />
                  </span>
                  <h2>List</h2>
                </header>

                {/* widget div*/}
                <div>
                  {/* widget content */}
                  <div className="widget-body">
                    <Loader show={loading} overlay={false} />
                    {tableList && (
                      <GridTable
                        data={tableList}
                        search={true}
                        exportBtn={true}
                        filtersBtn={true}
                        resetBtn={true}
                        options={{
                          enableFilter: true,
                          enableStatusBar: true,
                          alwaysShowStatusBar: false,
                          rowSelection: 'multiple',
                          pagination,
                        }}
                        hiddenCols={['id', 'id_shortcut']}
                        actionTitle={'Actions'}
                        customCellRendererFramework={this.customCellRender}
                        onGridReady={this.onGridReady}
                        autoFitColumns={true}
                        contextMenuItems={[
                          {
                            name: 'Toggle pagination',
                            action: this.togglePagination,
                          },
                        ]}
                      />
                    )}
                  </div>
                  {/* end widget content */}
                </div>
                {/* end widget div */}
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>

        {/* end widget grid */}
      </div>
    );
  }
}

List.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

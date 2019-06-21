import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';

import { SmartMessageBox } from '../../utils/actions/MessageActions';
import { errorMessage } from '../../notifications';
import Loader from '../../dashboards/components/Loader';

const DEFAULT_HIDDEN_COLUMNS = ['id'];
const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

const DeleteButton = ({ disabled, onRemove, id }) => (
  <span>
    {!disabled && (
      <button type="button" className="btn btn-danger btn-xs" onClick={onRemove.bind(this, id)}>
        <i className="glyphicon glyphicon-remove" /> Remove
      </button>
    )}
  </span>
);

DeleteButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default class LoadFilterModal extends React.Component {
  static contextTypes = {
    parentState: PropTypes.object.isRequired,
    updateParent: PropTypes.func.isRequired,
  };

  static propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    loadFilterList: PropTypes.func,
    deleteFilterById: PropTypes.func,
    onLoad: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    show: false,
    title: 'LOAD FILTER',
    loadFilterList: null,
    deleteFilterById: null,
    onLoad: null,
    onClose: null,
  };

  constructor(props) {
    super(props);

    this.$modal = null;

    this.state = {
      loading: false,
      tableKey: getStr(),

      filtersData: {
        alias: {},
        data: [],
      },

      selectedItem: null,
      hiddenColumns: DEFAULT_HIDDEN_COLUMNS,
    };
  }

  // ==============================
  //    REACT LIFECYCLE METHODS
  // ==============================
  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;

    // handle show modal
    if (show === true) {
      this.loadFilters();
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  // ==============================
  //        FILTERS CRUD
  // ==============================
  loadFilters = () => {
    const { loadFilterList } = this.props;
    if (typeof loadFilterList !== 'function') return null;

    this.startLoading();
    loadFilterList()
      .then((filtersData) => {
        this.setState(
          {
            filtersData: this.addActionColumn(filtersData),
            tableKey: getStr(),
          },
          this.refreshGridCells
        );
        this.finishLoading();
      })
      .catch((error) => {
        errorMessage('Error', error.message);
        this.finishLoading();
      });

    return null;
  };

  deleteFilter = (id) => {
    const { deleteFilterById } = this.props;
    if (typeof deleteFilterById !== 'function') return Promise.reject(new Error('No delete function definded'));

    const request = deleteFilterById(id);
    return request;
  };

  // ==============================
  //        HANDLERS
  // ==============================
  handleLoad = (e) => {
    e.preventDefault();

    const { onLoad } = this.props;
    const { selectedItem } = this.state;

    if (typeof onLoad === 'function') onLoad(selectedItem);
  };

  handleClose = (e) => {
    e.preventDefault();

    const { onClose } = this.props;
    if (typeof onClose === 'function') onClose();
  };

  // ==============================
  //         GRID HELPERS
  // ==============================
  gridCellClickHandler = (params) => {
    const { id } = params.data;

    this.setState({
      selectedItem: id,
    });
  };

  refreshGridCells = () => {
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 0);
  };

  addActionColumn = (filtersData) => {
    const { data } = filtersData;
    return {
      ...filtersData,
      data: data.map((row) => ({ ...row, ACTION: null })),
    };
  };

  customCellRender = (props) => {
    const { value } = props;
    const { field } = props.colDef;

    if (field === 'date') {
      const dateAsUTC = moment
        .utc(value)
        .local()
        .format(DATE_FORMAT);
      return <span>{dateAsUTC}</span>;
    }

    if (field !== 'ACTION') return <span>{value}</span>;

    // returns delete button
    const { data } = props;

    const deleteButtonProps = {
      id: data.id,
      disabled: data.owner === 'no',
      onRemove: this.onRemoveFilter,
    };

    return <DeleteButton {...deleteButtonProps} />;
  };

  onRemoveFilter = (id) => {
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed === 'Yes') {
          this.startLoading();
          this.deleteFilter(id)
            .then(() => {
              this.loadFilters();
            })
            .catch((error) => {
              this.finishLoading();
              errorMessage('Error', error.message);
            });
        }
      }
    );
  };

  // ==============================
  //        UTILS
  // ==============================
  showModal = () => {
    $(this.$modal).modal({ keyboard: false, backdrop: 'static' });
  };

  hideModal = () => {
    $(this.$modal).modal('hide');
  };

  startLoading = () => {
    this.setState({
      loading: true,
    });
  };

  finishLoading = () => {
    this.setState({
      loading: false,
    });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;

    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);
  };

  render = () => {
    const { props } = this;
    const { title } = props;
    const { hiddenColumns, selectedItem } = this.state;
    const { data, alias } = this.state.filtersData;

    return (
      <div
        className="modal fade selector-modal"
        ref={(el) => {
          this.$modal = el;
        }}
        role="dialog"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleClose}
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
              <h4 className="modal-title" id="mySettingsLabel">
                {title}
              </h4>
            </div>
            <div className="modal-body">
              <Loader overlay show={this.state.loading} />

              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 grid-container" key={this.state.tableKey}>
                  <GridTable
                    search
                    exportBtn
                    filtersBtn
                    resetBtn={false}
                    data={data}
                    alias={alias}
                    hiddenCols={hiddenColumns}
                    onGridReady={this.onGridReady}
                    customCellRendererFramework={this.customCellRender}
                    options={{
                      onCellClicked: this.gridCellClickHandler,
                      enableFilter: false,
                      enableStatusBar: false,
                      alwaysShowStatusBar: false,
                      rowSelection: 'single',
                      pagination: false,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" disabled={!selectedItem} onClick={this.handleLoad}>
                Load
              </button>
              <button type="button" className="btn btn-primary" onClick={this.handleClose} data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

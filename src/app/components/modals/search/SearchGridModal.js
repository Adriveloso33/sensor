import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import GridTable from 'wdna-grid-table';

import Loader from '../../dashboards/components/Loader';

import { warningMessage, errorMessage } from '../../notifications';

const MODAL_DOM_NODE = '#modals-div';
const SEARCH_MIN_LENGTH = 3;

export default class SearchGridModal extends React.Component {
  static contextTypes = {
    parentState: PropTypes.object.isRequired,
    updateParent: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string,
    modalClassSize: PropTypes.string,
    show: PropTypes.bool,
    onCancel: PropTypes.func,
    validateSearch: PropTypes.func,
    searchRequest: PropTypes.func.isRequired,
  };

  static defaultProps = {
    title: 'Search Modal',
    modalClassSize: '',
    show: false,
    onCancel: null,
    validateSearch: null,
  };

  constructor(props) {
    super(props);

    this.$modal = null;
    this.$el = document.getElementById(MODAL_DOM_NODE);

    this.state = {
      searchData: {},
      searchText: '',

      loading: false,
      tableKey: getStr(),
    };
  }

  // ==============================
  //     React Lifecycle methods
  // ==============================
  componentDidMount() {
    $(this.$modal).on('show.bs.modal', () => {
      this.autoSizeGridColumns();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;

    // handle show modal
    if (show === true) {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  // ==============================
  //     MODAL METHODS
  // ==============================
  showModal = () => {
    $(this.$modal).modal({ keyboard: false, backdrop: 'static' });
  };

  hideModal = () => {
    $(this.$modal).modal('hide');
  };

  // ==============================
  //     HANDLERS
  // ==============================
  handleModalCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') onCancel();
  };

  handleSearchText = (e) => {
    const searchText = e.target.value;

    this.setState({
      searchText,
    });
  };

  handleSearchButton = (e) => {
    e.preventDefault();

    const { searchText } = this.state;
    try {
      this.validateSearch(searchText);
    } catch (Ex) {
      warningMessage('Warning', Ex.message);
      return null;
    }

    this.doSearch(searchText);
    return null;
  };

  handleSearchOnEnter = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.handleSearchButton(e);
    }
  };

  // ==============================
  //     SEARCH UTILS
  // ==============================
  validateSearch = (text) => {
    const userValidateSearch = this.props.validateSearch;
    if (typeof userValidateSearch === 'function') {
      userValidateSearch(text);
    }

    const isTextValid = text.length >= SEARCH_MIN_LENGTH;
    if (!isTextValid) throw new Error(`Please enter a text of ${SEARCH_MIN_LENGTH} characters or more`);
  };

  doSearch = (text) => {
    const { searchRequest } = this.props;
    if (typeof searchRequest !== 'function') return null;

    this.startLoading();
    searchRequest(text)
      .then((results) => {
        this.setState({
          searchData: results,
        });
        this.finishLoading();
      })
      .catch((error) => {
        errorMessage('Error', error.message);
        this.finishLoading();
      });

    return null;
  };

  // ==============================
  //     GRID METHODS
  // ==============================
  refreshGridCells = () => {
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 100);
  };

  autoSizeGridColumns = () => {
    setTimeout(() => {
      const allColumnIds = [];

      this.columnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.colId);
      });

      this.columnApi.autoSizeColumns(allColumnIds);
    }, 500);
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    setTimeout(() => {
      this.autoSizeGridColumns();
    }, 0);
  };

  // ==============================
  //     UTILS
  // ==============================
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

  // ==============================
  //     MODAL BODY
  // ==============================
  modalContainer() {
    const { data, alias } = this.state.searchData;
    const { loading, searchText } = this.state;
    const { title, modalClassSize } = this.props;

    return (
      <div
        className="modal fade search-grid-modal"
        ref={(el) => {
          this.$modal = el;
        }}
        role="dialog"
        aria-labelledby="searchModalLabel"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className={classnames('modal-dialog', modalClassSize)}>
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleModalCancel}
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
              <h4 className="modal-title" id="mySearchLabel">
                {title}
              </h4>
            </div>
            <div className="modal-body">
              <Loader show={loading} overlay />
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <input
                    className="search-modal-input"
                    value={searchText}
                    placeholder="Search..."
                    onChange={this.handleSearchText}
                    onKeyUp={this.handleSearchOnEnter}
                  />
                  <button type="button" className="btn btn-primary" onClick={this.handleSearchButton}>
                    Search
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 grid-container">
                  <div key={this.state.tableKey} className="grid-container">
                    <GridTable
                      search
                      exportBtn
                      filtersBtn
                      resetBtn={false}
                      data={data || []}
                      alias={alias || {}}
                      onGridReady={this.onGridReady}
                      options={{
                        enableFilter: true,
                        enableStatusBar: true,
                        alwaysShowStatusBar: false,
                        rowSelection: 'multiple',
                        pagination: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.handleModalCancel} data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.modalContainer(), this.$el);
  }
}

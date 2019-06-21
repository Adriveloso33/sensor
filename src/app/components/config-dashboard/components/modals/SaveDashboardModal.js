import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import { warningMessage } from '../../../../components/notifications';
import Loader from '../../../../components/dashboards/components/Loader';

export default class SaveDashboardModal extends React.Component {
  constructor(props) {
    super(props);

    // generate some randoms ids for the tabs
    this.$modal = null;
    this.$el = document.getElementById('#modals-div');

    this.state = {
      loading: false,
      share: false,
      name: '',
    };
  }

  /* React Lifecycle methods */
  componentWillReceiveProps(nextProps, nextContext) {
    const { show } = nextProps || {};

    // handle show modal
    if (show === true && this.props.show === false) {
      this.showModal();
    } else if (show === false) {
      this.hideModal();
    }
  }

  /* Utils */
  showModal = (clear = false) => {
    const show = () => {
      $(this.$modal).modal({ keyboard: false, backdrop: 'static' });
    };

    const selectedItems = _.cloneDeep(this.props.selectedItems);

    this.setState(
      {
        selectedItems,
      },
      show
    );
  };

  hideModal = () => {
    $(this.$modal).modal('hide');
  };

  searchForItemByName = (itemName) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData['COL_1'] === itemName);

    return itemInfo;
  };

  searchForItemById = (itemId) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData['COL_1'] === itemId);

    return itemInfo;
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

  /* Handlers */
  handleChanges = (event) => {
    const { target } = event || {};
    const { name, value } = target || {};

    this.setState({
      [name]: value,
    });
  };

  handleActive = (share) => {
    this.setState({ share });
  };

  handleSave = () => {
    const { onSave } = this.props || {};
    const { name, share } = this.state;

    if (!name || name.length == 0) return warningMessage('Error', 'Please, add title');

    const options = {
      name,
      share,
    };

    if (typeof onSave === 'function') onSave(options);
  };

  handleCancel = (event) => {
    const { onCancel } = this.props || {};

    if (typeof onCancel === 'function') onCancel();
  };

  handleFormTextSave = (values) => {
    const newSelection = values ? values.slice() : [];

    this.setState(
      {
        selectedItems: newSelection,
      },
      this.refreshGridCells
    );
  };

  modalContainer() {
    const { props } = this;
    const { name, share } = this.state;

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
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
              <h4 className="modal-title" id="mySettingsLabel">
                {'Save dashboard'}
              </h4>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <Loader show={props.loading} overlay={true} />
              {/* Interfaz */}
              <form className="smart-form smart-fix">
                <fieldset>
                  <div className="row">
                    <section className="col" style={{ width: '100%' }}>
                      <label className="input">
                        <input
                          type="text"
                          name="name"
                          placeholder="Title"
                          value={name || ''}
                          onChange={this.handleChanges}
                        />
                      </label>
                    </section>
                  </div>
                  <div className="row">
                    <section className="col" style={{ width: '100%' }}>
                      <label htmlFor="normal-switch">
                        <Switch
                          className="react-switch"
                          onChange={this.handleActive}
                          checked={share}
                          aria-labelledby="neat-label"
                          id="share"
                          height={30}
                          offColor="#5c6875"
                          onColor="#0f610f"
                        />
                        <span style={{ position: 'relative', top: '-10px', marginLeft: '10px' }}>Share dashboard</span>
                      </label>
                    </section>
                  </div>
                </fieldset>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.handleSave}>
                Save
              </button>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.modalContainer(), this.$el);
  }
}

SaveDashboardModal.defaultProps = {
  items: [],
  alias: {},
};

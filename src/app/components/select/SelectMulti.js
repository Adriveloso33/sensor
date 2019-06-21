import React from 'react';

import classnames from 'classnames';

import NetworkSelectorModal from '../modals/selectors/network/NetworkSelectorModal';

export default class SelectMulti extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      activeModal: false,
      selected: [],
    };
  }

  // Para no tener el modal en memoria, genero uno para cargar su html y otro para mostrarlo. Así, reducimos la memoria.
  handleSelectorModal = (showModal = false) => {
    if (showModal) {
      this.setState(
        {
          activeModal: showModal,
        },
        () => {
          setTimeout(() => {
            this.setState({
              showModal,
            });
          }, 0);
        }
      );
    } else {
      this.setState(
        {
          showModal,
        },
        () => {
          setTimeout(() => {
            this.setState({
              activeModal: showModal,
            });
          }, 0);
        }
      );
    }
  };

  handleSaveSelector = (elements) => {
    this.setState(
      {
        selected: elements,
      },
      () => {
        this.props.onSave(elements);
        this.handleSelectorModal(false);
      }
    );
  };

  textPlaceholder = () => {
    const { selected } = this.state;
    const { placeholder = '' } = this.props;
    const { variablesName = 'elements' } = this.props;

    const count = selected.length;

    const text = count > 0 ? `Selected ${count} ${variablesName}` : placeholder;

    return text;
  };

  render() {
    const placeholder = this.textPlaceholder();
    const titleModal = `${this.props.variablesName} selector`;
    const { activeModal, showModal } = this.state;
    return (
      <div>
        <button
          className={classnames(this.props.className, 'btn btn-default btn-select-multi')}
          style={this.props.style}
          data-toggle="tooltip"
          data-placement="top"
          onClick={() => {
            this.handleSelectorModal(true);
          }}
        >
          <i className="fa fa-search" />
          {placeholder}
        </button>
        {activeModal && (
          <NetworkSelectorModal
            items={this.props.data || []}
            alias={this.props.alias || {}}
            selectedItems={this.state.selected || []}
            maxSelectedElements={this.props.maxSelectedElements}
            title={titleModal}
            show={showModal}
            onCancel={this.handleSelectorModal.bind(this, false)}
            onSave={this.handleSaveSelector}
          />
        )}
      </div>
    );
  }
}

SelectMulti.defaultProps = {
  variablesName: 'Variable',
  maxSelectedElements: 1,
};

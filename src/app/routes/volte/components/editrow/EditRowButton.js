import React from 'react';
import Modal from './Modal';

export default class Helper extends React.Component {
  constructor(props) {
    super(props);
    this.$modal = null;

    this.state = {
      show: false,
    };
  }

  componentWillMount() {}

  handleModal = (e) => {
    e.preventDefault();
    this.setState({
      show: true,
    });
  };

  handleCancel = () => {
    this.setState({
      show: false,
    });
  };

  render() {
    return (
      <div className="helper pull-right">
        <a title="EditRow" data-toggle="tooltip" data-placement="bottom" onClick={this.handleModal}>
          <i className="glyphicon glyphicon-edit" /> Edit
        </a>
        <Modal show={this.state.show} onCancel={this.handleCancel} />
      </div>
    );
  }
}

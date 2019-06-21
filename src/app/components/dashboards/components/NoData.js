import React from 'react';

const fadeOut = 200;

export default class NoData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  componentDidMount() {
    if (this.props.show == true) {
      this.setState({
        show: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { show } = nextProps;

    if (!show && this.state.show) {
      // hide the element when is visible

      setTimeout(() => {
        $(this.refs.nodata).fadeOut();
      }, 0);

      setTimeout(() => {
        this.setState({
          show: false
        });
      }, fadeOut);
    } else if (show == true) {
      this.setState({
        show: true
      });
    }
  }

  render() {
    let { show } = this.state || {};
    const { text } = this.props || {};
    return show ? (
      <div ref="nodata" className="wdna-no-data">
        {text ? <h1>{text}</h1> : 'No data.'}
      </div>
    ) : null;
  }
}

import React from 'react';

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch(error, info) {
    console.log('ERROR: ', error, 'INFO: ', info);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorHandler;

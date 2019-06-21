import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Header from './Header';
import Navigation from '../navigation/components/Navigation';
import Footer from './Footer';
import Tabs from '../tabs/components/Tabs';
import Loader from '../loaders/global/GlobalLoader';

class Layout extends React.Component {
  cancelLoader = () => {
    source.cancel('Operation canceled by the user.');
    window.source = CancelToken.source();
  };

  getChildContext = () => {
    const { router } = this.context;
    return {
      router,
    };
  };

  render() {
    const { processNum } = this.props;

    if (!this.props.authenticated) {
      this.context.router.history.push('/login');
      return null;
    }

    if (!this.props.user) {
      return null;
    }

    return (
      <div>
        <Loader
          show={processNum > 0} // show the Global Loader when the number of background process is greather than 0
          icon="fa fa-cog"
          className="entropy-global-loader"
          overlay={true}
          cancelBtn={true}
          cancelTimeout={120000} // miliseconds to timeout
          onCancel={this.cancelLoader}
        />
        <Header />
        <Navigation />
        <div id="main" role="main">
          <Tabs />
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

Layout.childContextTypes = {
  router: PropTypes.object,
};

Layout.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.getIn(['auth', 'authenticated']),
    user: state.getIn(['user']),
    processNum: state.getIn(['scheduler', 'processQueue', 'length']),
  };
};

export default connect(mapStateToProps)(Layout);

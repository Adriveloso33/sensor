import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { HashRouter } from 'react-router-dom';

import routes from './routes';

// HashRouter se ha anyadido para facilitar la integracion con subdirectorios. Esto anyade un hash a la ruta.
const App = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <HashRouter>{routes}</HashRouter>
    </ConnectedRouter>
  );
};

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;

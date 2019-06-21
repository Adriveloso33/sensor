import React from "react";

import { connect } from "react-redux";

class SmallBreadcrumbs extends React.Component {
  render() {
    return (
      <ol className="breadcrumb">
        {this.props.items.map(it => (
          <li key={it}>{it}</li>
        ))}
      </ol>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const navigation = state.getIn(["navigation"]);
  const routing = state.getIn(["routing"]);

  const route = routing.locationBeforeTransitions.pathname;

  const titleReducer = (chain, it) => {
    if (it.route == route) {
      chain.push(it.title);
    } else if (it.items) {
      it.items.reduce(titleReducer, chain);
    }
    return chain;
  };

  const items = navigation.items.reduce(titleReducer, ["Home"]);

  return { items };
};

export default connect(mapStateToProps)(SmallBreadcrumbs);

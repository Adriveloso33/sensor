import React, { Component } from "react";
import { Route, Switch } from "react-router";

const fakeAuth = {
  isAuthenticated: true
};

const RequiredAuth = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default RequiredAuth;

import React from 'react';
import { Route, Switch, Redirect } from 'react-router';

import Layout from '../components/common/Layout';

import { routes as AuthRoutes, redirects as AuthRedirects } from './auth';
import { routes as AdminRoutes, redirects as AdminRedirects } from './admin';
import { routes as ConfigurationRoutes, redirects as ConfigurationRedirects } from './configuration';
import { routes as EntTableRoutes, redirects as EntTableRedirects } from './enttable';
import { routes as PanelConfigRoutes, redirects as PanelConfigRedirects } from './panelconfig';
import { routes as SpecialEventsRoutes, redirects as SpecialEventsRedirects } from './specialevents';
import { routes as TrackingRoutes, redirects as TrackingRedirects } from './tracking';
import { routes as TroubleShootingRoutes, redirects as TroubleShootingRedirects } from './troubleshooting';
import { routes as VolteRoutes, redirects as VolteRedirects } from './volte';

import { routes as ReadingsRoutes } from './readings';
import { routes as SensorsRoutes, redirects as SensorsRedirects } from './sensors';
import { routes as MastersRoutes, redirects as MastersRedirects } from './masters';
import { routes as SystemRoutes, redirects as SystemRedirects } from './system';
import { routes as TechnicianRoutes, redirects as TechnicianRedirects } from './technician';

const renderRoutes = (routes) => {
  return routes.map((props) => {
    return <Route exact {...props} key={`path_${props.path}`} />;
  });
};

const renderRedirects = (redirects) => {
  return redirects.map((props) => {
    return (
      <Route exact path={props.from} render={() => <Redirect to={props.to} key={`path_${props.from}_${props.to}`} />} />
    );
  });
};

const renderAllDashboards = (allDashobards) => {
  return allDashobards.map((routesDashboards) => {
    return renderRoutes(routesDashboards);
  });
};

const renderAllRedirects = (allRedirects) => {
  return allRedirects.map((redirects) => {
    return renderRedirects(redirects);
  });
};

const AllDashboardsRoutes = [
  AuthRoutes,
  AdminRoutes,
  ConfigurationRoutes,
  EntTableRoutes,
  PanelConfigRoutes,
  SpecialEventsRoutes,
  TrackingRoutes,
  TroubleShootingRoutes,
  VolteRoutes,
  //
  ReadingsRoutes,
  SensorsRoutes,
  MastersRoutes,
  SystemRoutes,
  TechnicianRoutes,
];

const AllRedirects = [
  AuthRedirects,
  AdminRedirects,
  ConfigurationRedirects,
  EntTableRedirects,
  PanelConfigRedirects,
  SpecialEventsRedirects,
  TrackingRedirects,
  TroubleShootingRedirects,
  VolteRedirects,
  //
  SensorsRedirects,
  MastersRedirects,
  SystemRedirects,
  TechnicianRedirects,
];

const routes = (
  <div>
    <Switch>
      {renderRoutes(AuthRoutes)}
      <Layout>
        {renderAllRedirects(AllRedirects)}
        {renderAllDashboards(AllDashboardsRoutes)}
        <Route exact path="/" render={() => <Redirect to={'/readings'} />} />
      </Layout>
    </Switch>
  </div>
);

export default routes;

import Login from "./containers/Login";
import Forgot from "./containers/Forgot";
import Restore from "./containers/Restore";
import Logout from "./containers/Logout";

export const redirects = [];

export const routes = [
  {
    component: Login,
    path: "/login"
  },
  {
    component: Forgot,
    path: "/forgot"
  },
  {
    component: Restore,
    path: "/restore"
  },
  {
    component: Logout,
    path: "/logout"
  }
];

import UserConfiguration from "./loaders/userSettingsLoader";
import VisualConfiguration from "./loaders/visualSettingsLoader";

export const redirects = [];

export const routes = [
  {
    component: UserConfiguration,
    path: "/configuration/user"
  },
  {
    component: VisualConfiguration,
    path: "/configuration/visual"
  }
];

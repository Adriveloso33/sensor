import SpecialEvetnsMain from "./loaders/MainDashboard";

export const redirects = [
  {
    from: "/specialevents",
    to: "/specialevents/main"
  }
];

export const routes = [
  {
    component: SpecialEvetnsMain,
    path: "/specialevents/main"
  }
];

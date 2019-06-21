import TrackingMain from "./loaders/trackingListLoader";

export const redirects = [
  {
    from: "/tracking",
    to: "/tracking/main"
  }
];

export const routes = [
  {
    component: TrackingMain,
    path: "/tracking/main"
  }
];

import TroubleshootingMain from "./loaders/Troubleshooting";

export const redirects = [
  {
    from: "/troubleshooting",
    to: "/troubleshooting/main"
  }
];

export const routes = [
  {
    component: TroubleshootingMain,
    path: "/troubleshooting/main"
  }
];

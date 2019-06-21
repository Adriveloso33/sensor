import EmptyPage from "./loaders/EmptyPage";

export const redirects = [
  {
    from: "/emptypage",
    to: "/emptypage/main"
  }
];

export const routes = [
  {
    component: EmptyPage,
    path: "/emptypage/main"
  }
];

import AlarmCategoryList from "./loaders/Dashboard";

export const redirects = [
  {
    from: "/dashtemplate",
    to: "/dashtemplate/main"
  }
];

export const routes = [
  {
    type: "route",
    props: {
      component: AlarmCategoryList,
      path: "/dashtemplate/main"
    }
  }
];

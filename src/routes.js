import Home from "./pages/Home";
import Builder from "./pages/Builder";
import About from "./pages/About";

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/builder",
    component: Builder
  },
  {
    path: "/about",
    component: About
  }
];

export default routes;
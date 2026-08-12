import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "app.about.jsx"),
  route("contact", "app.contact.jsx"),
] satisfies RouteConfig;

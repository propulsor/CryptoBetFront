// import UserProfile from "views/UserProfile/UserProfile";
import ManageProvider from "ManageProvider";
import PriceBet from "PriceBet"
const dashboardRoutes = [
  {
    path: "/bet",
    name: "Bet",
    icon: "pe-7s-play",
    component: PriceBet
  },
  {
    path: "/provider",
    name: "Provider",
    icon: "pe-7s-user",
    component: ManageProvider
  },

  { redirect: true, path: "/", to: "/bet", name: "PriceBet" }
];

export default dashboardRoutes;

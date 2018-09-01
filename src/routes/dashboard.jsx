// import UserProfile from "views/UserProfile/UserProfile";
import ManageProvider from "ManageProvider";
import PriceBet from "PriceBet"
import Faucet from "Faucet"
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
  {
    path: "/faucet",
    name: "Faucet",
    icon: "pe-7s-user",
    component: Faucet
  },

  { redirect: true, path: "/", to: "/bet", name: "PriceBet" }
];

export default dashboardRoutes;

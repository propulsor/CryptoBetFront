// import UserProfile from "views/UserProfile/UserProfile";
import ManageProvider from "ManageProvider";
import Prediction from "Prediction"
import Faucet from "Faucet"
const dashboardRoutes = [
  {
    path: "/prediction",
    name: "Predictions",
    icon: "pe-7s-play",
    component: Prediction
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

  { redirect: true, path: "/", to: "/prediction", name: "Prediction" }
];

export default dashboardRoutes;

// import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import PriceBet from "PriceBet"
const dashboardRoutes = [
  {
    path: "/bet",
    name: "Crypto Bet",
    icon: "pe-7s-user",
    component: PriceBet
  },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "pe-7s-note2",
  //   component: TableList
  // },

  { redirect: true, path: "/", to: "/bet", name: "PriceBet" }
];

export default dashboardRoutes;

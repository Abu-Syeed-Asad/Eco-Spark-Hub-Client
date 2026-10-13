import { IUser } from "@/types/auth.type";
import SiteNavbar from "@/components/module/navigation/SiteNavbar";
import DashboardMobileMenu from "@/components/module/dashboardComponent/DashboardMobileMenu";

const DashboardNavbar = ({ userInfo }: { userInfo: IUser }) => (
  <SiteNavbar
    user={userInfo}
    dashboardMenu={<DashboardMobileMenu userInfo={userInfo} />}
  />
);

export default DashboardNavbar;

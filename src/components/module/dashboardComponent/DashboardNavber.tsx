import { IUser } from "@/types/auth.type";
import SiteNavbar from "@/components/module/navigation/SiteNavbar";

const DashboardNavbar = ({ userInfo }: { userInfo: IUser }) => (
  <SiteNavbar user={userInfo} />
);

export default DashboardNavbar;

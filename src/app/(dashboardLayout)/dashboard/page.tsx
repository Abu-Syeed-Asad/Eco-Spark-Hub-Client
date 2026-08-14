import ComponentRenderBaseRole from "@/components/module/dashboardComponent/ComponentRenderBaseRole";
import { userRole } from "@/lib/auth/authUtils";
import { getUserInfo } from "@/service/auth/auth.service";

const DashboardCommonPage = async() => {
  const userinfo =await getUserInfo();
  return (
    <div>
      <ComponentRenderBaseRole role={userinfo.role as userRole} />
    </div>
  );
};

export default DashboardCommonPage;
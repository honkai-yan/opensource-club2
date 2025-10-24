import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { checkIfLogined as checkLoginToken } from "../utils";
import { Toaster, toast } from "sonner";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const _ = async () => {
      // 判断是否有登录凭证
      // 无凭证，重定向到登录页，禁止自动登录
      if (!(await checkLoginToken())) {
        toast.error("登录凭证失效，请先登录");
        navigate("/login", {
          state: { autoLogin: false },
          replace: true,
        });
        return;
      }

      // 访问根路径，重定向到登录页（利用自动登录刷新令牌，因此不要直接重定向到dashboard）
      if (location.pathname === "/") {
        navigate("/login", { state: { autoLogin: true } });
      }

      // 访问其他路径，直接放行
      else {
        navigate(location.pathname, {
          state: { from: location },
          replace: true,
        });
      }
    };
    _();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Toaster position="top-center" richColors />
      <Outlet />
    </div>
  );
};

export default RootLayout;

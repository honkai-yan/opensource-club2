import { LoginForm } from "@/components/login-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import indexBackgroundImgs from "@/data/index-background-imgs";
import { sample } from "lodash";
import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import type { LoginResultData, ResponseResult } from "@/types/api";
import { toast } from "sonner";
import { autoLogin } from "@/utils/request";

const backgroundImg = sample(indexBackgroundImgs);

const LoginPage = () => {
  const store = useAppStore();
  const [isAutoLogining, setIsAutoLogining] = React.useState(true);
  const location = useLocation();
  const backgroundImgRef = React.useRef<HTMLImageElement>(null);
  const navigage = useNavigate();

  useEffect(() => {
    const _ = async () => {
      // 是否允许自动登录
      if (location.state?.autoLogin) {
        // 自动登录并跳转到dashboard
        const res: ResponseResult<LoginResultData> = await autoLogin();
        if (res.statusCode !== 200) {
          toast.error(res.message);
          setIsAutoLogining(false);
          return;
        }
        store.setUserInfo(res.data);
        navigage("/dashboard", { replace: true });
      } else {
        setIsAutoLogining(false);
      }
    };
    _();
  }, []);

  // 背景图加载失败时隐藏图片
  const onImageError = (e: any) => {
    if (backgroundImgRef.current) {
      backgroundImgRef.current.style.opacity = "0";
    }
    console.error(e);
  };

  if (isAutoLogining) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative">
      <div className="fixed inset-0 bg-accent z-0">
        <img
          className="w-full h-full object-cover"
          src={backgroundImg}
          ref={backgroundImgRef}
          onError={onImageError}
        />
      </div>
      <div className="w-full max-w-sm relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

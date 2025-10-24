import { LoginForm } from "@/components/login-form";
import { Navigate, useLocation } from "react-router-dom";
import indexBackgroundImgs from "@/data/index-background-imgs";
import { sample } from "lodash";
import React, { useEffect } from "react";

const backgroundImg = sample(indexBackgroundImgs);

const LoginPage = () => {
  useEffect(() => {}, []);

  // 是否允许自动登录
  const location = useLocation();
  if (location.state?.autoLogin) {
    // 自动登录并跳转到dashboard
    return <Navigate to="/dashboard" replace />;
  }

  const backgroundImgRef = React.useRef<HTMLImageElement>(null);

  // 背景图加载失败时隐藏图片
  const onImageError = (e: any) => {
    if (backgroundImgRef.current) {
      backgroundImgRef.current.style.opacity = "0";
    }
    console.error(e);
  };

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

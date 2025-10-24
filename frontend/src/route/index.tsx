import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

const RootLayout = lazy(() => import("../layout/root-layout"));
const LoginPage = lazy(() => import("../views/login"));
const DashboardLayout = lazy(() => import("../layout/dashboard-layout"));
const OverviewPage = lazy(() => import("../views/overview"));
const MembersPage = lazy(() => import("../views/members"));

const routes: Parameters<typeof createBrowserRouter>[0] | any[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="overview" replace />,
          },
          {
            path: "overview",
            element: <OverviewPage />,
            meta: {
              title: "概览",
            },
          },
          {
            path: "members",
            element: <MembersPage />,
            meta: {
              title: "成员列表",
            },
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/login?redirect" replace />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export const pageMetaData = [
  {
    path: "/dashboard/overview",
    meta: {
      title: "概览",
    },
  },
  {
    path: "/dashboard/members",
    meta: {
      title: "成员列表",
    },
  },
];

import { createContext, ReactNode, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
const BreadcrumbContext = createContext<IBreadcrumbContextType | undefined>(
  undefined
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [currentBreadcrumb, setCurrentBreadcrumb] = useState<{
    parent?: string;
    current: string;
  }>({
    parent: "Quản lý lịch hẹn",
    current: location.pathname === "/appointment/my-appointments" ? "Lịch hẹn của tôi" : "Danh sách phòng ban",
  });

  const updateBreadcrumb = (breadcrumb: {
    parent?: string;
    current: string;
  }) => {
    setCurrentBreadcrumb(breadcrumb);
  };

  return (
    <BreadcrumbContext.Provider value={{ currentBreadcrumb, updateBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};

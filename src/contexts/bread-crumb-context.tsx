import { createContext, useState, useContext, ReactNode } from "react";

const BreadcrumbContext = createContext<IBreadcrumbContextType | undefined>(
  undefined
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [currentBreadcrumb, setCurrentBreadcrumb] = useState<{
    parent?: string;
    current: string;
  }>({
    parent: "Quản lý lịch hẹn",
    current: "Lịch hẹn của tôi",
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

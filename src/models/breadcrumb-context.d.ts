interface IBreadcrumbContextType {
  currentBreadcrumb: {
    parent?: string;
    current: string;
  };
  updateBreadcrumb: (breadcrumb: { parent?: string; current: string }) => void;
}

export interface IReuseBreadcrumb {
  origin: Page;
  pageList: Page[];
}

interface Page {
  name: string;
  link: string;
}

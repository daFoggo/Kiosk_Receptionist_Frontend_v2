export interface IDesktopSearchProps {
  searchValue: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleClose: () => void;
  placeholder: string;
}

export interface IMobileSearchProps {
  searchValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleClose: () => void;
  placeholder: string;
}

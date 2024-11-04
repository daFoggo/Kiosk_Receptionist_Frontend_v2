export interface IInstitueCalendarManagement {
  id: number;
  name: string;
  iso_datetime: Date;
  location: string;
  attendees: string;
  preparation: string;
}

export interface IFormData {
  file: FileList;
}

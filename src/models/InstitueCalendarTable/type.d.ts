export interface IWork {
  name: string;
  attendees: string;
  preparation?: string;
  location: string;
  iso_datetime: Date;
}

export interface IInstitueCalendarTableProps {
  works: Work[];
}

export interface IAppointmentUtility {
    handleSearchByAttendee: (value: string) => void;
    handleSearchByRole: (value: string) => void;
    isLoading: boolean;
}
export interface IEventBannerProps {
  eventData: IEvent[];
}

export interface IEvent {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
}

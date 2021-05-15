export interface Subject<T> {
  notifyObservers: (data?: any) => void;
  registerObserver: (o: T) => void;
}

export interface RoomObserver {
  onNewMeeting: () => void;
}

export interface MeetingLeaveObserver {
  onMeetingLeave: () => void;
}

export type RoomAndMeetingLeaveObserver = MeetingLeaveObserver & RoomObserver 
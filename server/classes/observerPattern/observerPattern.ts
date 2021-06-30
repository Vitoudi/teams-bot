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

export interface MeetingJoinObserver {
  onJoinMeeting: () => void;
}

export type RoomAndMeetingLeaveObserver = MeetingLeaveObserver & RoomObserver 
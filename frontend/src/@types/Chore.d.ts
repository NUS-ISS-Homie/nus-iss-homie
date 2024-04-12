export interface Chore {
  _id: string;
  title: string;
  assignedTo: string;
  scheduledDate: Date;
  home: string;
  requestSwapNotificationId: string | null;
}

export interface NewChore {
  title: string;
  assignedTo: string;
  scheduledDate: Date;
  home: string;
  requestSwapNotificationId: string;
}

export interface ChoreResponse {
  chore: Chore;
  message: string;
}

export interface ChoresResponse {
  chores: Chore[];
  message: string;
}

export interface Chore {
  _id: number;
  title: string;
  assignedTo: string;
  dueDate: Date;
  requestSwapNotificationId: String;
}

import type { ListItem } from "./listitem";

export interface TaskItem extends ListItem {
  dueDate?: string;
  duration?: number;
  durationType?: number;
  priority?: number;
  startDate?: string
}

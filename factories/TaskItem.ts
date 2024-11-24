import type { TaskItem } from "~/models/taskitem";
import STDListItemFactory from "./STDListItem";

export default class TaskItemFactory extends STDListItemFactory {
    readonly TASK_ITEM: TaskItem = {
        ...this.LIST_ITEM,
        dueDate: undefined,
        duration: 0,
        durationType: 0,
        priority: 0,
        startDate: undefined
    }

    constructor() {
        super()
        this.setItem(this.TASK_ITEM)
    }
}
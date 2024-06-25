export interface TaskModel {
    tasks: TaskDetail[];
    totalCount: number;
}
export interface TaskDetail {
    _id: string;
    title: string,
    description: string,
    status: string,
}

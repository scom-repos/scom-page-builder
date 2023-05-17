export interface ICommand {
  execute(): any;
  undo(): void;
  redo(): void;
}

export interface IDataColumn {
  column: number;
  columnSpan: number;
}

export const MAX_COLUMN = 12;
export const MIN_COLUMN = 2;

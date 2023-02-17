export interface ICommand {
  execute(): void;
  undo(): void;
  redo(): void;
}

export interface IDataColumn {
  column: number;
  columnSpan: number;
}

export const MAX_COLUMN = 12;

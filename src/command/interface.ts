export interface ICommand {
  execute(): any;
  undo(): void;
  redo(): void;
}

export interface IDataColumn {
  column: number;
  columnSpan: number;
}

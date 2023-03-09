import { ICommand } from "./interface";

export class CommandHistory {
  private commands: ICommand[] = [];
  private currentCommandIndex = -1;

  execute(command: ICommand): void {
    this.commands = this.commands.slice(0, this.currentCommandIndex + 1);
    this.commands.push(command);
    this.currentCommandIndex++;
    command.execute();
  }

  undo(): void {
    if (this.currentCommandIndex >= 0) {
      const command = this.commands[this.currentCommandIndex];
      console.log('undo', command)
      command.undo();
      this.currentCommandIndex--;
    }
  }

  redo(): void {
    if (this.currentCommandIndex < this.commands.length - 1) {
      this.currentCommandIndex++;
      const command = this.commands[this.currentCommandIndex];
      command.execute();
    }
  }
}

export const commandHistory = new CommandHistory();

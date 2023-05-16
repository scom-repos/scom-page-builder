import { ICommand } from "./interface";

export class CommandHistory {
  private commands: ICommand[] = [];
  private currentCommandIndex = -1;

  async execute(command: ICommand): Promise<void> {
    this.commands = this.commands.slice(0, this.currentCommandIndex + 1);
    this.commands.push(command);
    this.currentCommandIndex++;
    await command.execute();
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
      console.log('redo', command)
      command.execute();
    }
  }
}

export const commandHistory = new CommandHistory();

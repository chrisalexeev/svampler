import type { Command } from "./command";

class CommandInvoker {
    private undoHistory: Command[] = [];
    private redoHistory: Command[] = [];
    private undoLimit: number = 10;
  
    public execute(command: Command): void {
      command.execute();
      this.undoHistory.push(command);
      if (this.undoHistory.length > this.undoLimit) {
        this.undoHistory.shift();
      }
      this.redoHistory = []; // Clear redo history when a new command is executed
    }
  
    public undo(): void {
      if (this.undoHistory.length > 0) {
        const command = this.undoHistory.pop();
        command?.undo();
        this.redoHistory.push(command!);
      }
    }
  
    public redo(): void {
      if (this.redoHistory.length > 0) {
        const command = this.redoHistory.pop();
        command?.execute();
        this.undoHistory.push(command!);
      }
    }
}

export const invoker = new CommandInvoker();
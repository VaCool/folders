import { Logger } from '../../common/utils/logger';
import { FoldersService } from './folders.service';

export class FleManager {
  private static readonly folders = new FoldersService();

  public static runCommands(commands: string): void {
    for (const line of commands.split(/\n/)) {
      try {
        Logger.message(this.folders.execute(line));
      } catch (e) {
        Logger.error(line + '\n' + e.message);
      }
    }
  }
}

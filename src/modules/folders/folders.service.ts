import { addSpaces } from '../../common/utils/util';
import { Commands } from '../../common/enums/commands.enum';

type FoldersType = Map<string, FoldersType>;

export class FoldersService {
  private folders: FoldersType = new Map();
  private path = '';

  public execute(line: string): string {
    const [command, folder, destination] = line.split(' ');
    this.path = folder;
    switch (command) {
      case Commands.CREATE:
        this.createFolder(folder.split('/'), this.folders);
        return `${Commands.CREATE} ${folder}`;
      case Commands.DELETE:
        this.deleteFolder(folder.split('/'), this.folders);
        return `${Commands.DELETE} ${folder}`;
      case Commands.MOVE:
        this.moveFolder(folder.split('/'), destination.split('/'));
        return `${Commands.MOVE} ${folder} ${destination}`;
      case Commands.LIST:
        this.folderList(this.folders);
        return `${Commands.LIST}${this.folderList(this.folders)}`;
      default:
        throw new Error(`Command not found: ${line}`);
    }
  }

  private folderList(map: FoldersType, count = 0): string {
    let result = '';
    map = new Map([...map.entries()].sort());
    map.forEach((value, key) => {
      result += '\n' + addSpaces(key, count);
      if (value?.size) {
        result += this.folderList(value, count + 1);
      }
    });
    return result;
  }

  private createFolder(arr: string[], map: FoldersType): void {
    const [name, ...args] = arr;
    const value = map.get(name) as FoldersType;
    if (!value && args.length) {
      throw new Error(`Cannot create ${this.path} - ${name} does not exist`);
    }

    if (args.length) {
      return this.createFolder(args, value);
    }
    if (value) {
      throw new Error(`Cannot create ${this.path} - ${arr[0]} already exist`);
    }
    map.set(name, new Map());
  }

  public deleteFolder(arr: string[], map: FoldersType): void {
    const [name, ...args] = arr;
    const value = map.get(name) as FoldersType;
    if (!value) {
      throw new Error(`Cannot delete ${this.path} - ${arr[0]} does not exist`);
    }
    args.length ? this.deleteFolder(args, value) : map.delete(name);
  }

  private moveFolder(from: string[], to: string[]): void {
    const fromSave = this.findFolder(from, this.folders);
    const toSave = this.findFolder(to, this.folders);
    toSave.set(from[from.length - 1], fromSave);
    this.deleteFolder(from, this.folders);
  }

  private findFolder(arr: string[], map: FoldersType): FoldersType {
    const [name, ...args] = arr;
    const value = map.get(name) as FoldersType;
    if (!value) {
      throw new Error(`Cannot move ${this.path} - ${arr[0]} does not exist`);
    }
    return args.length ? this.findFolder(args, value) : value;
  }
}

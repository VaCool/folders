export class Logger {
  public static message(message: string): void {
    console.log(message);
  }
  public static error(error: string): void {
    console.log(error);
  }
}

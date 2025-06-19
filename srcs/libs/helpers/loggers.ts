const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};


export class Logger {
  private static _colors = {
    info: COLORS.blue,
    warn: COLORS.yellow,
    error: COLORS.red,
    debug: COLORS.magenta,
  }
  private static _logger(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string
  ) {
    const timestamp = new Date().toISOString();
    console[level](
      `${COLORS.blue}[${timestamp}]${COLORS.reset} ${this._colors[level.toLowerCase()]}[${level.toUpperCase()}]${COLORS.reset} ${message}`
    );
  }

  static info(obj: any) {
    this._logger("info", obj);
  }

  static warn(obj: any) {
    this._logger("warn", obj);
  }

  static error(obj: any) {
    this._logger("error", obj);
  }

  static debug(obj: any) {
    if (process.env.RUNMODE?.toLowerCase() === "debug") {
      this._logger("debug", obj);
    }
  }
}

export default Logger;

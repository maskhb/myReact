function logA(level, ...msg) {
  console.log(`log - ${level}:`, ...msg); /* eslint no-console: ["error", { allow: ["log", "info", "warn", "error"] }] */
}

function debug(...msg) {
  logA(debug.name, ...msg);
}

function info(...msg) {
  logA(info.name, ...msg);
}

function warn(...msg) {
  logA(warn.name, ...msg);
}

function error(...msg) {
  logA(error.name, ...msg);
}

function fatal(...msg) {
  logA(fatal.name, ...msg);
}

const log = {
  debug, info, warn, error, fatal,
};

export default log;

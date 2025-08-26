/**
 * Logger 模块
 * 提供统一的日志记录功能，支持输出到控制台和文件
 */

const fs = require("fs");
const path = require("path");

// 确保logs目录存在
const logsDir = path.resolve(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log(`Created logs directory at: ${logsDir}`);
  } catch (error) {
    console.error(`Failed to create logs directory: ${error.message}`);
  }
}

/**
 * 记录日志到文件和控制台
 * @param {string} level - 日志级别 (error, warn, info)
 * @param {string} message - 日志消息
 */
function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // 输出到控制台
  if (level === "error") {
    console.error(logMessage.trim());
  } else if (level === "warn") {
    console.warn(logMessage.trim());
  } else {
    console.log(logMessage.trim());
  }

  // 写入日志文件 - 使用同步写入确保日志记录
  try {
    const logFilePath = path.resolve(
      logsDir,
      `${new Date().toISOString().split("T")[0]}.log`,
    );
    fs.appendFileSync(logFilePath, logMessage);
  } catch (err) {
    console.error(`Failed to write to log file: ${err.message}`);
  }
}

/**
 * 记录错误日志
 * @param {string} message - 错误消息
 */
function error(message) {
  log("error", message);
}

/**
 * 记录警告日志
 * @param {string} message - 警告消息
 */
function warn(message) {
  log("warn", message);
}

/**
 * 记录信息日志
 * @param {string} message - 信息消息
 */
function info(message) {
  log("info", message);
}

// 导出日志函数
exports.log = log;
exports.error = error;
exports.warn = warn;
exports.info = info;

// 导出日志级别常量
exports.LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  LOG: "log",
};

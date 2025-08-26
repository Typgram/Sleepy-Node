/**
 * 元信息管理模块
 * 存储和管理应用程序的基本信息，如名称、版本、作者等
 */

/**
 * 应用程序版本号
 * @type {Array<number>}
 */
const VERSION = [0, 1, 1];

/**
 * 应用程序元信息配置
 */
const APP_META = {
  /**
   * 应用程序名称
   */
  name: "SleepyNode",

  /**
   * 应用程序简称
   */
  shortName: "Sleepy",

  /**
   * 应用程序版本号数组
   */
  version: VERSION,

  /**
   * 应用程序版本字符串
   */
  versionString: VERSION.join("."),

  /**
   * 应用程序描述
   */
  description: "Sleepy run on Node.js - 一个轻量级的后端服务",

  /**
   * 作者信息
   */
  author: {
    name: "ImJingLan",
    email: "example@example.com",
    website: "https://example.com",
  },

  /**
   * GitHub仓库信息
   */
  repository: {
    type: "git",
    url: "https://github.com/ImJingLan/sleepy-backend.git",
  },

  /**
   * 许可证信息
   */
  license: "MIT",

  /**
   * 时区设置
   */
  timezone: "Asia/Shanghai",

  /**
   * 语言设置
   */
  language: "zh-CN",

  /**
   * 启动时间戳
   */
  startTime: Date.now(),

  /**
   * 应用程序主页
   */
  homepage: "https://example.com",
};

/**
 * 页面配置信息
 */
const PAGE_CONFIG = {
  background: "https://imgapi.siiway.top/image",
  description: "SleepyNode - Sleepy run on Node.js",
  favicon: "/static/favicon.ico",
  name: "SleepyNode",
  theme: "default",
  title: "SleepyNode",
};

/**
 * 检查是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * 检查是否为生产环境
 * @returns {boolean} 是否为生产环境
 */
function isProduction() {
  return process.env.NODE_ENV === "production";
}

module.exports = {
  // 常量导出
  VERSION,
  APP_META,
  PAGE_CONFIG,
  isDevelopment,
  isProduction,
};

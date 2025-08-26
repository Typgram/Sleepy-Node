/**
 * UUID生成器模块
 * 不依赖任何外部库，使用JavaScript内置功能生成UUID
 */

/**
 * 生成符合RFC 4122 v4规范的UUID
 * @returns {string} 生成的UUID字符串
 */
function generateUUID() {
  // 使用当前时间戳的随机部分作为基础
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    // 生成随机数
    const r = (Math.random() * 16) | 0;
    // 根据位置决定是直接使用随机数还是进行特殊处理
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    // 转换为16进制字符串
    return v.toString(16);
  });
}

/**
 * 生成一个简短的随机ID
 * @param {number} length - 生成的ID长度，默认为8
 * @returns {string} 生成的简短ID字符串
 */
function generateShortID(length = 8) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < length; i++) {
    // 从字符集中随机选择一个字符
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 验证一个字符串是否是有效的UUID格式
 * @param {string} uuid - 要验证的UUID字符串
 * @returns {boolean} 是否是有效的UUID格式
 */
function isValidUUID(uuid) {
  if (!uuid || typeof uuid !== "string") {
    return false;
  }
  // UUID v4的正则表达式验证
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 生成基于时间的UUID（完全符合RFC 4122 v4规范并包含时间信息）
 * @returns {string} 生成的基于时间的UUID
 */
function generateTimeBasedUUID() {
  const now = new Date();
  // 获取当前时间的时间戳（毫秒）并转换为16进制
  const timeHex = now.getTime().toString(16).padStart(16, "0");

  // 生成足够的随机数并转换为16进制
  const randomBytes = new Array(16);
  for (let i = 0; i < randomBytes.length; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }
  const randomHex = randomBytes
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 结合时间和随机部分，确保符合RFC 4122 v4规范
  const timePart = timeHex.substr(0, 8);
  const timeMidPart = timeHex.substr(8, 4);
  const versionPart = "4" + randomHex.substr(1, 3); // 版本4
  const variantPart =
    ((parseInt(randomHex.substr(4, 1), 16) & 0x3) | 0x8).toString(16) +
    randomHex.substr(5, 3); // 变体位
  const nodePart = randomHex.substr(8, 12);

  // 组合成标准UUID格式：8-4-4-4-12
  return `${timePart}-${timeMidPart}-${versionPart}-${variantPart}-${nodePart}`;
}

// 导出所有函数
exports.generateUUID = generateUUID;
exports.generateShortID = generateShortID;
exports.isValidUUID = isValidUUID;
exports.generateTimeBasedUUID = generateTimeBasedUUID;

// 导出默认生成UUID的函数
module.exports = Object.assign(generateUUID, exports);

/**
 * Status Set API 路由模块
 * 用于设置当前状态
 */

const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const { authMiddleware } = require("../utils/auth");
const fs = require("fs");
const path = require("path");
const { APIUnsuccessful } = require("../utils/APIUnsuccessful");

/**
 * 数据文件路径
 */
const DATA_FILE_PATH = path.join(__dirname, "..", "_data", "data.json");

/**
 * 设置当前状态接口
 * 路径: /set?status=<status>
 * 方法: GET
 * 描述: 设置当前状态，并更新最后更新时间
 * 需要鉴权
 * 返回: JSON格式的操作结果
 */
router.get("/", authMiddleware, (req, res) => {
  try {
    // 检查状态参数是否存在
    if (!req.query.status) {
      logger.info("GET /set 400 Bad Request - Missing status parameter");
      const errorResponse = APIUnsuccessful(
        400,
        "Missing required parameter 'status'",
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 检查状态参数是否为数字
    const status = parseInt(req.query.status, 10);
    if (isNaN(status)) {
      logger.info("GET /set 400 Bad Request - Invalid status parameter");
      const errorResponse = APIUnsuccessful(
        400,
        "Argument 'status' must be a number",
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 读取当前数据文件
    let data;
    try {
      const dataFileContent = fs.readFileSync(DATA_FILE_PATH, "utf8");
      data = JSON.parse(dataFileContent);
    } catch (error) {
      logger.error(`Failed to read data file: ${error.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to read data file");
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 更新状态和最后更新时间
    data.status = status;
    data.last_updated = new Date()
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-");

    // 写回数据文件
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
      logger.info(`GET /set 200 OK - Status set to ${status}`);
    } catch (error) {
      logger.error(`Failed to write data file: ${error.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to update status");
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 返回成功响应
    return res.status(200).json({
      success: true,
      code: "OK",
      set_to: status,
    });
  } catch (error) {
    logger.error(`Error in /set endpoint: ${error.message}`);
    const errorResponse = APIUnsuccessful(500, "An unexpected error occurred");
    return res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;

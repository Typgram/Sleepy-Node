/**
 * Status API 路由模块
 * 处理与服务器状态相关的API请求
 */

const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const { APIUnsuccessful } = require("../utils/apiResponse");

/**
 * 服务器状态接口
 * 路径: /api/status
 * 方法: GET
 * 描述: 获取服务器的运行状态信息以及 data.json 和 devices.json 中的数据
 * 返回: JSON格式的服务器状态信息
 */
router.get("/", (req, res) => {
  try {
    logger.info("GET /api/status 200");

    // 读取 data.json 文件
    const dataJsonPath = path.join(__dirname, "..", "_data", "data.json");
    const dataJsonContent = fs.readFileSync(dataJsonPath, "utf8");
    let dataJson = JSON.parse(dataJsonContent);

    // 读取 devices.json 文件
    const devicesJsonPath = path.join(__dirname, "..", "_data", "devices.json");
    const devicesJsonContent = fs.readFileSync(devicesJsonPath, "utf8");
    const devicesJson = JSON.parse(devicesJsonContent);

    dataJson.device_status = devicesJson;

    // 返回200状态码和状态信息
    res.status(200).json(dataJson);
  } catch (error) {
    logger.info(`GET /api/status 500 Internal Server Error: ${error.message}`);
    // 错误处理
    const errorResponse = APIUnsuccessful(500, "Internal Server Error");
    return res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;

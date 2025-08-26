/**
 * Meta API 路由模块
 * 处理与站点元数据和状态相关的API请求
 */

const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const {
  APIUnsuccessful,
  InternalServerError,
} = require("../utils/APIUnsuccessful");

const { APP_META } = require("../utils/metaInfo");
const VERSION = APP_META.version;
const VRESION_STR = APP_META.version_str;

require("dotenv").config();

const METADATA = {
  success: true,
  version: VERSION,
  version_str: VRESION_STR,
  timezone: "Asia/Shanghai",
  page: {
    background: "https://imgapi.siiway.top/image",
    desc: process.env.SITE_DESC,
    favicon: "/static/favicon.ico",
    name: process.env.SITE_NAME,
    theme: "default",
    title: process.env.SITE_NAME,
  },
  metrics: true,
};

/**
 * 获取站点元数据接口
 * 路径: /api/meta
 * 方法: GET, POST
 * 描述: 获取站点的元数据（页面设置、版本等）
 * 返回: JSON格式的元数据信息
 */

router
  .route("/")
  .get((req, res) => {
    try {
      logger.info("GET /api/meta 200");
      res.status(200).json(METADATA);
    } catch (error) {
      logger.info("GET /api/meta 500 Internal Server Error");
      // 错误处理
      const errorResponse = APIUnsuccessful(500, error.message);
      res.status(errorResponse.code).json(errorResponse);
    }
  })
  .post((req, res) => {
    try {
      logger.info("POST /api/meta 200");
      res.status(200).json(METADATA);
    } catch (error) {
      logger.info("POST /api/meta 500 Internal Server Error");
      // 错误处理
      const errorResponse = APIUnsuccessful(500, error.message);
      res.status(errorResponse.code).json(errorResponse);
    }
  });

/**
 * 服务器状态接口
 * 路径: /api/query/status
 * 方法: GET
 * 描述: 获取服务器的运行状态信息以及 data.json 和 devices.json 中的数据
 * 返回: JSON格式的服务器状态信息
 */
router.get("/status", (req, res) => {
  try {
    logger.info("GET /api/query/status 200");

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
    logger.info(
      `GET /api/query/status 500 Internal Server Error: ${error.message}`
    );
    // 错误处理
    const errorResponse = APIUnsuccessful(500, error.message);
    res.status(errorResponse.code).json(errorResponse);
  }
});

/**
 * 可用状态列表接口
 * 路径: /api/query/status/list
 * 方法: GET
 * 描述: 获取所有可用的状态列表
 * 返回: JSON格式的状态列表
 */
router.get("/status/list", (req, res) => {
  try {
    logger.info("GET /api/query/status/list 200");

    // 读取 status.json 文件
    const statusJsonPath = path.join(__dirname, "..", "_data", "status.json");
    const statusJsonContent = fs.readFileSync(statusJsonPath, "utf8");
    const statusList = JSON.parse(statusJsonContent);

    // 返回200状态码和状态列表
    res.status(200).json({
      success: true,
      statusList: statusList,
    });
  } catch (error) {
    logger.info(
      `GET /api/query/status/list 500 Internal Server Error: ${error.message}`
    );
    // 错误处理
    const errorResponse = APIUnsuccessful(500, error.message);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;

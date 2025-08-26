/**
 * Device API 路由模块
 * 处理与设备相关的API请求
 */

const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const { authMiddleware } = require("../utils/auth");
const fs = require("fs");
const path = require("path");
const { APIUnsuccessful } = require("../utils/APIUnsuccessful");

const { generateUUID } = require("../utils/uuidKits");

/**
 * 设备数据文件路径
 */
const DEVICES_FILE_PATH = path.join(__dirname, "..", "_data", "devices.json");

/**
 * 设置设备状态接口
 * 路径: /api/device/set?id=<id>&show_name=<show_name>&using=<using>&app_name=<app_name>
 * 方法: GET
 * 描述: 设置设备的状态信息
 * 需要鉴权
 * 返回: JSON格式的操作结果
 */
router.get("/set", authMiddleware, (req, res) => {
  try {
    // 检查设备ID参数是否存在
    if (!req.query.id) {
      logger.info(
        "GET /api/device/set 400 Bad Request - Missing device ID parameter"
      );
      const errorResponse = APIUnsuccessful(
        400,
        "Missing required parameter 'id'"
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 读取设备数据文件
    let devicesData;
    try {
      const devicesContent = fs.readFileSync(DEVICES_FILE_PATH, "utf8");
      devicesData = JSON.parse(devicesContent);
    } catch (readError) {
      logger.error(`Error reading devices file: ${readError.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to read devices data");
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 查找设备
    const deviceId = req.query.id;
    const deviceIndex = devicesData.findIndex(
      (device) => device.id === deviceId
    );

    // 检查设备是否存在
    if (deviceIndex === -1) {
      logger.info(
        `GET /api/device/set 404 Not Found - Device with ID ${deviceId} not found`
      );
      const errorResponse = APIUnsuccessful(
        404,
        `Device with ID ${deviceId} not found`
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 更新设备信息
    const updatedDevice = { ...devicesData[deviceIndex] };

    // 更新传入的参数
    if (req.query.show_name !== undefined) {
      updatedDevice.show_name = req.query.show_name;
    }

    if (
      req.query.using !== undefined &&
      (req.query.using === "true" || req.query.using === "false")
    ) {
      updatedDevice.using = req.query.using;
    } else if (req.query.using !== undefined) {
      logger.info(
        `GET /api/device/set 400 Bad Request - Invalid using parameter for device ${deviceId}`
      );
      const errorResponse = APIUnsuccessful(
        400,
        "Argument 'using' must be boolean"
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    if (req.query.app_name !== undefined) {
      updatedDevice.app_name = req.query.app_name;
    }

    // 保存更新后的设备数据
    devicesData[deviceIndex] = updatedDevice;

    try {
      fs.writeFileSync(
        DEVICES_FILE_PATH,
        JSON.stringify(devicesData, null, 2),
        "utf8"
      );
      logger.info(
        `GET /api/device/set 200 OK - Device ${deviceId} updated successfully`
      );

      return res.status(200).json({
        success: true,
        message: "Device status updated successfully",
        device: updatedDevice,
      });
    } catch (writeError) {
      logger.error(`Error writing devices file: ${writeError.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to save device data");
      return res.status(errorResponse.code).json(errorResponse);
    }
  } catch (error) {
    logger.error(
      `GET /api/device/set 500 Internal Server Error: ${error.message}`
    );
    const errorResponse = APIUnsuccessful(
      500,
      "An error occurred while processing your request"
    );
    return res.status(errorResponse.code).json(errorResponse);
  }
});

/**
 * 添加新设备接口
 * 路径: /api/device/add?show_name=<show_name>&using=<using>&app_name=<app_name>
 * 方法: GET
 * 描述: 添加新设备并返回唯一的设备ID
 * 需要鉴权
 * 返回: JSON格式的操作结果和新创建的设备信息
 */
router.get("/add", authMiddleware, (req, res) => {
  try {
    // 检查必要参数
    if (!req.query.show_name) {
      logger.info(
        "GET /api/device/add 400 Bad Request - Missing show_name parameter"
      );
      const errorResponse = APIUnsuccessful(
        400,
        'Missing required parameter "show_name"'
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    if (req.query.using !== "true" && req.query.using !== "false") {
      logger.info(
        "GET /api/device/add 400 Bad Request - Invalid using parameter"
      );
      const errorResponse = APIUnsuccessful(
        400,
        'Argument "using" must be boolean ("true" or "false")'
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    if (!req.query.app_name) {
      logger.info(
        "GET /api/device/add 400 Bad Request - Missing app_name parameter"
      );
      const errorResponse = APIUnsuccessful(
        400,
        'Missing required parameter "app_name"'
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 读取设备数据文件
    let devicesData;
    try {
      const devicesContent = fs.readFileSync(DEVICES_FILE_PATH, "utf8");
      devicesData = JSON.parse(devicesContent);
    } catch (readError) {
      logger.error(`Error reading devices file: ${readError.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to read devices data");
      return res.status(errorResponse.code).json(errorResponse);
    }

    const newDeviceId = generateUUID();

    // 创建新设备对象
    const newDevice = {
      id: newDeviceId,
      show_name: req.query.show_name,
      using: req.query.using === "true",
      app_name: req.query.app_name,
    };

    // 添加新设备到设备列表
    devicesData.push(newDevice);

    // 保存更新后的设备数据
    try {
      fs.writeFileSync(
        DEVICES_FILE_PATH,
        JSON.stringify(devicesData, null, 2),
        "utf8"
      );
      logger.info(
        `GET /api/device/add 200 OK - New device added with ID: ${newDeviceId}`
      );

      return res.status(200).json({
        success: true,
        message: "Device added successfully",
        device: newDevice,
        device_id: newDeviceId,
      });
    } catch (writeError) {
      logger.error(`Error writing devices file: ${writeError.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to save device data");
      return res.status(errorResponse.code).json(errorResponse);
    }
  } catch (error) {
    logger.error(
      `GET /api/device/add 500 Internal Server Error: ${error.message}`
    );
    const errorResponse = APIUnsuccessful(
      500,
      "An error occurred while processing your request"
    );
    return res.status(errorResponse.code).json(errorResponse);
  }
});

/**
 * 删除设备接口
 * 路径: /api/device/remove?id=<id>
 * 方法: GET
 * 描述: 根据设备ID删除设备
 * 需要鉴权
 * 返回: JSON格式的操作结果
 */
router.get("/remove", authMiddleware, (req, res) => {
  try {
    // 检查设备ID参数是否存在
    if (!req.query.id) {
      logger.info(
        "GET /api/device/remove 400 Bad Request - Missing device ID parameter"
      );
      const errorResponse = APIUnsuccessful(
        400,
        'Missing required parameter "id"'
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 读取设备数据文件
    let devicesData;
    try {
      const devicesContent = fs.readFileSync(DEVICES_FILE_PATH, "utf8");
      devicesData = JSON.parse(devicesContent);
    } catch (readError) {
      logger.error(`Error reading devices file: ${readError.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to read devices data");
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 查找设备
    const deviceId = req.query.id;
    const deviceIndex = devicesData.findIndex(
      (device) => device.id === deviceId
    );

    // 检查设备是否存在
    if (deviceIndex === -1) {
      logger.info(
        `GET /api/device/remove 404 Not Found - Device with ID ${deviceId} not found`
      );
      const errorResponse = APIUnsuccessful(
        404,
        `Device with ID ${deviceId} not found`
      );
      return res.status(errorResponse.code).json(errorResponse);
    }

    // 保存被删除的设备信息
    const deletedDevice = devicesData[deviceIndex];

    // 从设备列表中删除设备
    devicesData.splice(deviceIndex, 1);

    // 保存更新后的设备数据
    try {
      fs.writeFileSync(
        DEVICES_FILE_PATH,
        JSON.stringify(devicesData, null, 2),
        "utf8"
      );
      logger.info(
        `GET /api/device/remove 200 OK - Device ${deviceId} removed successfully`
      );

      return res.status(200).json({
        success: true,
        message: "Device removed successfully",
        device: deletedDevice,
      });
    } catch (writeError) {
      logger.error(`Error writing devices file: ${writeError.message}`);
      const errorResponse = APIUnsuccessful(500, "Failed to save device data");
      return res.status(errorResponse.code).json(errorResponse);
    }
  } catch (error) {
    logger.error(
      `GET /api/device/remove 500 Internal Server Error: ${error.message}`
    );
    const errorResponse = APIUnsuccessful(
      500,
      "An error occurred while processing your request"
    );
    return res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;

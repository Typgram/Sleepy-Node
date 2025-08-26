/**
 * Sleepy Backend Server
 * 主入口文件，创建Express服务器并配置API路由
 */
const { APP_META } = require("./utils/metaInfo");
const VERSION = APP_META.version;
const VRESION_STR = APP_META.versionString;
// 检查.env文件是否存在
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const envFilePath = path.resolve(__dirname, ".env");

const { APIUnsuccessful, codes } = require("./utils/APIUnsuccessful");

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

if (!fs.existsSync(envFilePath)) {
  logger.error("Error: .env file not found");
  logger.error(
    "Please create a .env file and configure necessary environment variables like PORT and SLEEPY_SECRET"
  );
  process.exit(1);
}

// 加载.env文件中的环境变量
require("dotenv").config();

// 导入所需模块
const express = require("express");
const app = express();

// 设置服务器端口，从环境变量或默认值获取
const PORT = process.env.PORT || 3000;

const SECRET = process.env.SLEEPY_SECRET;

// 中间件配置
app.use(express.json()); // 解析JSON请求体

// 导入路由模块
const queryRoutes = require("./routes/query");
const setRoutes = require("./routes/set");
const deviceRoutes = require("./routes/device");

/**
 * 根路径接口
 * 用于检查服务器是否正常运行
 */
app.get("/", (req, res) => {
  logger.info("GET / 200");
  res.json({
    message: "Sleepy Backend Server is running",
    version: VRESION_STR,
  });
});

app.get("/errors", (req, res) => {
  logger.info(`GET /errors ${req.query.code}`);
  const errorResponse = APIUnsuccessful(req.query.code, codes[req.query.code]);
  return res.status(errorResponse.code).json(errorResponse);
});

// 挂载API路由
app.use("/api/query", queryRoutes);
app.use("/api/set", setRoutes);
app.use("/api/device", deviceRoutes);

// 启动服务器
app.listen(PORT, () => {
  logger.log("info", `Server is running on http://localhost:${PORT}`);
  logger.info(`VERSION: ${VRESION_STR}`);
  if (isDevelopment()) {
    logger.info(`Your SECRET: ${SECRET}`);
  }
});

/**
 * 认证中间件
 * 用于验证API请求的合法性
 * 支持通过查询参数方式传递secret进行认证
 */

const logger = require("./logger");
const {
  APIUnsuccessful,
  Unauthorized,
  InternalServerError,
} = require("./apiResponse");

/**
 * 从环境变量或请求中获取secret
 * @param {Object} req - Express请求对象
 * @returns {string|null} - 认证secret或null
 */
function extractSecret(req) {
  // 1. 从查询参数获取secret
  if (req.query && req.query.secret) {
    return req.query.secret;
  }

  // 2. 从请求头获取Sleepy-Secret
  if (req.headers && req.headers["sleepy-secret"]) {
    return req.headers["sleepy-secret"];
  }

  // 3. 从请求头获取Authorization (需要在secret前加Bearer )
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
  }

  // 4. 从请求体获取secret (仅适用于POST请求)
  if (req.method === "POST" && req.body && req.body.secret) {
    return req.body.secret;
  }

  return null;
}

/**
 * 认证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express的next函数
 */
exports.authMiddleware = (req, res, next) => {
  const SECRET = process.env.SLEEPY_SECRET;

  // 检查SECRET是否在环境变量中配置
  if (!SECRET) {
    logger.error("SLEEPY_SECRET not found in .env file!");
    const errorResponse = APIUnsuccessful(
      500,
      "Authentication secret is not configured"
    );
    return res.status(errorResponse.code).json(errorResponse);
  }

  // 提取请求中的secret
  const secret = extractSecret(req);

  // 验证secret是否正确
  if (!secret) {
    // 未提供secret的情况
    logger.error(
      `No secret provided by client for endpoint: ${req.method} ${req.originalUrl}`
    );

    const errorResponse = APIUnsuccessful(
      401,
      "No secret provided, please provide a valid secret for authentication"
    );
    return res.status(errorResponse.code).json(errorResponse);
  } else if (secret !== SECRET) {
    // 提供了secret但不正确的情况
    logger.error(
      `Incorrect secret provided for endpoint: ${req.method} ${req.originalUrl}`
    );
    logger.info(`Provided secret: ${secret}`);
    logger.info(`Expected secret: ${SECRET}`);
    const errorResponse = APIUnsuccessful(
      401,
      "Provided secret is incorrect, please check and try again"
    );
    return res.status(errorResponse.code).json(errorResponse);
  }

  // 鉴权成功，继续处理请求
  next();
};

// 导出SECRET供其他模块使用
exports.SECRET = process.env.SLEEPY_SECRET;

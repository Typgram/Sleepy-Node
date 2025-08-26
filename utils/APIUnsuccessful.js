/**
 * API响应工具模块
 * 提供统一的API响应格式
 */

/**
 * 创建API失败响应
 * @param {number} code - HTTP状态码
 * @param {string} details - HTTP状态码描述
 * @param {string} message - 错误详情
 * @returns {Object} 失败响应对象
 */

const codes = {
  // 4xx - 客户端错误
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot", // RFC 2324
  422: "Unprocessable Entity", // WebDAV
  423: "Locked", // WebDAV
  424: "Failed Dependency", // WebDAV
  425: "Too Early", // RFC 8470
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons", // RFC 7725

  // 5xx - 服务器错误
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates", // RFC 2295
  507: "Insufficient Storage", // WebDAV
  508: "Loop Detected", // WebDAV
  510: "Not Extended",
  511: "Network Authentication Required",
};

exports.APIUnsuccessful = (code, message) => {
  return {
    success: false,
    code: code,
    details: codes[code],
    message: message,
  };
};

exports.codes = codes;

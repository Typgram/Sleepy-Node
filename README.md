# Sleepy Node.js 后端实现

> 欢迎来到 Sleepy Project 的 Node.js 后端实现仓库！

一个用于查看个人在线状态（以及正在使用软件）的 Node.js 应用，让他人能知道你不在而不是故意吊他/她

[**功能**](#功能) / [**快速开始**](#快速开始) / [**Docker部署**](#docker部署) / [**API文档**](#api文档) / [**项目结构**](#项目结构) / [**开发指南**](#开发指南)

## 功能

- [x] 自行设置在线状态（活着/似了等）
- [x] 实时更新设备使用状态（包括是否正在使用/打开的应用名）
- [x] 开放的 API 接口，方便集成和扩展
- [x] 支持 API 认证保护
- [x] 支持 Docker 部署

## 快速开始

### 前提条件

- [Node.js](https://nodejs.org/) (v16+)
- [pnpm](https://pnpm.io/) (项目默认包管理器)

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

复制 `.env.example` 文件并创建 `.env` 文件：

```bash
cp .env.example .env
```

然后根据需要修改 `.env` 文件中的配置项：

```
# 环境模式 (development/production)
NODE_ENV=development

# 服务器端口
PORT=8080

# API 认证密钥
SLEEPY_SECRET=your-secret-key

# 数据目录路径
DATA_DIR=_data
```

### 启动服务器

```bash
# 开发模式
pnpm dev

# 生产模式
pnpm start
```

服务器启动后，访问 http://localhost:8080/api/status 检查服务是否正常运行。

## Docker部署

### 使用Docker Compose

项目已包含完整的 Docker 配置文件，可以通过以下命令快速部署：

```bash
git clone
docker-compose up -d
```

如果拉去Node的元数据时报错可以执行以下命令

```bash
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
```

这将构建镜像并启动容器，服务将在 http://localhost:8080 上可用。

### 自定义Docker配置

如果需要自定义 Docker 配置，可以修改以下文件：

- `Dockerfile`: 定义了如何构建 Docker 镜像
- `docker-compose.yml`: 定义了如何运行容器
- `.dockerignore`: 定义了哪些文件不应复制到 Docker 镜像中

### 认证方式

API 支持多种认证方式：

1. 查询参数: `?secret=your-secret-key`
2. 请求头: `Sleepy-Secret: your-secret-key`
3. Bearer Token: `Authorization: Bearer your-secret-key`
4. 请求体: `{"secret": "your-secret-key"}`

## 项目结构

```
sleepy-backend/
├── _data/             # 数据存储目录
│   ├── data.json      # 主数据文件
│   ├── devices.json   # 设备数据
│   └── status.json    # 状态数据
├── routes/            # 路由定义
│   ├── device.js      # 设备相关路由
│   ├── query.js       # 查询相关路由
│   ├── set.js         # 设置相关路由
│   └── status.js      # 状态相关路由
├── utils/             # 工具函数
│   ├── APIUnsuccessful.js # 错误处理
│   ├── auth.js        # 认证中间件
│   ├── logger.js      # 日志工具
│   ├── metaInfo.js    # 元信息处理
│   └── uuidKits.js    # UUID工具
├── .dockerignore      # Docker忽略文件
├── .env.example       # 环境变量示例
├── .gitignore         # Git忽略文件
├── Dockerfile         # Docker构建文件
├── docker-compose.yml # Docker Compose配置
├── index.js           # 应用入口
├── openapi.json       # API文档
├── package.json       # 项目依赖
└── pnpm-lock.yaml     # 依赖锁定文件
```

## 关于

本项目是 Sleepy 项目的 Node.js 后端实现，灵感来源于 Bilibili UP [@WinMEMZ](https://space.bilibili.com/417031122) 的原始项目 和 [Sleepy-project/sleepy](https://github.com/sleepy-project/sleepy)。

感谢所有为 Sleepy 项目做出贡献的开发者们！

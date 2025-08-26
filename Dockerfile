# 使用官方Node.js镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装pnpm包管理器
RUN npm install -g pnpm --registry=https://registry.npmmirror.com

# 首先复制依赖文件，利用Docker缓存机制
COPY package.json pnpm-lock.yaml ./

# 安装项目依赖
RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

# 复制项目源代码
COPY . .

# 暴露项目运行的端口（根据实际情况修改）
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8080
ENV SLEEPY_SECRET=LZUJ9DpQSyqm6N5y
ENV METRICS_ENABLED=true
ENV SITE_NAME=Sleepy
ENV SITE_DESC=Sleepy是一个基于Node.js的简单易用的API接口文档工具


# 启动命令
CMD ["pnpm", "start"]
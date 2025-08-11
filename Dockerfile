FROM node:18-alpine

# 设置 Node.js 应用的工作目录
WORKDIR /usr/src/app

# 安装 Node.js 应用依赖
# 复制 package.json 和 package-lock.json (如果存在)
COPY package*.json ./
# 安装依赖
RUN npm install express jsonwebtoken

# 将所有应用代码复制到容器里
# 复制所有文件（包括 server.js, entrypoint.sh）
COPY . .

# 设置启动脚本
# 赋予启动脚本可执行权限
RUN chmod +x ./entrypoint.sh

# 暴露端口
# 3000 用于 Node.js 服务
EXPOSE 3000

# 设置入口点
ENTRYPOINT [ "./entrypoint.sh" ]

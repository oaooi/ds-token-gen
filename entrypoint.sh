#!/bin/sh

# 启动 Node.js 服务，并让它在前台运行
# 这是容器的主进程，它结束时，容器也会停止
echo "Starting Node.js token generation server..."
node server.js

# ds-token-gen
Alist/OpenList与OnlyOffice预览密钥认证后端

# 构建镜像
```bash
git clone https://github.com/zhaxingyu/ds-token-gen.git
cd ds-token-gen
docker build -t ds-token-gen .
```

# 部署服务
```bash
docker run
  -d
  --name='ds-token-gen'
  --net='bridge'
  --pids-limit 2048
  -e TZ="Asia/Shanghai"
  -e HOST_OS="Unraid"
  -e HOST_HOSTNAME="Tower"
  -e HOST_CONTAINERNAME="ds-token-gen"
  -e 'ONLYOFFICE_SECRET'='<你的OnlyOffice密码>'
  -l net.unraid.docker.managed=dockerman
  -p '3000:3000/tcp' 'ds-token-gen'
```
容器内暴露`3000`端口为Token认证接口，请将'ONLYOFFICE_SECRET'变量设置为OnlyOffice密钥

# 反向代理设置
容器监听'/generate-token'网址进行Token生成

反向代理样例
```conf
  location /generate-token {
    # 假设你的 Node.js 服务运行在 192.168.31.200 的 3000 端口
    proxy_pass http://192.168.31.200:3000;
  }
```

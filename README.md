# ds-token-gen
Alist/OpenList与OnlyOffice预览密钥认证后端

# 构建镜像
```bash
git clone https://github.com/oaooi/ds-token-gen.git
cd ds-token-gen
docker build -t ds-token-gen .
```

# 部署服务
```bash
docker run -d \
--name ds-token-gen \
-p 3000:3000 \
-e TZ="Asia/Shanghai" \
-e ONLYOFFICE_SECRET="<你的OnlyOffice密码>" \
--restart always \
ds-token-gen
```
容器内暴露`3000`端口为Token认证接口，请将'ONLYOFFICE_SECRET'变量设置为OnlyOffice密钥

# 反向代理设置
容器监听'/generate-token'网址进行Token生成

反向代理样例，添加至OnlyOffice网站的反向代理Nginx文件配置中
```conf
  location /generate-token {
    # 假设你的 Node.js 服务运行在 192.168.31.200 的 3000 端口
    proxy_pass http://192.168.31.200:3000;
  }
```

具体集成文章可前往[https://github.com/zhaxingyu/olist-onlyoffice-preview](https://github.com/zhaxingyu/olist-onlyoffice-preview)

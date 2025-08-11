const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // 引入 crypto 模块来生成 key
const app = express();
const port = 3000;

// !!! 极其重要：你需要通过Docker变量设置为 ONLYOFFICE 的真实密钥 !!!
const ONLYOFFICE_SECRET = process.env.ONLYOFFICE_SECRET;
// 添加一个检查，确保环境变量已设置，否则程序会因配置错误而无法启动
if (!ONLYOFFICE_SECRET) {
  console.error("致命错误：环境变量 ONLYOFFICE_SECRET 未设置！");
  console.error("请在启动容器时通过 -e ONLYOFFICE_SECRET=your_secret 来设置它。");
  process.exit(1); // 以失败代码退出程序
}

app.get('/generate-token', (req, res) => {
    const { fileUrl } = req.query;
    if (!fileUrl) {
        return res.status(400).json({ error: '文件 URL (fileUrl) 是必需的' });
    }
    
    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.lastIndexOf('?') !== -1 ? fileUrl.lastIndexOf('?') : fileUrl.length);
    const fileExtension = fileName.split('.').pop();

    // --- 新增：为文档生成一个唯一的 key ---
    // 一个简单的方法是使用文件 URL 的哈希值。
    // 在实际应用中，最好使用文件的最后修改时间或版本号来确保 key 的唯一性。
    const documentKey = crypto.createHash('md5').update(fileUrl).digest('hex');

    const payload = {
        document: {
            fileType: fileExtension,
            // --- 新增：添加 key ---
            key: documentKey, 
            permissions: {
                edit: false, // 假设现在是浏览模式
                comment: true,
                download: true,
                print: true,
                fillForms: true,
            },
            title: fileName,
            url: fileUrl,
        },
        editorConfig: {
            lang: "zh-CN",
            mode: "view",
        },
        type: "desktop",
        width: "100%",
        height: "100%",
    };

    try {
        const token = jwt.sign(payload, ONLYOFFICE_SECRET);
        res.json({ token: token });
    } catch (err) {
        console.error("JWT 签名失败:", err);
        res.status(500).json({ error: "生成令牌失败" });
    }
});

app.listen(port, () => {
    console.log(`令牌生成服务正在监听端口 ${port}`);
});

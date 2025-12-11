# 智合同 SmartContract 安装设置指南

本指南将帮助您完成智合同项目的安装、配置与部署，包括开发环境和生产环境的搭建步骤。

---

## 📋 环境要求

### 系统要求

| 环境 | 要求 | 备注 |
|------|------|------|
| 操作系统 | Windows 10+/macOS 10.15+/Linux | 64位系统 |
| CPU | 至少4核 | 推荐8核以上 |
| 内存 | 至少8GB | 推荐16GB以上 |
| 磁盘空间 | 至少50GB | 推荐100GB以上 |

### 软件依赖

| 软件 | 版本 | 用途 |
|------|------|------|
| Node.js | ≥ 16.0.0 | 前端和后端开发运行环境 |
| npm/yarn | ≥ 8.0.0 | Node.js包管理器 |
| Python | ≥ 3.8.0 | AI服务开发运行环境 |
| pip | ≥ 21.0.0 | Python包管理器 |
| Git | ≥ 2.20.0 | 代码版本控制 |
| Docker | ≥ 20.10.0 | 容器化部署 |
| Docker Compose | ≥ 1.29.0 | 多容器管理 |

### 第三方服务

| 服务 | 用途 | 备注 |
|------|------|------|
| 文心大模型API | AI文本生成、语义理解 | 需要注册获取API密钥 |
| 文心OCR API | 图片文字识别 | 需要注册获取API密钥 |
| 电子签章服务 | 合同电子签章 | 如法大大、e签宝等 |
| 云存储服务 | 文件存储 | 如阿里云OSS、AWS S3等 |

---

## 🚀 开发环境搭建

### 1. 代码克隆

```bash
# 克隆代码仓库
git clone https://github.com/your-username/smart-contract-platform.git

# 进入项目目录
cd smart-contract-platform
```

### 2. 安装依赖

#### 2.1 Web端依赖

```bash
cd web
npm install  # 或 yarn install
```

#### 2.2 App端依赖

```bash
cd mobile
npm install  # 或 yarn install
```

#### 2.3 后端服务依赖

```bash
cd server
npm install  # 或 yarn install
```

#### 2.4 AI服务依赖

```bash
cd ai-service
pip install -r requirements.txt
```

### 3. 配置环境变量

在各模块目录下创建`.env`文件，参考`.env.example`配置环境变量：

#### 3.1 Web端环境变量

```bash
cd web
cp .env.example .env
vi .env
```

**关键配置项：**

```env
# 开发环境配置
NODE_ENV=development

# 服务端口
PORT=3000

# API基础URL
REACT_APP_API_BASE_URL=http://localhost:3001/api

# 文心大模型配置
REACT_APP_BAIDU_API_KEY=your_baidu_api_key
REACT_APP_BAIDU_SECRET_KEY=your_baidu_secret_key
```

#### 3.2 后端服务环境变量

```bash
cd server
cp .env.example .env
vi .env
```

**关键配置项：**

```env
# 开发环境配置
NODE_ENV=development

# 服务端口
PORT=3001

# 文件管理配置
FILE_STORAGE_PATH=./data/files
FILE_INDEX_PATH=./data/index

# 文心大模型配置
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key

# 电子签章配置
ESIGN_API_URL=your_esign_api_url
ESIGN_APP_ID=your_esign_app_id
ESIGN_APP_SECRET=your_esign_app_secret

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# AGENT框架配置
AGENT_API_URL=http://localhost:4000
AGENT_API_KEY=your_agent_api_key

# MCP工具配置
MCP_API_URL=http://localhost:4001
MCP_API_KEY=your_mcp_api_key
```

#### 3.3 AI服务环境变量

```bash
cd ai-service
cp .env.example .env
vi .env
```

**关键配置项：**

```env
# 开发环境配置
FLASK_ENV=development

# 服务端口
PORT=5000

# 文心大模型配置
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key

# 文件管理配置
FILE_STORAGE_PATH=./data/files
```

### 4. 初始化文件管理系统

```bash
# 创建文件存储和索引目录
cd server
mkdir -p data/files data/index

# 初始化文件索引
npm run init:file-index
```

### 5. 启动开发服务器

#### 5.1 启动后端服务

```bash
cd server
npm run dev
```

访问：http://localhost:3001

#### 5.2 启动AI服务

```bash
cd ai-service
python app.py
```

访问：http://localhost:5000

#### 5.3 启动Web端

```bash
cd web
npm run dev
```

访问：http://localhost:3000

#### 5.4 启动App端

```bash
cd mobile
npm start
```

使用Expo Go扫码运行或连接模拟器

---

## 🎯 生产环境部署

### 1. Docker部署（推荐）

#### 1.1 配置Docker Compose

在项目根目录创建`docker-compose.yml`文件：

```yaml
version: '3.8'

services:
  # 后端服务
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: smart-contract-server
    environment:
      NODE_ENV: production
      FILE_STORAGE_PATH: /app/data/files
      FILE_INDEX_PATH: /app/data/index
    volumes:
      - server_data:/app/data
    ports:
      - "3001:3001"
    restart: always

  # AGENT服务
  agent-service:
    build:
      context: ./agent-service
      dockerfile: Dockerfile
    container_name: smart-contract-agent
    environment:
      NODE_ENV: production
      PORT: 4000
    ports:
      - "4000:4000"
    volumes:
      - agent_data:/app/data
    restart: always

  # MCP服务
  mcp-service:
    build:
      context: ./mcp-service
      dockerfile: Dockerfile
    container_name: smart-contract-mcp
    environment:
      NODE_ENV: production
      PORT: 4001
    ports:
      - "4001:4001"
    restart: always

  # Web端
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    container_name: smart-contract-web
    environment:
      NODE_ENV: production
      REACT_APP_API_BASE_URL: http://your-server-ip:3001/api
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - server
    restart: always

  # AI服务
  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    container_name: smart-contract-ai
    environment:
      FLASK_ENV: production
      BAIDU_API_KEY: your_baidu_api_key
      BAIDU_SECRET_KEY: your_baidu_secret_key
    ports:
      - "5000:5000"
    restart: always

volumes:
  server_data:
  agent_data:
  mcp_data:
```

#### 1.2 创建Dockerfile

为每个服务创建Dockerfile：

**Web端Dockerfile (web/Dockerfile)：**

```dockerfile
# 基础镜像
FROM node:16-alpine as build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 使用Nginx作为Web服务器
FROM nginx:1.21-alpine

# 复制构建产物到Nginx目录
COPY --from=build /app/build /usr/share/nginx/html

# 复制Nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80 443

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**后端服务Dockerfile (server/Dockerfile)：**

```dockerfile
# 基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动服务
CMD ["npm", "run", "start"]
```

# AI服务Dockerfile (ai-service/Dockerfile)：

```dockerfile
# 基础镜像
FROM python:3.8-alpine

# 设置工作目录
WORKDIR /app

# 复制requirements.txt
COPY requirements.txt ./

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制源代码
COPY . .

# 创建数据目录
RUN mkdir -p /app/data/files

# 暴露端口
EXPOSE 5000

# 启动服务
CMD ["python", "app.py"]
```

# AGENT服务Dockerfile (agent-service/Dockerfile)：

```dockerfile
# 基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 4000

# 启动服务
CMD ["npm", "run", "start"]
```

# MCP服务Dockerfile (mcp-service/Dockerfile)：

```dockerfile
# 基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 4001

# 启动服务
CMD ["npm", "run", "start"]
```

#### 1.3 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 2. 传统部署方式

#### 2.1 Web端部署

```bash
cd web

# 构建生产版本
npm run build

# 使用Nginx部署
# 将构建产物复制到Nginx目录
cp -r build/* /usr/share/nginx/html/

# 配置Nginx
# 编辑/etc/nginx/conf.d/smart-contract.conf
```

**Nginx配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 2.2 后端服务部署

```bash
cd server

# 构建生产版本
npm run build

# 使用PM2管理进程
npm install -g pm2
pm run start:prod
```

**PM2配置示例 (ecosystem.config.js)：**

```javascript
module.exports = {
  apps: [
    {
      name: 'smart-contract-server',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

#### 2.3 AI服务部署

```bash
cd ai-service

# 使用Gunicorn管理进程
pip install gunicorn

# 启动服务
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🔧 配置管理

### 1. 配置文件结构

```
smart-contract-platform/
├── web/                  # Web端
│   ├── .env              # Web端环境变量
│   └── config.js         # Web端配置文件
├── server/               # 后端服务
│   ├── .env              # 后端环境变量
│   └── config/           # 后端配置目录
│       ├── database.js   # 数据库配置
│       ├── jwt.js        # JWT配置
│       └── ai.js         # AI服务配置
├── ai-service/           # AI服务
│   ├── .env              # AI服务环境变量
│   └── config.py         # AI服务配置文件
└── mobile/               # App端
    └── .env              # App端环境变量
```

### 2. 关键配置项说明

#### 2.1 文件管理配置

```javascript
// server/config/fileManager.js
module.exports = {
  development: {
    storagePath: './data/files',
    indexPath: './data/index',
    chunkSize: 1024 * 1024 * 10, // 10MB
    maxFileSize: 1024 * 1024 * 500 // 500MB
  },
  production: {
    storagePath: process.env.FILE_STORAGE_PATH || '/app/data/files',
    indexPath: process.env.FILE_INDEX_PATH || '/app/data/index',
    chunkSize: 1024 * 1024 * 10,
    maxFileSize: 1024 * 1024 * 500
  }
};
```

#### 2.2 AGENT框架配置

```javascript
// server/config/agent.js
module.exports = {
  apiUrl: process.env.AGENT_API_URL || 'http://localhost:4000',
  apiKey: process.env.AGENT_API_KEY,
  timeout: 30000
};
```

#### 2.3 MCP工具配置

```javascript
// server/config/mcp.js
module.exports = {
  apiUrl: process.env.MCP_API_URL || 'http://localhost:4001',
  apiKey: process.env.MCP_API_KEY,
  timeout: 30000
};
```

#### 2.2 AI服务配置

```javascript
// server/config/ai.js
module.exports = {
  baidu: {
    apiKey: process.env.BAIDU_API_KEY,
    secretKey: process.env.BAIDU_SECRET_KEY,
    endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop'
  },
  ocr: {
    apiKey: process.env.BAIDU_OCR_API_KEY,
    secretKey: process.env.BAIDU_OCR_SECRET_KEY,
    endpoint: 'https://aip.baidubce.com/rest/2.0/ocr/v1'
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:5000'
};
```

#### 2.3 电子签章配置

```javascript
// server/config/esign.js
module.exports = {
  provider: process.env.ESIGN_PROVIDER || 'fadada',
  apiUrl: process.env.ESIGN_API_URL,
  appId: process.env.ESIGN_APP_ID,
  appSecret: process.env.ESIGN_APP_SECRET,
  callbackUrl: process.env.ESIGN_CALLBACK_URL
};
```

---

## 🧪 测试验证

### 1. API接口测试

使用Postman或curl测试API接口：

```bash
# 测试用户注册接口
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 测试合同生成接口
curl -X POST http://localhost:3001/api/contract/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{"templateId":"123","data":{"seller":"Company A","buyer":"Company B","amount":10000}}'
```

### 2. 功能测试

#### 2.1 Web端功能测试

1. 访问http://localhost:3000
2. 注册/登录系统
3. 测试采购合同生成功能
4. 测试销售合同生成功能
5. 测试合同审核功能

#### 2.2 App端功能测试

1. 使用Expo Go扫码或模拟器运行App
2. 注册/登录系统
3. 测试拍照上传报价单功能
4. 测试合同审批功能
5. 测试语音输入功能

### 3. 性能测试

使用LoadRunner、JMeter等工具进行性能测试：

- 并发用户数：1000+
- 响应时间：页面加载<2秒，API响应<500ms
- 吞吐量：≥ 100请求/秒

---

## 📊 监控与维护

### 1. 日志管理

#### 1.1 前端日志

Web端日志使用console输出，可通过浏览器开发者工具查看。

#### 1.2 后端日志

后端日志配置在`server/config/logging.js`，支持文件日志和控制台日志。

```bash
# 查看后端日志
cd server
cat logs/access.log
cat logs/error.log
```

#### 1.3 Docker日志

```bash
# 查看Docker容器日志
docker-compose logs -f server
docker-compose logs -f web
docker-compose logs -f ai-service
```

### 2. 监控系统

推荐使用以下监控工具：

- **Prometheus + Grafana**：系统监控和数据可视化
- **ELK Stack**：日志收集、分析和可视化
- **New Relic**：应用性能监控
- **Datadog**：全栈监控平台

### 3. 定期维护

- 文件备份：定期备份文件存储目录，确保数据安全
- 日志清理：定期清理日志文件，释放磁盘空间
- 系统更新：定期更新系统和依赖软件，修复安全漏洞
- 性能优化：根据监控数据优化系统性能

---

## ❓ 常见问题

### 1. 环境变量配置错误

**问题**：启动服务时提示"Missing environment variable"

**解决方法**：
- 检查`.env`文件是否存在
- 确保所有必要的环境变量都已配置
- 重启服务使配置生效

### 2. 文件管理系统错误

**问题**：启动后端服务时提示"File system initialization failed"

**解决方法**：
- 检查文件存储目录是否存在
- 检查文件存储目录权限设置
- 检查磁盘空间是否充足

### 3. AGENT服务连接失败

**问题**：调用AGENT服务时提示"Agent service connection failed"

**解决方法**：
- 检查AGENT服务是否正常运行
- 检查AGENT配置是否正确
- 检查API密钥是否有效

### 4. MCP工具调用失败

**问题**：调用MCP工具时提示"MCP tool connection failed"

**解决方法**：
- 检查MCP服务是否正常运行
- 检查MCP配置是否正确
- 检查API密钥是否有效

### 3. AI模型调用失败

**问题**：生成合同或审核合同时提示"AI model call failed"

**解决方法**：
- 检查文心大模型API密钥是否正确
- 检查网络连接是否正常
- 检查API调用频率是否超过限制
- 查看AI服务日志获取详细错误信息

### 4. 电子签章集成失败

**问题**：调用电子签章服务时提示"ESign API call failed"

**解决方法**：
- 检查电子签章服务配置是否正确
- 检查API密钥是否有效
- 联系电子签章服务提供商获取支持

---

## 📞 技术支持

如果您在安装设置过程中遇到问题，可以通过以下方式获取技术支持：

- **GitHub Issues**：https://github.com/your-username/smart-contract-platform/issues
- **文档中心**：https://docs.smart-contract.ai
- **邮件支持**：support@smart-contract.ai
- **在线客服**：https://www.smart-contract.ai/support

---

**最后更新时间**：2024年7月1日  
**版本号**：v1.0
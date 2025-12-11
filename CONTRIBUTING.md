# 智合同 SmartContract 贡献指南

欢迎您加入智合同项目的开发与维护！本指南将帮助您了解如何参与项目贡献，包括代码提交、问题反馈、文档编写等方面的规范与流程。

---

## 📋 贡献方式

我们欢迎以下类型的贡献：

- **代码贡献**：修复Bug、开发新功能、优化性能
- **文档贡献**：完善项目文档、编写使用教程、翻译内容
- **问题反馈**：报告Bug、提出功能建议、参与讨论
- **测试贡献**：编写测试用例、进行功能测试、性能测试
- **设计贡献**：UI/UX设计、图标设计、界面优化

---

## 🚀 开发环境搭建

### 1. 系统要求

- Node.js ≥ 16.0.0
- Python ≥ 3.8.0
- Git ≥ 2.20.0
- 操作系统：Windows 10+/macOS 10.15+/Linux

### 2. 代码克隆

```bash
# 克隆代码仓库
git clone https://github.com/your-username/smart-contract-platform.git

# 进入项目目录
cd smart-contract-platform
```

### 3. 安装依赖

#### Web端依赖安装

```bash
cd web
npm install  # 或 yarn install
```

#### App端依赖安装

```bash
cd mobile
npm install  # 或 yarn install
```

#### 后端服务依赖安装

```bash
cd server
npm install  # 或 yarn install

# AI服务依赖
cd ai-service
pip install -r requirements.txt

# AGENT服务依赖
cd agent-service
npm install  # 或 yarn install

# MCP服务依赖
cd mcp-service
npm install  # 或 yarn install
```

### 4. 配置环境变量

在各模块目录下创建`.env`文件，参考`.env.example`配置环境变量：

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量
vi .env  # 或使用其他编辑器
```

### 5. 启动开发服务器

#### Web端开发服务器

```bash
cd web
npm run dev
```

访问：http://localhost:3000

#### App端开发服务器

```bash
cd mobile
npm start
```

使用Expo Go扫码运行或连接模拟器

#### 后端开发服务器

```bash
cd server
npm run dev
```

访问：http://localhost:3001

#### AGENT服务开发服务器

```bash
cd agent-service
npm run dev
```

访问：http://localhost:4000

#### MCP服务开发服务器

```bash
cd mcp-service
npm run dev
```

访问：http://localhost:4001

---

## 📐 代码规范

为了保证代码质量和一致性，我们制定了以下代码规范：

### 1. 命名规范

- **文件命名**：使用小驼峰命名（如：`userService.js`）
- **变量命名**：使用小驼峰命名（如：`userName`）
- **函数命名**：使用小驼峰命名（如：`getUserInfo()`）
- **类命名**：使用大驼峰命名（如：`UserController`）
- **常量命名**：使用全大写+下划线（如：`MAX_RETRY_COUNT`）

### 2. 代码格式

- **缩进**：使用2个空格进行缩进
- **行宽**：每行不超过100个字符
- **括号**：使用K&R风格（左括号在同一行）
- **分号**：语句结束处必须添加分号
- **空行**：函数之间空2行，代码块之间空1行

### 3. 注释规范

- **单行注释**：使用`//`注释单行代码
- **多行注释**：使用`/* */`注释多行代码
- **函数注释**：使用JSDoc格式注释函数参数、返回值和功能
- **文件注释**：每个文件顶部添加文件说明、作者、创建时间等信息

示例：

```javascript
/**
 * 用户服务 - 处理用户相关业务逻辑
 * @module userService
 * @author John Doe
 * @created 2024-07-01
 */

/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户信息对象
 */
async function getUserInfo(userId) {
  // 查询数据库获取用户信息
  const user = await db.User.findById(userId);
  return user;
}
```

### 4. 特定语言规范

#### JavaScript/TypeScript

- 使用ES6+语法
- 优先使用`const`/`let`，避免使用`var`
- 优先使用箭头函数
- 优先使用模板字符串
- 使用`async/await`处理异步操作

#### Python

- 遵循PEP 8规范
- 使用4个空格进行缩进
- 导入语句按标准库、第三方库、本地库顺序排列
- 使用类型提示增强代码可读性

---

## 🌿 分支管理

### 1. 分支命名规范

| 分支类型 | 命名格式 | 示例 | 用途 |
|----------|---------|------|------|
| 主分支 | `main` | - | 稳定版本分支 |
| 开发分支 | `develop` | - | 日常开发分支 |
| 功能分支 | `feature/功能名称` | `feature/contract-generate` | 开发新功能 |
| Bug修复分支 | `fix/问题描述` | `fix/ocr-parse-error` | 修复Bug |
| 热修复分支 | `hotfix/问题描述` | `hotfix/security-leak` | 紧急修复线上问题 |
| 发布分支 | `release/版本号` | `release/v1.0.0` | 准备发布新版本 |

### 2. 分支流程

1. **主分支（main）**：只包含稳定的、已发布的代码
2. **开发分支（develop）**：包含所有已完成的功能，准备下一次发布
3. **功能分支**：从`develop`分支创建，开发完成后合并回`develop`
4. **Bug修复分支**：从`develop`分支创建，修复完成后合并回`develop`
5. **热修复分支**：从`main`分支创建，修复完成后同时合并回`main`和`develop`
6. **发布分支**：从`develop`分支创建，进行发布前的准备工作，完成后合并回`main`和`develop`

---

## 📝 提交规范

为了保持提交记录的清晰和一致，我们采用以下提交规范：

### 1. 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. 提交类型（type）

- **feat**：新功能开发
- **fix**：Bug修复
- **docs**：文档更新
- **style**：代码格式调整（不影响代码逻辑）
- **refactor**：代码重构（不添加新功能，不修复Bug）
- **test**：测试相关（添加/修改测试用例）
- **chore**：构建过程或辅助工具的变动
- **perf**：性能优化
- **ci**：CI/CD配置文件更新
- **revert**：回滚代码

### 3. 提交范围（scope）

可选，用于指定提交影响的模块：

- **web**：Web端相关
- **mobile**：App端相关
- **server**：后端服务相关
- **ai**：AI服务相关
- **agent**：AGENT服务相关
- **mcp**：MCP服务相关
- **docs**：文档相关
- **common**：公共组件相关

### 4. 提交主题（subject）

- 简短描述提交内容（不超过50个字符）
- 使用祈使句（如："Add", "Fix", "Update"）
- 首字母大写
- 结尾不添加句号

### 5. 提交内容（body）

可选，详细描述提交内容：

- 解释提交的原因和解决的问题
- 描述实现方式和思路
- 可以使用多行

### 6. 提交尾部（footer）

可选，用于关闭Issue或添加其他信息：

- **关闭Issue**：`Closes #123`或`Fixes #456`
- **Breaking Changes**：说明不兼容的变更

### 7. 提交示例

```
feat(web): 添加合同生成预览功能

1. 实现了合同生成后的实时预览功能
2. 支持PDF格式预览和下载
3. 添加了预览界面的响应式设计

Closes #123
```

```
fix(server): 修复用户登录失败的问题

修复了用户输入错误密码时的异常处理逻辑
确保返回正确的错误信息给客户端

Fixes #456
```

---

## 🔀 Pull Request流程

### 1. 创建PR前的准备

- 确保代码符合项目的代码规范
- 运行所有测试并确保通过
- 更新相关文档（如果有）
- 提交信息符合提交规范
- 确保代码没有冲突

### 2. 创建PR

1. 从功能分支向`develop`分支创建PR
2. PR标题使用：`[类型] 简短描述`（如：`[feat] 添加合同生成预览功能`）
3. PR描述：
   - 详细说明PR的目的和内容
   - 描述实现方式和思路
   - 关联相关Issue（如：`Closes #123`）
   - 提供测试步骤和预期结果
   - 添加截图或视频演示（如果有UI变更）

### 3. PR审核

- 项目维护者将对PR进行代码评审
- 审核内容包括：代码质量、功能实现、测试覆盖、文档更新等
- 审核过程中可能会提出修改意见
- 开发者需要根据意见进行修改并提交

### 4. PR合并

- 审核通过后，由项目维护者将PR合并到目标分支
- 合并后自动删除源分支
- CI/CD流程将自动执行测试和构建

---

## 🐛 问题反馈流程

### 1. 报告Bug

在GitHub Issues中报告Bug时，请包含以下信息：

- **问题描述**：清晰、详细地描述Bug现象
- **复现步骤**：列出复现Bug的具体步骤
- **预期结果**：描述正常情况下应该发生的结果
- **实际结果**：描述实际发生的结果
- **环境信息**：操作系统、浏览器/设备版本、项目版本
- **日志信息**：相关的错误日志、控制台输出
- **截图/视频**：如果有UI相关问题，请提供截图或视频

Bug报告示例：

```
标题：[Bug] 合同生成后无法预览PDF

问题描述：
在Web端生成合同后，点击"预览PDF"按钮没有响应，控制台显示JavaScript错误。

复现步骤：
1. 登录Web端
2. 进入采购合同模块
3. 上传报价单并生成合同
4. 点击"预览PDF"按钮

预期结果：
弹出PDF预览窗口或下载PDF文件

实际结果：
按钮点击后无响应，控制台显示："Uncaught TypeError: Cannot read property 'preview' of undefined"

环境信息：
- 操作系统：Windows 11
- 浏览器：Chrome 114.0.5735.199
- 项目版本：v1.0.0-beta

日志信息：
[控制台输出] Uncaught TypeError: Cannot read property 'preview' of undefined at contractPreview.js:45

截图：
[附上相关截图]
```

### 2. 提出功能建议

在GitHub Issues中提出功能建议时，请包含以下信息：

- **功能描述**：清晰、详细地描述建议的功能
- **功能需求**：说明为什么需要这个功能，解决什么问题
- **使用场景**：描述功能的使用场景和用户群体
- **实现思路**：（可选）提出实现这个功能的思路和建议
- **参考示例**：（可选）提供类似功能的参考示例

---

## 🧪 测试要求

### 1. 测试类型

- **单元测试**：测试单个函数、组件的功能
- **集成测试**：测试模块之间的接口和交互
- **端到端测试**：测试完整的业务流程
- **性能测试**：测试系统的性能和响应时间
- **安全测试**：测试系统的安全性和漏洞

### 2. 测试覆盖率

- 新功能的测试覆盖率不低于80%
- Bug修复必须添加对应的测试用例
- 核心功能的测试覆盖率不低于90%

### 3. 运行测试

#### 单元测试

```bash
# Web端单元测试
cd web
npm run test:unit

# 后端单元测试
cd server
npm run test:unit
```

#### 集成测试

```bash
# Web端集成测试
cd web
npm run test:integration

# 后端集成测试
cd server
npm run test:integration
```

#### 端到端测试

```bash
# Web端端到端测试
cd web
npm run test:e2e
```

---

## 📚 文档贡献

### 1. 文档类型

- **项目文档**：README.md、CONTRIBUTING.md、tech-stack.md等
- **用户文档**：使用教程、功能说明、常见问题等
- **开发文档**：API文档、技术架构、数据库设计等
- **API文档**：接口说明、参数定义、返回值等

### 2. 文档规范

- 使用Markdown格式编写
- 保持文档结构清晰、层次分明
- 使用统一的标题格式（#、##、###）
- 添加适当的代码示例和截图
- 保持文档的时效性和准确性

### 3. API文档生成

后端API文档使用Swagger自动生成：

```bash
cd server
npm run docs
```

访问：http://localhost:3001/api-docs

---

## 🎯 行为准则

我们期望所有贡献者遵循以下行为准则：

- **尊重他人**：尊重不同的观点和意见，保持友好的沟通
- **包容开放**：欢迎来自不同背景和经验的贡献者
- **协作共赢**：鼓励团队协作，共同解决问题
- **诚实守信**：不提交虚假代码、不抄袭他人作品
- **负责任**：对自己的贡献负责，确保代码质量
- **遵守法律**：遵守相关法律法规，不提交违法内容

---

## 📞 联系方式

如果您在贡献过程中遇到问题，可以通过以下方式联系我们：

- **GitHub Issues**：https://github.com/your-username/smart-contract-platform/issues
- **邮件**：contact@smart-contract.ai
- **Discord**：（待创建）
- **微信**：（待创建）

---

## 🌟 贡献者激励

我们会定期在项目README中表彰活跃的贡献者，包括：

- **代码贡献者**：提交高质量代码的开发者
- **文档贡献者**：完善项目文档的贡献者
- **问题解决者**：积极参与讨论和解决问题的贡献者
- **测试贡献者**：编写测试用例和发现Bug的贡献者

---

感谢您的贡献！我们期待与您一起打造更优秀的智合同平台！

---

**智合同开发团队**  
**最后更新时间**：2024年7月1日  
**版本号**：v1.0

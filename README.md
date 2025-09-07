# Inky Plus

基于 [Niky](https://gitee.com/firzencode/niky) 项目的进一步迭代开发版本

本项目继承了 Niky 的所有功能特性，并在此基础上新增了强大的 AI 辅助功能和多主题导出功能，为 Ink 交互小说创作提供更智能、更美观的开发体验。

## 🚀 新增功能

### AI 功能
- [x] **AI 故事生成器** - 基于主题、角色、背景等参数智能生成完整的 Ink 故事框架
- [x] **AI 语法修复** - 自动检测并修复 Ink 语法错误，提升开发效率
- [x] **智能配置** - 支持 OpenAI 及兼容接口的灵活配置

### 多主题导出
- [x] **6种精美主题** - 默认主题、森林、赛博朋克、克苏鲁、科幻、魔幻
- [x] **一键导出** - 选择主题后自动生成包含所有必要文件的完整文件夹
- [x] **主题定制** - 每个主题都有独特的视觉风格和配色方案
- [x] **响应式设计** - 支持桌面和移动设备完美显示

## 📋 继承功能列表

基于 Niky 项目的完整功能：

- [x] **中文优化** - 顶部中文菜单、机翻中文帮助文档、中文字体优化
- [x] **存档优化** - 无限存档位支持
- [x] **单句模式** - 开启后每次点击出现一句话
- [x] **图片功能改进** - 可控制图片大小，支持背景图片设置
- [x] **音乐音效改进** - 更便捷的背景音乐和音效控制方式
- [x] **随机数改进** - 可选在读档后动态设置随机数种子
- [x] **输入框功能** - 通过输入框获取用户输入并保存到变量
- [x] **界面优化** - 修复选项显示问题等用户体验改进

## 🎯 项目继承关系

```
Inky (原版) → Niky (中文优化版) → Inky Plus (AI增强版)
```

- **Inky**: inkle 公司开发的原版 [inky](https://github.com/inkle/inky) 编辑器
- **Niky**: [firzencode](https://gitee.com/firzencode/niky) 开发的中文优化版本
- **Inky Plus**: 本项目，在 Niky 基础上增加 AI 辅助功能

## 🤖 AI 功能使用指南

### AI 故事生成器

1. 点击工具栏中的 ⚡ 按钮打开 AI 故事生成器
2. 填写故事参数：
   - **主题**: 如赛博朋克、蒸汽朋克等
   - **主角**: 角色设定和描述
   - **背景**: 故事发生的时间地点
   - **冲突**: 核心矛盾和目标
   - **基调**: 选择故事的情感色彩
3. 点击"🎲 智能随机生成"可一键生成完整配置
4. 点击"生成故事"开始 AI 创作

### AI 语法修复

1. 当编辑器检测到 Ink 语法错误时
2. 点击工具栏中的 🔧 按钮
3. AI 会自动分析错误并提供修复方案
4. 预览修复结果后选择是否应用

### AI 设置配置

1. 点击工具栏中的 ⚙️ 按钮
2. 配置 API 参数：
   - **提供商**: OpenAI 或自定义兼容接口
   - **API Key**: 你的 API 密钥
   - **模型**: 如 gpt-4, gpt-3.5-turbo 等
   - **参数**: 温度值、最大 Token 数等

## 🎨 多主题导出功能

### 支持的主题

| 主题名称 | 预览 | 特色描述 |
|---------|------|----------|
| **默认主题** | 📄 | 经典的 Inky 默认样式，简洁大方 |
| **森林** | 🌲 | 宁静森林风格，适合叙事类故事 |
| **赛博朋克** | 🌆 | 霓虹闪烁的未来都市风格 |
| **克苏鲁** | 📜 | 古老神秘的诡异氛围 |
| **科幻** | 🚀 | 全息投影的未来科技感 |
| **魔幻** | 🏰 | 中世纪魔法卷轴风格 |

### 使用方法

1. **准备故事** - 在 Inky Plus 中编写或加载你的 Ink 故事
2. **点击导出** - 点击工具栏右侧的 📤 按钮
3. **选择主题** - 从6种主题中选择你喜欢的样式
4. **选择文件夹** - 选择导出目标文件夹
5. **自动导出** - 系统自动生成包含所有文件的完整文件夹

### 导出文件结构

```
你的导出文件夹/
├── index.html      # 主页面文件
├── style.css       # 主题样式文件
├── main.js         # Ink 运行时
├── ink.js          # Ink 引擎
└── story.js        # 你的故事内容
```

### 特色功能

- **🎨 主题定制** - 每个主题都有独特的配色和视觉效果
- **📱 响应式设计** - 完美支持桌面和移动设备
- **⚡ 一键导出** - 选择主题后自动完成所有文件生成
- **🎯 即开即用** - 双击 index.html 即可在浏览器中体验
- **💾 完整保存** - 支持游戏进度保存和读取功能

### 主题特色说明

#### 🌲 森林
- 绿色系配色，营造宁静自然氛围
- 适合叙事性强的故事
- 温暖舒适的阅读体验

#### 🌆 赛博朋克主题
- 霓虹绿和深色背景
- 数字风格字体
- 未来科技感视觉效果

#### 📜 克苏鲁主题
- 金色和深色调
- 古老神秘的氛围
- 哥特式字体设计

#### 🚀 科幻主题
- 蓝色科技感
- 全息投影效果
- 现代科幻风格

#### 🏰 魔幻主题
- 金色华丽装饰
- 中世纪风格
- 魔法卷轴效果

## 📖 Niky 功能使用说明

### 中文优化

对字体做了一些调整

![alt text](image.png)

完整的中文文档（基于 GPT 翻译）
![alt text](image-1.png)

### 存档优化

无限存档和读档位置

![alt text](image-2.png)

![alt text](image-3.png)

### 单句模式

```
开启：
# SINGLE_SENTENCE: on

关闭：
# SINGLE_SENTENCE: off
```
![alt text](intro_single_sentence.gif)

### 带宽度的图片

注意，所有的图片、音乐等远程链接，开头的 // 需要替换成 \/\/

```
显示图片
# IMAGE: <图片远程地址或相对路径>
例如
# IMAGE: https:\/\/ahayoo.com/inky-sample-1/image.jpeg
# IMAGE: ./image.jpeg

控制图片宽度
# SIZE_IMAGE: <宽度>@<图片远程地址或相对路径>
宽度可以使用 0% ~ 100% 相对文字区域宽度，也可以用 px 等单位

例如
# SIZE_IMAGE: 50%@https:\/\/ahayoo.com/inky-sample-1/image.jpeg
# SIZE_IMAGE: 200px@https:\/\/ahayoo.com/inky-sample-1/image.jpeg
```

### 背景图片

```
显示背景图片
# BG_IMAGE: <图片远程地址或相对路径>
例如
# BG_IMAGE: https:\/\/www.ahayoo.com/inky-sample-1/white_bg_1.jpeg
# BG_IMAGE: ./white_bg_1.jpeg

隐藏
# BG_IMAGE: hide
```

### 背景音乐

背景音乐会自动无限循环

```
播放
# BGM: <音乐远程路径或本地相对路径>
例如
# BGM: http:\/\/downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3
# BGM: my_music.mp3

停止 
# BGM: stop

暂停 
# BGM: pause

恢复 
# BGM: resume
```

### 音效

只会播放一次

```
播放 
# SE: <音乐远程路径或本地相对路径>
例如
# SE: http:\/\/downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3
# SE: my_se.mp3
```

### 随机数改动

通常，Inky 会保存随机数种子，这意味着，即使你重新读档，下一个随机数依然是固定的

可以通过重置随机数功能，在每次读档之后，重置随机数种子，使得下一个随机数变的不一样

使用方式：

本功能无法使用 TAG 控制，需要修改项目中的 main.js 文件

在 main.js 文件中搜索以下内容

```js
let refreshRandomSeedWhenLoad = false
```

将它改为

```js
let refreshRandomSeedWhenLoad = true
```

### 输入框

可以让用户输入内容，并改变变量的值

```
# INPUT: <变量名>

并且，INPUT 的下一行需要放一行输入的说明

例如
# INPUT: user_name
请输入你的姓名

```

## 🛠️ 开发与构建

### 环境要求
- Node.js 14+
- npm 或 yarn

### 安装依赖
```bash
cd app
npm install
```

### 运行开发版本
```bash
# macOS/Linux
./RUN.command

# Windows
RUN.bat
```

### 构建发布版本
```bash
# macOS
./BUILD_FOR_MAC.command

# Linux
./BUILD_FOR_LINUX.sh

# Windows
BUILD_FOR_WINDOWS.bat
```

### 主题开发

项目支持自定义主题开发。要添加新主题：

1. **创建主题文件夹**
   ```bash
   mkdir app/export-themes/your-theme-name
   ```

2. **创建必要文件**
   - `index.html` - 基于默认模板的HTML结构
   - `style.css` - 主题样式文件

3. **注册主题**
   在 `app/renderer/plus/aiStoryGenerator.js` 中的 `getAvailableThemes()` 方法中添加新主题配置

4. **样式要求**
   - 支持响应式设计
   - 包含 modal/dialog 样式
   - 支持深色主题
   - 美化滚动条样式

### 项目结构
```
app/
├── export-themes/          # 主题文件夹
│   ├── default/            # 默认主题
│   ├── forest/             # 森林
│   ├── cyberpunk/          # 赛博朋克主题
│   ├── cthulhu/            # 克苏鲁主题
│   ├── sci-fi/             # 科幻主题
│   └── fantasy/            # 魔幻主题
├── export-for-web-template/ # 默认导出模板
└── renderer/
    └── plus/
        ├── aiStoryGenerator.js  # AI功能和主题导出
        └── enhanced-toolbar.css # 样式文件
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📄 许可证

本项目基于 MIT 许可证开源

### 原始许可证声明

The MIT License (MIT)  
Copyright (c) 2016 inkle Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🙏 致谢

- 感谢 [inkle](https://github.com/inkle/inky) 提供的原版 Inky 编辑器
- 感谢 [firzencode](https://gitee.com/firzencode/niky) 开发的 Niky 中文优化版本
- 感谢 [Google Fonts](https://fonts.google.com/) 提供的优质字体资源
- 感谢 [@https://googlefonts.cn/](https://googlefonts.cn/) 提供的优质中文字体资源
- 感谢所有为开源社区做出贡献的开发者们

### AI 功能支持

- 基于 OpenAI GPT 系列模型提供智能故事生成
- 支持自定义 API 端点和兼容接口
- 智能语法错误检测和修复功能

### 主题设计灵感

- **森林**: 受自然宁静环境启发
- **赛博朋克主题**: 致敬经典科幻作品《神经漫游者》
- **克苏鲁主题**: 受 H.P. Lovecraft 神话体系启发
- **科幻主题**: 现代科幻美学设计
- **魔幻主题**: 中世纪奇幻文学风格

---

**💡 提示**: 如果你在使用过程中遇到问题，欢迎在 [Issues](../../issues) 页面提交反馈，我们会尽快响应并解决！

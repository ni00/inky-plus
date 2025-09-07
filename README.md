# Inky Plus

基于 [Niky](https://gitee.com/firzencode/niky) 项目的进一步迭代开发版本

本项目继承了 Niky 的所有功能特性，并在此基础上新增了强大的 AI 辅助功能，为 Ink 交互小说创作提供更智能的开发体验。

## 🚀 新增 AI 功能

- [x] **AI 故事生成器** - 基于主题、角色、背景等参数智能生成完整的 Ink 故事框架
- [x] **AI 语法修复** - 自动检测并修复 Ink 语法错误，提升开发效率  
- [x] **多主题导出** - 支持多种主题样式的 Web 导出功能
- [x] **智能配置** - 支持 OpenAI 及兼容接口的灵活配置

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
- 感谢所有为开源社区做出贡献的开发者们

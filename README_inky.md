![](resources/icon-small.jpg)

原始 README 已由 GPT 翻译为中文，如需查看原始 README，请点击[此处](https://github.com/inkle/inky/blob/master/README.md)。

# Inky

**Inky** 是一种 [ink](http://www.inklestudios.com/ink) 编辑器，**ink** 是由 [inkle](http://www.inklestudios.com/) 开发的交互叙事标记语言，已被运用于游戏 [80 Days](http://www.inklestudios.com/80days) 中。Inky 是一个 IDE（集成开发环境），因为它在同一个应用中让你可以一边编写，一边在编辑器中进行测试，并在代码中出现问题时进行调试与修正。

![](resources/screenshot.gif)

## 功能特性

- **边写边玩**：播放面板会记忆你所做的选择，当 Inky 重新编译时，它会快速前进到你在流程中停留的最后位置。
- **语法高亮**
- **实时错误高亮**：Inky 会持续地编译你的 ink 脚本，让你可以在错误变得严重之前及时修正。
- **问题浏览器**：列出你的 **ink** 中的错误、警告和 TODO，并允许你跳转到指定的行号和文件位置。
- **跳转到定义**：转向目标（例如 `-> theStreet`）会以超链接的方式呈现，可通过按下 `Alt` 再点击来跳转。
- **支持多文件项目**：Inky 能根据 `INCLUDE` 行自动推断故事结构，因此不需要额外的项目文件。要创建新的包含文件，只需在需要的位置键入 `INCLUDE yourfile.ink`。
- **导出到 JSON**：虽然如果你使用 [ink-Unity-integration 插件](https://assetstore.unity.com/packages/tools/integration/ink-unity-integration-60055) 并不需要此步骤，但 Inky 允许你将故事导出为 ink 编译后的 JSON 格式。这对于使用其他 ink 运行时（如 [inkjs](https://github.com/y-lohse/inkjs)）在网页上运行 ink 十分有用。
- **文件监听**：现代文本编辑器，包括 Inky，都能监听磁盘上的文件变化，因此如果文件在外部发生了更改，它会进行相应的更新。这在你使用版本控制（例如 Git）来管理你的 **ink** 时尤其有用。

## 项目状态

Inky 已被多方开发者在多个项目中广泛使用。然而，它并没有一些成熟文本编辑器那么健壮或功能齐全，毕竟它是由游戏开发者在业余时间开发的专用软件。

非正式的 [TODO.md](TODO.md) 列出了部分缺失的功能和已知问题。如果你想讨论或请求新的修复或功能，请[创建一个 GitHub issue](http://www.github.com/inkle/inky/issues)。

想要了解关于 ink 的最新消息，请[注册邮件列表](http://www.inklestudios.com/ink#signup)。

## 下载

### Mac、Windows 和 Linux

[下载最新版本](http://www.github.com/inkle/inky/releases/latest)

## 项目设置文件

**警告：仅适用于有技术背景的用户——你需要了解 JSON 文件的概念！**

若要为特定的 ink 项目自定义 Inky 设置，请创建一个与主 ink 文件同名，但扩展名为 `.settings.json` 的 JSON 文件。例如，如果你的主 ink 文件为 `my_great_story.ink`，则该 JSON 文件应命名为 `my_great_story.settings.json`。

下面是一个示例设置文件：

```json
{
    "customInkSnippets": [
        {
            "name": "Heaven's Vault",
            "submenu": [
                {
                    "name": "Camera",
                    "ink": ">>> CAMERA: Wide shot"
                },
                {
                    "separator": true
                },
                {
                    "name": "Walk",
                    "ink": ">>> WALK: TheInscription"
                },
                {
                    "name": "More snippets",
                    "submenu": [
                        {
                            "name": "A snippet in a submenu",
                            "ink": "This snippet of ink came from a submenu."
                        }
                    ]
                }
            ]
        }
    ],

    "instructionPrefix": ">>>"
}
```

* `customInkSnippets` - 此数组允许你为项目添加自定义的 ink 代码片段到 Ink 菜单中。数组中可以包含三种类型的项：
    * **Ink 代码片段**：需要提供 `name`（菜单项名称）和 `ink`（将插入编辑器的 ink 代码片段）。
    * **分隔符**：使用 `{"separator": true}` 在菜单中插入一条水平分隔线。
    * **子菜单**：若要在子菜单中嵌套更多代码片段，可提供 `name`（子菜单名称）和 `submenu`（以相同格式的数组）。

* `instructionPrefix` - 在 ink 中，常见的做法是使用特定文本格式来表示指令，让游戏执行某些操作，而不将其文本直接呈现给玩家。

    例如，在 inkle，我们可能会在 ink 中写入 `>>> CAMERA: BigSwoop`。`>>>` 并不是 ink 内置的内容，这整行文本都会作为纯文本传递给游戏逻辑，但游戏代码会对其进行解释，从而在游戏中触发相应的动作。为支持这种行为，你可以定义一个 *instructionPrefix*。当 Inky 看到这个前缀时，会在编辑器和播放器视图中高亮该行，以清晰区分它与普通的游戏文本。

## 实现细节

Inky 是基于以下技术构建的：

* [Electron](http://electron.atom.io/)：GitHub 推出的框架，可使用 HTML、CSS 和 JavaScript 构建跨平台的桌面应用。
* [Ace](https://ace.c9.io/#nav=about)：一款为 Web 构建的全功能代码编辑器。
* [Photon](http://photonkit.com/)：用于部分组件的界面框架。不过依赖可能可以去除，因为只在少量 CSS 中使用。

Inky 内置了一份 **inklecate**（ink 的命令行编译器）的副本。

## 参与 Inky 开发！

查看 [issues 页面](https://github.com/inkle/inky/issues) 中带有“help wanted”标签的问题。当我们添加此标签时，会尝试提供一些关于如何开始开发该功能的基本说明。

构建项目步骤：

* 安装 [node.js](https://nodejs.org/en/)（如果还没有的话）
* 克隆此仓库
* 在 Mac 上，双击 `INSTALL_AND_RUN.command` 脚本。在 Windows 上，打开 Powershell，进入应用目录，然后输入 `npm install`，再输入 `npm start`。
* 后续运行时，如果没有 npm 包更新，你可以在 Mac 上运行 `RUN.command` 脚本，或在 Windows 上运行 `npm start` 来启动。

### Linux

在 **Ubuntu 16.04 LTS** 全新虚拟机安装上测试通过（_其他发行版应有类似步骤_）

* 安装构建工具
```bash
sudo apt-get install -y dkms build-essential linux-headers-generic linux-headers-$(uname -r)
```

* 必要依赖
```bash
sudo apt install git
sudo apt install curl
```

* 安装 node 和 npm
```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* 根据 http://www.mono-project.com/download/stable/#download-lin 安装 mono
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb http://download.mono-project.com/repo/ubuntu stable-xenial main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list
sudo apt-get update
sudo apt-get install mono-complete
```

* 克隆 inky 仓库
```bash
git clone https://github.com/inkle/inky.git
```

* 测试使用 mono 运行 inklecate_win（应输出使用信息）
```bash
mono app/main-process/ink/inklecate_win.exe
```

* 安装并运行 inky
```bash
./INSTALL_AND_RUN.command
```

* 后续运行（若没有 npm 包变更），可使用下列命令启动（否则请重新运行上述安装命令）：
```bash
./RUN.command
```

### 翻译

翻译文件位于 `app/main-process/i18n/` 目录下。  
如果缺少特定的语言文件（或缺少某些键值），你可以使用以下命令生成：  
`cd app && npm run generate-locale -- <locale> ./main-process/i18n/`。

## 许可证

**Inky** 和 **ink** 均以 MIT 许可证发布。虽然我们不要求署名，但如果你在项目中使用了 **ink**，我们非常想知道！请在 [Twitter](http://www.twitter.com/inkleStudios) 或 [email](mailto:info@inklestudios.com) 告诉我们。

The MIT License (MIT)
Copyright (c) 2016 inkle Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Inky 的命名灵感来自于一只居住在英国剑桥的黑猫。*
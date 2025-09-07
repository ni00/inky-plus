// AI 故事生成服务
const { createOpenAICompatible } = require('@ai-sdk/openai-compatible');
const { generateText } = require('ai');

const AIService = {
    // 生成故事的提示词模板
    createStoryPrompt(config, aiConfig) {
        return `# 角色
你是一位专业的互动小说作家，并且是 Inkle's Ink 脚本语言的专家。你擅长构建引人入胜的故事情节、设计富有意义的玩家选择，并使用 Ink 的高级功能来创造动态的、有状态的叙事体验。

# 任务
你的任务是为一款基于文本的冒险游戏，生成一个完整的、可以直接在 Inky 编辑器中运行的 .ink 文件内容。你需要根据我提供的故事背景和要求，创作一个包含多个分支、有状态变量和条件逻辑的短篇故事。

设定信息：
- 主题：${config.theme}
- 主角：${config.protagonist}
- 背景设定：${config.setting}
- 核心冲突：${config.conflict}
- 故事基调：${config.tone.join('、')}

1. 使用标准的Ink语法格式
2. 包含变量系统（如health、gold、reputation等）
3. 设计多个分支选择和结局
4. 故事应该有至少5-8个重要的选择节点
5. 包含角色成长和状态变化
6. 确保语法正确，可以被Ink引擎编译
7. 故事长度适中，大约${Math.floor(aiConfig.maxTokens)}字
8. 变量 (Variables): 在文件开头使用 VAR 声明至少 2-3 个用于跟踪故事状态的全局变量。例如：VAR reputation = 0，VAR has_security_pass = false，VAR energy = 100。
9. 结构 (Structure): 使用 === knot_name === 来定义主要的故事节点（场景）。故事必须从 === main === 或 === start === 开始。在 Knot 内部，可以使用 = stitch_name 来组织更小的片段。当出现 "= stitch_name" 时，必须提前显式写出 "-> stitch_name" 后再继续内容，不要依赖引擎自动进入该 stitch，以避免无输出或提前结束。=== knot_name === 之后不要直接使用 =stitch_name ，除非你十分确定需要一个 =stitch_name。
10. 选择 (Choices):
    使用  * 提供推动故事向前发展的一次性选择。
    使用 + 提供可以让玩家重复查看信息或执行动作的"粘性"选择。
    确保选择项不仅仅是"A 或 B"，而是能真正影响后续情节或改变变量。
11. 条件逻辑 (Conditional Logic):
    使用 {...} 语法来根据变量值动态显示不同的文本或选项。
    例如：你感觉{energy > 50:精力充沛|筋疲力尽}。
    例如，条件判断的选择项： {has_security_pass} [出示通行证]。不要错误的写成 [出示通行证]{has_security_pass} 。条件必须写在选择前面；放在后面就是普通行内逻辑，会把布尔值打印出来。
12. 跳转 (Diverts): 使用 -> 将故事流无缝地引导到不同的 Knot 或 Stitch。故事的最终结局应跳转到 -> END。
13. 注释 (Comments): 在代码中适当地使用 // 添加注释，以解释关键的逻辑或设计意图。
14. 标签 (Tags): 可以在适当的地方使用 # 标签来建议视觉或听觉效果，例如 # IMAGE: city_skyline.png 或 # AUDIO: tense_music.mp3。
15. 多样性: 确保故事至少有 2 个不同的结局，结局的好坏取决于玩家的选择和最终的变量状态。
16. 唯一入口和唯一出口:  -> DONE：仅结束当前的执行流程；-> END：彻底终结整个故事 ； -> start 起始结点显式指向；
17. 缩进建议 (Indentation): 缩进可使用 Tab 或空格，但请保持同一文件内风格一致，避免混用导致层级误判。


# 输出格式
你的输出必须是纯文本格式的完整 .ink 代码。
不要在代码块前后添加任何额外的解释、介绍或总结。所有说明都应以 Ink 注释 // 的形式包含在代码内部。
确保代码格式清晰，缩进正确，以便于阅读和调试。


示例格式(你的输出不需要包含\`\`\`ink和\`\`\`)：
\`\`\`ink
// 变量声明
VAR has_key = false
VAR sanity = 10

->start
=== start ===
你在一间昏暗的房间醒来，头痛欲裂。
一扇锁着的门挡住了你的去路。
* [检查桌子]
    你发现了一把生锈的钥匙。
    ~ has_key = true
    -> start
* {has_key} [用钥匙开门]
    -> escape
* [大声呼救]
    回声在空荡的房间里回响，但无人应答。你的理智下降了。
    ~ sanity = sanity - 1
    -> start

=== escape ===
-> escape_room
= escape_room
你成功逃出了房间。
{sanity > 5:
    你感到一阵轻松，重获自由。
}
{sanity <= 5:
    你虽然逃了出来，但无尽的恐惧攫住了你。
}
-> END
\`\`\`

现在请开始创作：`;
    },

    // 创建AI模型实例
    createModel(aiConfig) {
        if (aiConfig.provider === 'openai') {
            // 使用兼容接口连接OpenAI官方API
            const provider = createOpenAICompatible({
                name: 'openai',
                apiKey: aiConfig.apiKey,
                baseURL: 'https://api.openai.com/v1',
            });
            return provider(aiConfig.model);
        } else if (aiConfig.provider === 'custom') {
            const provider = createOpenAICompatible({
                name: 'custom-provider',
                apiKey: aiConfig.apiKey,
                baseURL: aiConfig.baseURL,
            });
            return provider(aiConfig.model);
        }
        throw new Error(`不支持的AI提供商: ${aiConfig.provider}`);
    },

    // 真实的AI生成
    async generateStory(config, onProgress, aiConfig) {
        const prompt = this.createStoryPrompt(config, aiConfig);

        try {
            // 创建AI模型实例
            const model = this.createModel(aiConfig);

            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 80) progress = 80; // 保留20%用于完成
                if (onProgress) onProgress(progress);
            }, 300);

            // 调用AI API生成故事
            const { text } = await generateText({
                model: model,
                prompt: prompt,
                temperature: aiConfig.temperature,
                maxTokens: aiConfig.maxTokens,
            });

            clearInterval(progressInterval);
            if (onProgress) onProgress(100);

            // 验证生成的代码是否为有效的Ink格式
            if (!this.isValidInkCode(text)) {
                console.warn('生成的代码可能不是有效的Ink格式');
            }

            return text;

        } catch (error) {
            throw new Error(`AI生成失败: ${error.message}`);
        }
    },

    // 检查是否为有效的Ink代码
    isValidInkCode(code) {
        // 基本验证：检查是否包含Ink的基本语法元素
        return code.includes('->') && (code.includes('===') || code.includes('-> END'));
    },

};
module.exports = { AIService };

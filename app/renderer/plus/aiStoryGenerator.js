// AI 故事生成器模块
const $ = window.jQuery = require('../jquery-2.2.3.min.js');
const { AIService } = require('./aiService.js');
const EditorView = require('../editorView.js').EditorView;
const LiveCompiler = require('../liveCompiler.js').LiveCompiler;
const Swal = require('sweetalert2');

class AIStoryGenerator {
    constructor() {
        this.init();
    }

    init() {
        this.injectHTML();
        this.bindEvents();
    }

    // 动态注入HTML
    injectHTML() {
        // 注入Enhanced Toolbar
        const toolbarHTML = `
            <!-- Enhanced Toolbar -->
            <div id="enhanced-toolbar" class="draggable">
                <div class="buttons left">
                    <div class="button ai-story-generator i18n" title="AI Story Generator">
                        <span class="icon icon-flash"></span>
                    </div>
                    <div class="button ai-settings i18n" title="AI Settings">
                        <span class="icon icon-cog"></span>
                    </div>
                </div>

                <div class="buttons center">
                    <div class="button ink-syntax-fixer i18n" title="Ink Syntax AI Fixer">
                        <span class="icon icon-tools"></span>
                    </div>
                </div>

                <div class="buttons right">
                    <div class="button export-compiled i18n" title="Export Compiled Story">
                        <span class="icon icon-export"></span>
                    </div>
                </div>
            </div>
        `;

        // 将HTML注入到适当位置
        $('.window h1.title').after(toolbarHTML);
    }

    // 显示AI设置对话框
    async showSettingsDialog() {
        const currentConfig = this.getAISettings();

        const result = await Swal.fire({
            title: 'AI 设置',
            html: this.createSettingsHTML(currentConfig),
            width: '720px',
            heightAuto: false,
            showCancelButton: true,
            confirmButtonText: '保存设置',
            cancelButtonText: '取消',
            customClass: {
                popup: 'ai-settings-popup',
                confirmButton: 'btn-primary',
                cancelButton: 'btn-secondary'
            },
            preConfirm: () => {
                return this.getSettingsData();
            },
            didOpen: (popup) => {
                // 设置最大高度为页面高度的80%（比故事生成器稍小）
                const maxHeight = window.innerHeight * 0.8;
                popup.style.maxHeight = maxHeight + 'px';

                // 确保内容可滚动
                const content = popup.querySelector('.swal2-html-container');
                if (content) {
                    content.style.maxHeight = (maxHeight - 140) + 'px';
                    content.style.overflowY = 'auto';
                    content.style.paddingRight = '10px';
                }

                this.bindSettingsEvents();
            }
        });

        if (result.isConfirmed && result.value) {
            this.saveAISettings(result.value);
            await Swal.fire({
                icon: 'success',
                title: '设置已保存',
                text: 'AI配置已更新',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    // 创建设置对话框HTML
    createSettingsHTML(config) {
        return `
            <div class="ai-settings-form">
                <!-- API配置 -->
                <div class="settings-card">
                    <div class="card-header">
                        <span class="card-icon">🔑</span>
                        <h4>API 配置</h4>
                    </div>
                    <div class="card-body">
                        <div class="form-row">
                            <div class="form-field half">
                                <label for="swal-provider">提供商</label>
                                <select id="swal-provider" class="swal2-input">
                                    <option value="openai" ${config.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
                                    <option value="custom" ${config.provider === 'custom' ? 'selected' : ''}>自定义兼容接口</option>
                                </select>
                            </div>
                            <div class="form-field half">
                                <label for="swal-api-key">API Key</label>
                                <input type="password" id="swal-api-key" class="swal2-input"
                                       value="${config.apiKey || ''}" placeholder="输入API密钥">
                            </div>
                        </div>

                        <div class="form-row custom-url-group" style="display: ${config.provider === 'custom' ? 'block' : 'none'}">
                            <div class="form-field">
                                <label for="swal-base-url">Base URL</label>
                                <input type="text" id="swal-base-url" class="swal2-input"
                                       value="${config.baseURL || ''}" placeholder="https://api.example.com/v1">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 模型配置 -->
                <div class="settings-card">
                    <div class="card-header">
                        <span class="card-icon">🤖</span>
                        <h4>模型配置</h4>
                    </div>
                    <div class="card-body">
                        <div class="form-row">
                            <div class="form-field">
                                <label for="swal-model">模型名称</label>
                                <input type="text" id="swal-model" class="swal2-input"
                                       value="${config.model || 'gpt-4'}" placeholder="gpt-4, gpt-3.5-turbo等">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-field half">
                                <label for="swal-temperature">温度 (0-2)</label>
                                <input type="number" id="swal-temperature" class="swal2-input"
                                       value="${config.temperature || 0.7}" min="0" max="2" step="0.1">
                            </div>
                            <div class="form-field half">
                                <label for="swal-max-tokens">最大Token数</label>
                                <input type="number" id="swal-max-tokens" class="swal2-input"
                                       value="${config.maxTokens || 6000}" min="100" max="1000000" step="100">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    // 绑定设置对话框事件
    bindSettingsEvents() {
        const self = this;

        // 提供商选择事件
        $('#swal-provider').on('change', function () {
            const provider = $(this).val();
            if (provider === 'custom') {
                $('.custom-url-group').show();
            } else {
                $('.custom-url-group').hide();
            }
        });
    }

    // 获取设置数据
    getSettingsData() {
        const provider = $('#swal-provider').val();
        const apiKey = $('#swal-api-key').val();
        const baseURL = $('#swal-base-url').val();
        const model = $('#swal-model').val();
        const temperature = parseFloat($('#swal-temperature').val());
        const maxTokens = parseInt($('#swal-max-tokens').val());

        // 验证必填字段
        if (!apiKey) {
            Swal.showValidationMessage('请输入API Key');
            return false;
        }

        if (provider === 'custom' && !baseURL) {
            Swal.showValidationMessage('自定义提供商需要填写Base URL');
            return false;
        }

        if (!model) {
            Swal.showValidationMessage('请输入模型名称');
            return false;
        }

        return {
            provider,
            apiKey,
            baseURL: provider === 'custom' ? baseURL : null,
            model,
            temperature,
            maxTokens
        };
    }

    // 获取AI设置
    getAISettings() {
        const defaultSettings = {
            provider: 'openai',
            apiKey: '',
            baseURL: null,
            model: 'gpt-4',
            temperature: 0.5,
            maxTokens: 6000
        };

        try {
            const saved = localStorage.getItem('ai-story-generator-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.error('Failed to load AI settings:', error);
            return defaultSettings;
        }
    }

    // 保存AI设置
    saveAISettings(settings) {
        try {
            localStorage.setItem('ai-story-generator-settings', JSON.stringify(settings));
            console.log('AI settings saved:', settings);
        } catch (error) {
            console.error('Failed to save AI settings:', error);
        }
    }

    // 显示对话框
    async showDialog() {
        const result = await Swal.fire({
            title: 'AI 故事生成器',
            html: this.createFormHTML(),
            width: '600px',
            heightAuto: false,
            showCancelButton: true,
            confirmButtonText: '生成故事',
            cancelButtonText: '取消',
            customClass: {
                popup: 'ai-story-popup',
                confirmButton: 'btn-primary',
                cancelButton: 'btn-secondary'
            },
            preConfirm: () => {
                return this.getFormData();
            },
            didOpen: (popup) => {
                // 设置最大高度为页面高度的85%
                const maxHeight = window.innerHeight * 0.85;
                popup.style.maxHeight = maxHeight + 'px';

                // 确保内容可滚动
                const content = popup.querySelector('.swal2-html-container');
                if (content) {
                    content.style.maxHeight = (maxHeight - 150) + 'px'; // 减去标题和按钮的高度
                    content.style.overflowY = 'auto';
                }

                this.bindFormEvents();
            }
        });

        if (result.isConfirmed && result.value) {
            await this.generateStory(result.value);
        }
    }

    // 创建表单HTML
    createFormHTML() {
        return `
            <div class="ai-form">
                <div class="form-group">
                    <label for="swal-theme">主题:</label>
                    <div class="input-group">
                        <input type="text" id="swal-theme" class="swal2-input" placeholder="例如：赛博朋克、蒸汽朋克..." value="赛博朋克">
                        <button type="button" class="random-btn" data-field="theme">随机</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="swal-protagonist">主角:</label>
                    <div class="input-group">
                        <input type="text" id="swal-protagonist" class="swal2-input" placeholder="主角名称和描述" value="失忆的赏金猎人">
                        <button type="button" class="random-btn" data-field="protagonist">随机</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="swal-setting">背景设定:</label>
                    <div class="input-group">
                        <input type="text" id="swal-setting" class="swal2-input" placeholder="故事发生的地点和时间" value="霓虹闪烁的未来都市，高楼林立，空中车流穿梭，地下世界暗流涌动">
                        <button type="button" class="random-btn" data-field="setting">随机</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="swal-conflict">核心冲突:</label>
                    <div class="input-group">
                        <input type="text" id="swal-conflict" class="swal2-input" placeholder="故事的主要矛盾" value="被神秘组织追杀，需要揭开自己身世之谜并阻止他们的阴谋">
                        <button type="button" class="random-btn" data-field="conflict">随机</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>故事基调:</label>
                    <div class="tone-checkboxes">
                        ${this.getToneOptions().map(tone => `<label><input type="checkbox" value="${tone}" ${tone === '黑暗深沉' ? 'checked' : ''}> ${tone}</label>`).join('')}
                    </div>
                </div>

                <div class="form-footer">
                    <button type="button" class="smart-random-btn">🎲 智能随机生成完整配置</button>
                </div>
            </div>
        `;
    }

    // 绑定表单事件
    bindFormEvents() {
        const self = this;

        // 智能随机按钮事件
        $('.smart-random-btn').on('click', function () {
            self.applySmartRandom();
        });

        // 随机按钮事件
        $('.random-btn').on('click', function () {
            const field = $(this).data('field');
            const randomValue = self.getRandomValue(field);
            if (randomValue) {
                $(`#swal-${field}`).val(randomValue);
            }
        });
    }

    // 获取表单数据
    getFormData() {
        const config = {
            theme: $('#swal-theme').val(),
            protagonist: $('#swal-protagonist').val(),
            setting: $('#swal-setting').val(),
            conflict: $('#swal-conflict').val(),
            tone: []
        };

        // 获取选中的基调
        $('.tone-checkboxes input[type="checkbox"]:checked').each(function () {
            config.tone.push($(this).val());
        });

        if (!config.theme || !config.protagonist || !config.setting || !config.conflict) {
            Swal.showValidationMessage('请填写所有必填字段');
            return false;
        }

        if (config.tone.length === 0) {
            Swal.showValidationMessage('请至少选择一种故事基调');
            return false;
        }

        return config;
    }

    // 游戏配置常量

    /**
     * 基调选项
     */
    getToneOptions() {
        return [
            "悬疑惊悚", "浪漫爱情", "冒险探索", "恐怖诡异", "喜剧幽默",
            "悲剧感人", "科幻未来", "奇幻魔法", "现实主义", "黑暗深沉",
            "温馨治愈", "史诗壮阔", "神秘莫测", "热血励志", "冷酷无情", "轻松愉快"
        ];
    }

    /**
     * 随机主题选项
     */
    getRandomThemes() {
        return [
            "赛博朋克", "蒸汽朋克", "末日废土", "太空歌剧",
            "武侠江湖", "仙侠修真", "克苏鲁神话", "维多利亚",
            "西部牛仔", "海盗传奇", "忍者秘传", "吸血鬼传说"
        ];
    }

    /**
     * 随机主角选项
     */
    getRandomProtagonists() {
        return [
            "失忆的赏金猎人", "觉醒的AI机器人", "末世的幸存者",
            "星际舰队的舰长", "隐世的武林高手", "渡劫失败的修士",
            "被诅咒的侦探", "寻求复仇的王子", "身怀秘密的少女",
            "退役的传奇英雄", "被通缉的魔法师", "觉醒异能的普通人"
        ];
    }

    /**
     * 随机故事设定选项
     */
    getRandomSettings() {
        return [
            "霓虹闪烁的未来都市，高楼林立，空中车流穿梭，地下世界暗流涌动",
            "核战后的荒芜废土，变异生物横行，幸存者建立据点艰难求生",
            "浩瀚无垠的宇宙深空，星舰在星云间航行，未知文明等待探索",
            "刀光剑影的古代江湖，门派林立，武功秘籍引发血雨腥风",
            "灵气复苏的现代都市，修真者隐藏在普通人中，妖魔鬼怪悄然现世",
            "蒸汽与机械轰鸣的维多利亚时代，齿轮与发条驱动着文明的前进",
            "被浓雾笼罩的诡异小镇，古老的传说正在苏醒，不可名状的恐怖潜伏",
            "魔法与剑并存的奇幻大陆，龙族翱翔天际，各族争霸战火纷飞"
        ];
    }

    /**
     * 随机冲突/目标选项
     */
    getRandomConflicts() {
        return [
            "必须在七天内找到失落的神器，否则世界将陷入永恒的黑暗",
            "被神秘组织追杀，需要揭开自己身世之谜并阻止他们的阴谋",
            "肩负拯救濒临毁灭的世界的使命，必须集齐散落在各地的力量碎片",
            "为了替被灭门的师门报仇，需要找出幕后真凶并重建门派荣光",
            "被困在时间循环中，必须找到打破循环的关键节点和真相",
            "体内封印着上古邪神，需要学会控制力量并阻止邪神复苏",
            "被选为命运之子，必须在各方势力争夺中走出自己的道路",
            "记忆被人为篡改，需要找回真实记忆并面对残酷的真相"
        ];
    }

    /**
     * 随机基调组合选项
     */
    getRandomToneCombinations() {
        return [
            ["黑暗深沉", "悬疑惊悚", "冷酷无情"],        // 赛博朋克
            ["科幻未来", "冒险探索", "热血励志"],        // 蒸汽朋克
            ["恐怖诡异", "黑暗深沉", "悲剧感人"],        // 末日废土
            ["科幻未来", "史诗壮阔", "冒险探索"],        // 太空歌剧
            ["热血励志", "史诗壮阔", "悲剧感人"],        // 武侠江湖
            ["奇幻魔法", "史诗壮阔", "神秘莫测"],        // 仙侠修真
            ["恐怖诡异", "神秘莫测", "黑暗深沉"],        // 克苏鲁神话
            ["浪漫爱情", "现实主义", "温馨治愈"],        // 维多利亚
            ["冒险探索", "热血励志", "轻松愉快"],        // 西部牛仔
            ["冒险探索", "史诗壮阔", "热血励志"],        // 海盗传奇
            ["神秘莫测", "冷酷无情", "热血励志"],        // 忍者秘传
            ["恐怖诡异", "浪漫爱情", "悲剧感人"]         // 吸血鬼传说
        ];
    }

    // 预设值库
    getPresetValues() {
        return {
            theme: this.getRandomThemes(),
            protagonist: this.getRandomProtagonists(),
            setting: this.getRandomSettings(),
            conflict: this.getRandomConflicts()
        };
    }

    // 获取随机值
    getRandomValue(field) {
        const values = this.getPresetValues()[field];
        if (values && values.length > 0) {
            return values[Math.floor(Math.random() * values.length)];
        }
        return "";
    }

    // 智能随机生成（根据主题随机相关配置）
    getSmartRandomConfig() {
        const themes = this.getRandomThemes();
        const protagonists = this.getRandomProtagonists();
        const settings = this.getRandomSettings();
        const conflicts = this.getRandomConflicts();
        const toneCombinations = this.getRandomToneCombinations();

        const randomIndex = Math.floor(Math.random() * themes.length);

        return {
            theme: themes[randomIndex],
            protagonist: protagonists[Math.floor(Math.random() * protagonists.length)],
            setting: settings[Math.floor(Math.random() * settings.length)],
            conflict: conflicts[Math.floor(Math.random() * conflicts.length)],
            tone: toneCombinations[randomIndex] || toneCombinations[0]
        };
    }

    // 应用智能随机配置到表单
    applySmartRandom() {
        const config = this.getSmartRandomConfig();

        $('#swal-theme').val(config.theme);
        $('#swal-protagonist').val(config.protagonist);
        $('#swal-setting').val(config.setting);
        $('#swal-conflict').val(config.conflict);

        // 清除所有基调选择
        $('.tone-checkboxes input[type="checkbox"]').prop('checked', false);

        // 选择对应的基调组合
        config.tone.forEach(tone => {
            $(`.tone-checkboxes input[value="${tone}"]`).prop('checked', true);
        });
    }

    // 生成故事
    async generateStory(config) {
        // 获取AI配置
        const aiConfig = this.getAISettings();

        // 检查API Key是否已配置
        if (!aiConfig.apiKey) {
            await Swal.fire({
                icon: 'warning',
                title: '请先配置AI设置',
                text: '点击右上角的设置按钮配置API密钥',
                confirmButtonText: '去设置'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showSettingsDialog();
                }
            });
            return;
        }

        // 创建取消控制器
        this.abortController = new AbortController();
        let isAborted = false;

        // 显示生成进度
        const progressDialog = Swal.fire({
            title: '正在生成故事...',
            html: `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div class="progress-text" id="progress-text">准备中...</div>
                </div>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: '停止生成',
            customClass: {
                popup: 'ai-progress-popup',
                cancelButton: 'btn-danger'
            }
        });

        // 处理取消按钮点击
        progressDialog.then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                // 用户点击了停止按钮
                isAborted = true;
                this.abortController.abort();
            }
        });

        try {
            const storyContent = await AIService.generateStory(config, (progress, status) => {
                this.updateProgress(progress, status);
            }, aiConfig, this.abortController.signal);

            // 如果没有被取消，处理成功结果
            if (!isAborted) {
                // 将生成的内容插入到编辑器
                EditorView.insert(storyContent + "\n\n");

                // 关闭进度对话框
                Swal.close();

                // 显示成功消息
                await Swal.fire({
                    icon: 'success',
                    title: '生成完成！',
                    text: '故事已添加到编辑器中',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

        } catch (error) {
            Swal.close();

            if (error.name === 'AbortError' || isAborted) {
                // 用户主动取消
                await Swal.fire({
                    icon: 'info',
                    title: '生成已停止',
                    text: '故事生成已被用户取消',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // 其他错误
                await Swal.fire({
                    icon: 'error',
                    title: '生成失败',
                    text: error.message
                });
                console.error("AI生成错误:", error);
            }
        }
    }

    // 更新进度
    updateProgress(percent, status = '') {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill) {
            progressFill.style.width = percent + '%';
        }

        if (progressText && status) {
            progressText.textContent = status;
        }
    }

    // 显示Ink语法修复对话框
    async showInkFixDialog() {
        // 获取当前编辑器内容
        const currentContent = EditorView.getValue();
        if (!currentContent || currentContent.trim().length === 0) {
            await Swal.fire({
                icon: 'warning',
                title: '编辑器为空',
                text: '请先在编辑器中输入一些Ink代码',
                confirmButtonText: '确定'
            });
            return;
        }

        // 获取当前错误
        const errors = LiveCompiler.getIssues();
        if (!errors || errors.length === 0) {
            await Swal.fire({
                icon: 'info',
                title: '没有发现错误',
                text: '当前代码没有检测到语法错误',
                confirmButtonText: '确定'
            });
            return;
        }

        // 获取AI配置
        const aiConfig = this.getAISettings();
        if (!aiConfig.apiKey) {
            await Swal.fire({
                icon: 'warning',
                title: '请先配置AI设置',
                text: '点击右上角的设置按钮配置API密钥',
                confirmButtonText: '去设置'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showSettingsDialog();
                }
            });
            return;
        }

        // 显示错误预览和确认对话框
        const errorList = errors.map((error, index) =>
            `<div class="error-item">
                <strong>错误 ${index + 1}:</strong> ${error.message}
                ${error.lineNumber ? `<br><small>第 ${error.lineNumber} 行</small>` : ''}
            </div>`
        ).join('');

        const result = await Swal.fire({
            title: 'AI语法修复',
            html: `
                <div class="ink-fix-dialog">
                    <p>检测到 <strong>${errors.length}</strong> 个错误，是否使用AI进行修复？</p>
                    <div class="error-list">
                        ${errorList}
                    </div>
                    <div class="warning-note">
                        <small>⚠️ 修复后的代码将替换当前编辑器内容，建议先保存当前版本</small>
                    </div>
                </div>
            `,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: '开始修复',
            cancelButtonText: '取消',
            customClass: {
                popup: 'ink-fix-popup',
                confirmButton: 'btn-primary',
                cancelButton: 'btn-secondary'
            }
        });

        if (result.isConfirmed) {
            await this.performInkFix(currentContent, errors, aiConfig);
        }
    }

    // 执行Ink语法修复
    async performInkFix(content, errors, aiConfig) {
        // 创建取消控制器
        this.abortController = new AbortController();
        let isAborted = false;

        // 显示修复进度
        const progressDialog = Swal.fire({
            title: '正在修复语法错误...',
            html: `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="fix-progress-fill"></div>
                    </div>
                    <div class="progress-text" id="fix-progress-text">准备中...</div>
                </div>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: '停止修复',
            customClass: {
                popup: 'ai-progress-popup',
                cancelButton: 'btn-danger'
            }
        });

        // 处理取消按钮点击
        progressDialog.then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                isAborted = true;
                this.abortController.abort();
            }
        });

        try {
            // 模拟进度更新
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (isAborted) {
                    clearInterval(progressInterval);
                    return;
                }
                progress += Math.random() * 15;
                if (progress > 80) progress = 80;
                this.updateFixProgress(progress, progress < 30 ? '分析错误...' :
                    progress < 60 ? '生成修复方案...' : '完善代码...');
            }, 300);

            const fixedContent = await AIService.fixInkWithAI(content, errors, aiConfig, this.abortController.signal);

            clearInterval(progressInterval);

            if (!isAborted) {
                this.updateFixProgress(100, '修复完成');

                // 关闭进度对话框
                Swal.close();

                // 显示修复结果预览
                await this.showFixResult(content, fixedContent);
            }

        } catch (error) {
            Swal.close();

            if (error.name === 'AbortError' || isAborted) {
                await Swal.fire({
                    icon: 'info',
                    title: '修复已停止',
                    text: '语法修复已被用户取消',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: '修复失败',
                    text: error.message
                });
                console.error("AI修复错误:", error);
            }
        }
    }

    // 更新修复进度
    updateFixProgress(percent, status = '') {
        const progressFill = document.getElementById('fix-progress-fill');
        const progressText = document.getElementById('fix-progress-text');

        if (progressFill) {
            progressFill.style.width = percent + '%';
        }

        if (progressText && status) {
            progressText.textContent = status;
        }
    }

    // 显示修复结果
    async showFixResult(originalContent, fixedContent) {
        const result = await Swal.fire({
            title: '修复完成',
            html: `
                <div class="fix-result-dialog">
                    <p>AI已完成语法修复，请预览修复结果：</p>
                    <div class="code-comparison">
                        <div class="code-section">
                            <h4>修复后的代码 (前200字符预览)</h4>
                            <pre class="code-preview">${this.escapeHtml(fixedContent.substring(0, 200))}${fixedContent.length > 200 ? '...' : ''}</pre>
                        </div>
                    </div>
                    <div class="action-note">
                        <small>点击"应用修复"将替换编辑器中的所有内容</small>
                    </div>
                </div>
            `,
            width: '700px',
            showCancelButton: true,
            confirmButtonText: '应用修复',
            cancelButtonText: '取消',
            customClass: {
                popup: 'fix-result-popup',
                confirmButton: 'btn-success',
                cancelButton: 'btn-secondary'
            }
        });

        if (result.isConfirmed) {
            // 应用修复
            EditorView.setValue(fixedContent);

            await Swal.fire({
                icon: 'success',
                title: '修复已应用',
                text: '代码已更新，请检查修复结果',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }

    // HTML转义工具函数
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 绑定事件
    bindEvents() {
        const self = this;

        // AI故事生成器按钮点击事件
        $("#enhanced-toolbar .ai-story-generator.button").on("click", function (event) {
            self.showDialog();
            event.preventDefault();
        });

        // AI设置按钮点击事件
        $("#enhanced-toolbar .ai-settings.button").on("click", function (event) {
            self.showSettingsDialog();
            event.preventDefault();
        });

        // Ink语法修复按钮点击事件
        $("#enhanced-toolbar .ink-syntax-fixer.button").on("click", function (event) {
            self.showInkFixDialog();
            event.preventDefault();
        });
    }
}

// 创建单例实例
const aiStoryGenerator = new AIStoryGenerator();

module.exports = { AIStoryGenerator, aiStoryGenerator };

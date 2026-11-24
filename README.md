Simple incremental browser rpg game.

Inspired by proto23: https://github.com/23html/23html.github.io

---

## 简体中文汉化（Simplified Chinese localization）

**在线游玩 / Play online：<https://linlei0102.github.io/arkivia-zh/>**

本仓库在原作者 Arkivia 的基础上提供**完整简体中文汉化版**，保留英文原版并可随时切换。

- 上游：<https://github.com/LinLei0102/arkivia>
- 汉化依据 commit：`a34d91fc5c97837ce720b744960a27ea4df17adc`（v0.27.2）
- 上游原始文件（`game.js`、`index.html`、`main.css` 等）保持**零改动**，所有汉化产物都是新增文件。

### 玩法与运行

直接用浏览器打开 `dist/index.html` 即可（无需构建、无需服务器）。默认界面为简体中文。

```
arkivia/
├─ dist/            汉化成品（打开 dist/index.html 开始游戏）
│  ├─ index.html    中文入口，按语言设置加载 game.zh.js 或 game.js
│  ├─ game.zh.js    中文版游戏脚本（由构建脚本生成）
│  ├─ game.js       英文版游戏脚本（= 上游 game.js + 语言切换补丁）
│  └─ lang.js       语言判定、静态文案中英切换、面板入口
├─ localize/        汉化工程：词典、构建脚本、页面源码
├─ save/            残局存档 endgame-0.27.2.sav + 免安装导入页 import.html
├─ tools/           无头浏览器巡检与存档生成脚本
├─ docs/            验收报告与截图
└─ （上游原始文件：game.js / index.html / main.css / img/ ... 未改动）
```

### 语言切换

游戏内 **设置 → 语言** 面板可随时在「简体中文 / English」之间切换，切换会重新载入页面，存档保留。

- 语言记忆保存在 `localStorage["arkivia-lang"]`（`zh` / `en`），默认 `zh`。
- 场景文本、物品名、技能描述、任务、成就、设置项、日志、工具提示均为双语。
- 从另一语言存档载入时，当前场景文本会自动按当前语言重渲染。

### 汉化路线

- 该游戏**没有内置 i18n 系统**，全部文案硬编码在 `game.js`（数据表 + 模板字符串）中，因此采用 **路线 B：构建期源码补丁**。
- 词典以「原文精确匹配」为键（`localize/dict.json`，574 条），构建时只替换字符串字面量与模板字符串中的静态文本段落，**不触碰任何 key / ID / 场景名 / 物品 ID / 正则 / 占位符**。
- 中英双语通过两套产物实现：`game.js`（英文原版 + 补丁）与 `game.zh.js`（中文），入口页按语言设置二选一，因此**切换语言零风险、可逐帧对照原文**。
- 补丁仅 4 处，均为双语共存所需：
  1. `capitaliseFirst()` 增加 `window.ARK_WORDS` 查表（用于「力量 / 防御 / 速度 / 敏捷」与「早晨 / 下午 / 夜晚」）；
  2. `settingsCategories` 增加「语言」分类；
  3. `changeTitle()` 增加旧存档称号跨语言映射；
  4. `englishifyNumber()` 中文下输出阿拉伯序数（「第 3 轮」）。
  5. `loadSave()` 末尾按当前语言自愈场景文本。

### 重新构建

```bash
cd localize
node build.js      # 上游 game.js + 共享补丁 → game.base.js（英文版）
node gen.js        # 合并词典 → game.zh.js（中文版）
cd ..
cp localize/game.base.js dist/game.js
cp localize/game.zh.js  dist/game.zh.js
cp localize/index.zh.html dist/index.html
cp localize/lang.js dist/lang.js
cp localize/changelog.zh.html dist/changelog.html
# 线上导入页（相对路径指向同目录 index.html）
sed 's#../dist/index.html#index.html#' save/import.html > dist/save.html
```

线上地址：<https://linlei0102.github.io/arkivia-zh/> ，残局存档导入页：<https://linlei0102.github.io/arkivia-zh/save.html> 。

产物可复现：连续两次构建 `game.zh.js` 的 MD5 一致（`712f78bbe008786681edf2754314a214`）。

### 巡检与验收

```bash
cd tools
npm i playwright-core           # 仅需一次；浏览器复用本机 Playwright Chromium
node test4.js                   # 58 个场景 + 4 个面板 + 12 个设置分类残留英文扫描
node testimport.js              # 残局存档导入页端到端测试
node savegen.js                 # 重新生成残局存档
```

当前结果：残留英文 **0**、页面错误 **0**、字符串/模板结构指纹与英文版完全一致。详见 `docs/验收报告.md`。

### 残局存档

`save/endgame-0.27.2.sav` + `save/import.html`（存档已内联，双击即可离线导入）。

- 等级 40、四项属性 25、全技能、全成就、主要任务线完成、7 件装备、负重 2.69kg / 9kg，可直接查看森林、竞技场、猎人公会、森林健身房等后期内容的中文表现。
- 导入页会把原 `arkivia-save1` 备份到 `arkivia-save1-backup-l10n` 再写入，**不触碰其他存档位**；也可在游戏内用「导入」按钮手动加载 `.sav` 文件。
- 恢复：在游戏内「设置 → 备份存档」或用浏览器控制台把 `arkivia-save1-backup-l10n` 写回 `arkivia-save1`。

### 已知限制

- `dist/changelog.html` 的更新日志条目保留英文原文（仅顶部加了中文说明）。
- 英文存档首次载入中文版时，若不想等场景切换，可在设置里切换一次语言触发重渲染。
- 极少数由内部标识符派生、且源数据没有中文名的动态文本（如未命名的 `checks` 目标名）仍可能夹带英文标识符片段。
- 背包角落的删除开关为单字「删」（原位置只有 20px 宽），移动端底部按钮为「删 / 配置」。

### 致谢与许可

- 线上托管：GitHub Pages（`main` 分支 `dist/` 目录，由 `.github/workflows/pages.yml` 自动部署）
- 游戏本体、素材与代码版权归原作者 **Pointless**（<https://github.com/LinLei0102/arkivia>），本仓库仅提供汉化补丁与汉化产物，请遵循上游许可。
- 汉化词典、构建脚本与巡检脚本可自由取用；转载汉化版请保留上游署名与仓库链接。
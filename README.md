# @dsh-external/dsh-token-stats

DSH 的 Token 用量统计面板：左下角 📊 悬浮球 + 浅色极简数据仪表盘，host 侧聚合本机全部会话的模型 usage。

## 功能特性

- **时间范围分段**：近 7 天 / 近 30 天 / 全部，全模块联动
- **6 卡核心指标**：Token 用量、消息数、会话数、模型数、最常用模型（含占比）、日均用量
- **活跃热力图**：GitHub 贡献墙风格，灰 → 浅蓝 → 深蓝冷色阶
- **按天 Token 趋势**：按模型堆叠柱状图，hover 查看当日各模型分量
- **模型用量**：甜甜圈环形图（中心总用量）+ 图例列表（圆点 / 名称 / 用量 / 百分比）

## 安装

DSH 插件通过 `dsh plugin` 命令安装进 profile（`dsh web` 对应 web profile）。

### 方式一：从 GitHub 安装（推荐，无需 npm / 无需登录）

```bash
dsh plugin --profile web add github:Attackotw/dsh-token-stats#v0.1.0
```

装完重启 `dsh web`，左下角出现 📊 悬浮球即生效。

> 锁定版本用 tag（`#v0.1.0`）；不写则拉 `main` 分支最新。
>
> 若你的网络无法直连 github.com 的 HTTPS，改用 SSH 形式（需先在 GitHub 添加 SSH key）：
> `dsh plugin --profile web add "git+ssh://git@github.com/Attackotw/dsh-token-stats.git#v0.1.0"`

### 方式二：从 npm 安装（待发布）

```bash
dsh plugin --profile web add @dsh-external/dsh-token-stats
```

## 更新与卸载

```bash
# 更新到最新 main
dsh plugin --profile web update @dsh-external/dsh-token-stats

# 换版本（如 0.1.1）
dsh plugin --profile web add github:Attackotw/dsh-token-stats#v0.1.1

# 卸载
dsh plugin --profile web remove @dsh-external/dsh-token-stats
```

改完重启 `dsh web` 生效。

## 数据来源

面板统计本机所有 DSH 会话的模型 usage（`sessionQuery`），包含输入 / 输出 / 缓存读 / 缓存写四类 token。数据由 host 侧实时聚合，经 `GET /dsh-token-stats/api` 输出 JSON 供面板消费。

## 开发构建

需要 Node.js ≥ 22 与 pnpm（构建依赖本地 node_modules 的 typescript / tsdown）。

```bash
npm install        # 装 devDependencies
npm run build          # host: tsc 编译 src → lib
npm run build:client   # client: tsdown → lib/client.js
```

产物 `lib/` 已随仓库提交，安装方无需构建。

## 技术细节

- 装配：包声明 `dsh.bundle.patch`（`cordis.patch.yml`），`dsh plugin add` 安装时由 CLI 自动识别并追加进 `dsh.profile.bundles`
- host 侧：`inject: ['sessionQuery', 'webServer']`，注册 `/dsh-token-stats/api` 路由
- client 侧：`dsh.client` 声明 + `shell.overlay` slot，React 走 ModuleLoader external

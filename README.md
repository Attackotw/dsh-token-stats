# @dsh-external/dsh-token-stats

Token 用量统计面板（ui-panel 形态）：左下角悬浮球 📊 + 左侧浅色极简数据仪表盘。

- **host 侧**：聚合全部会话日志的 usage 事件（日 / 周 / 月 / 按模型 / 按天×模型），经 `GET /dsh-token-stats/api` 输出 JSON。
- **client 侧**：`shell.overlay` 面板 —— 时间范围分段（近 7 天 / 近 30 天 / 全部）、6 卡核心指标、冷色阶活跃热力图、按模型堆叠柱状趋势图、甜甜圈模型用量占比。

## 构建

```bash
npm run build          # host: checkout tsc 编译 src → lib
npm run build:client   # client: tsdown → lib/client.js（ModuleLoader bundle）
```

依赖 `DSH_CHECKOUT`（或 `~/dsh-harness` 等常见路径）定位 dsh 源码 checkout。

## 安装

经 dsh-super-injector：

```bash
dev_install_package <本目录> web     # 热装配进 profile，重启常驻
```

## 数据来源

面板统计的是本机所有 DSH 会话的模型 usage（`sessionQuery`），包含输入 / 输出 / 缓存读 / 缓存写四类 token。

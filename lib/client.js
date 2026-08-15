window.__ModuleLoader__.load({
	id: "@dsh-external/dsh-token-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		//#region src/client/index.ts
		/**
		* @dsh-external/dsh-token-stats — client 面板（浅色极简仪表盘）。
		* 悬浮球（📊）+ 左侧统计面板：时间范围分段、6 卡核心指标、冷色阶活跃热力图、
		* 按模型堆叠柱状趋势图、甜甜圈模型用量占比。
		* 数据经 host 路由 /dsh-token-stats/api 拉取。
		*/
		const inject = ["slots"];
		function formatNumber(n) {
			if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
			if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
			if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
			return String(n);
		}
		const COLORS = [
			"#2f7de1",
			"#16a34a",
			"#8b5cf6",
			"#ef4444",
			"#f59e0b",
			"#06b6d4"
		];
		function colorOf(i) {
			return COLORS[i % COLORS.length];
		}
		const CSS = `
.tds-panel{position:fixed;top:0;left:0;height:100vh;width:440px;z-index:1000;pointer-events:auto;display:flex;flex-direction:column;background:#f5f5f7;border-right:1px solid #e3e3e8;box-shadow:6px 0 24px rgba(0,0,0,.08);overflow:hidden;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:13px;line-height:1.45;color:#1d1d1f}
.tds-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#fff;border-bottom:1px solid #e8e8ed}
.tds-title{font-weight:600;font-size:14px;color:#1d1d1f}
.tds-actions{display:flex;gap:4px}
.tds-btn{background:none;border:none;cursor:pointer;font-size:15px;line-height:1;color:#6e6e73;padding:5px 8px;border-radius:7px}
.tds-btn:hover{color:#1d1d1f;background:#f0f0f3}
.tds-content{flex:1;overflow-y:auto;padding:14px;background:#f5f5f7}
.tds-filter-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.tds-filter-label{font-size:12px;color:#6e6e73;font-weight:500}
.tds-seg{display:flex;background:#e8e8ed;border-radius:9px;padding:2px;gap:2px}
.tds-seg-btn{border:none;background:transparent;cursor:pointer;font-size:12px;font-weight:500;color:#6e6e73;padding:5px 11px;border-radius:7px;font-family:inherit;transition:all .15s;white-space:nowrap}
.tds-seg-btn:hover{color:#1d1d1f}
.tds-seg-active{background:#fff;color:#1d1d1f;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.tds-kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tds-kpi{background:#fff;border-radius:12px;padding:12px;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.tds-kpi-top{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.tds-kpi-icon{font-size:13px;line-height:1}
.tds-kpi-label{font-size:11px;color:#6e6e73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tds-kpi-value{font-size:19px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tds-kpi-value-text{font-size:13px;line-height:19px}
.tds-kpi-sub{font-size:10px;color:#86868b;margin-top:3px}
.tds-card{background:#fff;border-radius:12px;padding:14px;margin-top:12px;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.tds-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.tds-card-title{font-size:13px;font-weight:600;color:#1d1d1f}
.tds-heat-legend{display:flex;align-items:center;gap:6px;font-size:10px;color:#86868b}
.tds-heat-gradient{width:72px;height:8px;border-radius:4px;background:linear-gradient(90deg,#ebedf0,#cfe8fb,#3d9bd9,#0b5aa2)}
.tds-heat-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
.tds-heat-cell{aspect-ratio:1;border-radius:3px;min-height:20px}
.tds-chart-legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px}
.tds-legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:#3c3c43;min-width:0}
.tds-legend-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px}
.tds-dot{width:8px;height:8px;border-radius:50%;flex:none}
.tds-donut-row{display:flex;align-items:center;gap:16px}
.tds-donut-legend{flex:1;min-width:0}
.tds-donut-item{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #f0f0f2;font-size:12px}
.tds-donut-item:last-child{border-bottom:none}
.tds-donut-name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#1d1d1f}
.tds-donut-val{color:#6e6e73;font-variant-numeric:tabular-nums}
.tds-donut-pct{width:44px;text-align:right;color:#86868b;font-variant-numeric:tabular-nums}
.tds-empty{padding:28px 12px;text-align:center;color:#86868b;font-size:13px}
.tds-error{padding:16px 12px;color:#d92d20;font-size:13px}
.tds-loading{padding:28px 12px;text-align:center;color:#86868b}
.tds-diag{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10px;background:#f5f5f7;padding:8px;border-radius:6px;overflow:auto;max-height:240px;white-space:pre-wrap;margin-top:12px}
.tds-fab{position:fixed;left:10px;bottom:72px;z-index:1001;width:36px;height:36px;border-radius:50%;border:1px solid #e3e3e8;background:#fff;color:#6e6e73;display:flex;align-items:center;justify-content:center;font-size:16px;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.14);pointer-events:auto;padding:0;transition:transform .15s,box-shadow .15s,color .15s}
.tds-fab:hover{transform:scale(1.08);box-shadow:0 4px 12px rgba(0,0,0,.2);color:#2f7de1}
`;
		const panelState = { open: false };
		const listeners = /* @__PURE__ */ new Set();
		function subscribe(fn) {
			listeners.add(fn);
			return function() {
				listeners.delete(fn);
			};
		}
		function setOpen(v) {
			panelState.open = v;
			listeners.forEach(function(fn) {
				fn(v);
			});
		}
		function usePanelOpen() {
			const [open, setOpenState] = react.default.useState(panelState.open);
			react.default.useEffect(function() {
				return subscribe(setOpenState);
			}, []);
			return [open, function(v) {
				setOpen(v);
				setOpenState(v);
			}];
		}
		function pad2(n) {
			return String(n).padStart(2, "0");
		}
		function dateKeyOf(ts) {
			const d = new Date(ts);
			return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
		}
		function cutoffKeyOf(days) {
			const d = /* @__PURE__ */ new Date();
			d.setHours(0, 0, 0, 0);
			d.setDate(d.getDate() - (days - 1));
			return dateKeyOf(d.getTime());
		}
		function shortModel(k) {
			return String(k).split("/").pop();
		}
		function num(n) {
			return Math.round(n * 100) / 100;
		}
		function heatColor(total, max) {
			if (!total || max <= 0) return "#ebedf0";
			const r = total / max;
			if (r <= .25) return "#cfe8fb";
			if (r <= .5) return "#8ecdf2";
			if (r <= .75) return "#3d9bd9";
			return "#0b5aa2";
		}
		function polar(cx, cy, r, a) {
			const rad = (a - 90) * Math.PI / 180;
			return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
		}
		function arcPath(cx, cy, rO, rI, a0, a1) {
			const large = a1 - a0 > 180 ? 1 : 0;
			const p0 = polar(cx, cy, rO, a0), p1 = polar(cx, cy, rO, a1);
			const p2 = polar(cx, cy, rI, a1), p3 = polar(cx, cy, rI, a0);
			return "M" + num(p0[0]) + " " + num(p0[1]) + " A" + rO + " " + rO + " 0 " + large + " 1 " + num(p1[0]) + " " + num(p1[1]) + " L" + num(p2[0]) + " " + num(p2[1]) + " A" + rI + " " + rI + " 0 " + large + " 0 " + num(p3[0]) + " " + num(p3[1]) + " Z";
		}
		const RANGE_DAYS = {
			week: 7,
			recent: 30
		};
		function buildView(data, range) {
			const daily = data.daily || [];
			const stackedAll = data.stacked || [];
			const cutoff = RANGE_DAYS[range] ? cutoffKeyOf(RANGE_DAYS[range]) : null;
			const dailyR = cutoff ? daily.filter(function(d) {
				return d.key >= cutoff;
			}) : daily;
			const stackedR = cutoff ? stackedAll.filter(function(s) {
				return s.date >= cutoff;
			}) : stackedAll;
			let totalTokens = 0, messages = 0, activeDays = 0;
			for (const d of dailyR) {
				totalTokens += d.total;
				messages += d.messages;
				if (d.total > 0) activeDays++;
			}
			const modelTotals = {};
			for (const s of stackedR) for (const k in s.models) modelTotals[k] = (modelTotals[k] || 0) + s.models[k];
			const models = Object.keys(modelTotals).map(function(k) {
				return {
					key: k,
					total: modelTotals[k]
				};
			}).sort(function(a, b) {
				return b.total - a.total;
			});
			const top = models[0];
			return {
				kpi: {
					totalTokens,
					messages,
					sessions: data.summary && data.summary.totalSessions || 0,
					models: models.length,
					topModelName: top ? shortModel(top.key) : "-",
					topModelKey: top ? top.key : "",
					topModelPct: top && totalTokens > 0 ? Math.round(top.total / totalTokens * 100) : 0,
					avgDaily: activeDays > 0 ? Math.round(totalTokens / activeDays) : 0
				},
				dailyR,
				stackedR,
				models,
				totalTokens
			};
		}
		function SegControl(props) {
			function segBtn(id, label) {
				return react.default.createElement("button", {
					type: "button",
					className: "tds-seg-btn" + (props.value === id ? " tds-seg-active" : ""),
					onClick: function() {
						props.onChange(id);
					}
				}, label);
			}
			return react.default.createElement("div", { className: "tds-seg" }, segBtn("week", "近 7 天"), segBtn("recent", "近 30 天"), segBtn("all", "全部"));
		}
		function KpiCard(props) {
			return react.default.createElement("div", { className: "tds-kpi" }, react.default.createElement("div", { className: "tds-kpi-top" }, react.default.createElement("span", { className: "tds-kpi-icon" }, props.icon), react.default.createElement("span", { className: "tds-kpi-label" }, props.label)), react.default.createElement("div", {
				className: "tds-kpi-value" + (props.text ? " tds-kpi-value-text" : ""),
				title: props.title || ""
			}, props.value), props.sub ? react.default.createElement("div", { className: "tds-kpi-sub" }, props.sub) : null);
		}
		function KpiGrid(props) {
			const v = props.v;
			return react.default.createElement("div", { className: "tds-kpi-grid" }, KpiCard({
				icon: "🪙",
				label: "Token 用量",
				value: formatNumber(v.totalTokens)
			}), KpiCard({
				icon: "💬",
				label: "消息数",
				value: formatNumber(v.messages)
			}), KpiCard({
				icon: "🗂",
				label: "会话数",
				value: formatNumber(v.sessions)
			}), KpiCard({
				icon: "🧩",
				label: "模型数",
				value: formatNumber(v.models)
			}), KpiCard({
				icon: "⭐",
				label: "最常用模型",
				value: v.topModelName,
				text: true,
				title: v.topModelKey,
				sub: "占比 " + v.topModelPct + "%"
			}), KpiCard({
				icon: "📈",
				label: "日均用量",
				value: formatNumber(v.avgDaily)
			}));
		}
		function HeatmapCard(props) {
			const data = props.data || [];
			let content;
			if (data.length === 0) content = react.default.createElement("div", { className: "tds-empty" }, "暂无数据");
			else {
				const map = {};
				let max = 0;
				for (const d of data) {
					map[d.key] = d.total;
					if (d.total > max) max = d.total;
				}
				const first = data[0].key;
				const last = data[data.length - 1].key;
				const start = /* @__PURE__ */ new Date(first + "T00:00:00");
				const end = /* @__PURE__ */ new Date(last + "T00:00:00");
				const cells = [];
				const cur = new Date(start);
				cur.setDate(cur.getDate() - (cur.getDay() + 6) % 7);
				const endPlus = new Date(end);
				endPlus.setDate(endPlus.getDate() + (6 - (end.getDay() + 6) % 7));
				while (cur <= endPlus) {
					const key = cur.getFullYear() + "-" + pad2(cur.getMonth() + 1) + "-" + pad2(cur.getDate());
					const total = map[key] || 0;
					const isInRange = cur >= start && cur <= end;
					cells.push(react.default.createElement("div", {
						key,
						className: "tds-heat-cell",
						style: { background: isInRange ? heatColor(total, max) : "transparent" },
						title: key + "\n" + formatNumber(total) + " tokens"
					}));
					cur.setDate(cur.getDate() + 1);
				}
				content = react.default.createElement("div", { className: "tds-heat-grid" }, cells);
			}
			return react.default.createElement("div", { className: "tds-card" }, react.default.createElement("div", { className: "tds-card-head" }, react.default.createElement("span", { className: "tds-card-title" }, "活跃热力图"), react.default.createElement("div", { className: "tds-heat-legend" }, react.default.createElement("span", null, "较少"), react.default.createElement("div", { className: "tds-heat-gradient" }), react.default.createElement("span", null, "较多"))), content);
		}
		function StackedBarsCard(props) {
			const rows = props.rows || [];
			const models = props.models || [];
			let content;
			if (rows.length === 0 || models.length === 0) content = react.default.createElement("div", { className: "tds-empty" }, "暂无数据");
			else {
				const H = 190, padL = 4;
				const chartW = 400, chartH = 156;
				const sums = rows.map(function(r) {
					let s = 0;
					for (const k in r.models) s += r.models[k];
					return s;
				});
				const max = Math.max.apply(null, sums) || 1;
				const step = chartW / rows.length;
				const barW = Math.min(step * .62, 30);
				const gridLines = [];
				for (let i = 0; i <= 3; i++) {
					const y = 168 - i / 3 * chartH;
					gridLines.push(react.default.createElement("line", {
						key: "g" + i,
						x1: padL,
						y1: num(y),
						x2: 404,
						y2: num(y),
						stroke: "#f0f0f3",
						strokeWidth: 1
					}));
				}
				const bars = [];
				for (let i = 0; i < rows.length; i++) {
					const x = padL + i * step + (step - barW) / 2;
					const titleLines = [rows[i].date];
					let baseY = 168;
					const segs = [];
					for (let m = 0; m < models.length; m++) {
						const k = models[m].key;
						const v = rows[i].models[k] || 0;
						if (v <= 0) continue;
						const h = v / max * chartH;
						baseY -= h;
						segs.push(react.default.createElement("rect", {
							key: k,
							x: num(x),
							y: num(baseY),
							width: num(barW),
							height: num(h),
							fill: colorOf(m)
						}));
						titleLines.push(shortModel(k) + ": " + formatNumber(v));
					}
					if (segs.length === 0) continue;
					bars.push(react.default.createElement("g", { key: rows[i].date }, react.default.createElement("title", null, titleLines.join("\n")), segs));
				}
				const xLabels = [];
				const count = Math.min(rows.length, 6);
				for (let i = 0; i < count; i++) {
					const idx = Math.round(i / (count - 1 || 1) * (rows.length - 1));
					const x = padL + idx * step + step / 2;
					xLabels.push(react.default.createElement("text", {
						key: "x" + i,
						x: num(x),
						y: 184,
						textAnchor: "middle",
						fontSize: 9,
						fill: "#86868b"
					}, rows[idx].date.slice(5)));
				}
				const legend = react.default.createElement("div", { className: "tds-chart-legend" }, models.slice(0, 12).map(function(m, i) {
					return react.default.createElement("div", {
						key: m.key,
						className: "tds-legend-item"
					}, react.default.createElement("span", {
						className: "tds-dot",
						style: { background: colorOf(i) }
					}), react.default.createElement("span", { className: "tds-legend-name" }, shortModel(m.key)));
				}));
				content = react.default.createElement(react.default.Fragment, null, react.default.createElement("svg", {
					width: "100%",
					height: H,
					viewBox: "0 0 408 190",
					style: { display: "block" }
				}, gridLines, bars, xLabels), legend);
			}
			return react.default.createElement("div", { className: "tds-card" }, react.default.createElement("div", { className: "tds-card-head" }, react.default.createElement("span", { className: "tds-card-title" }, "按天 Token 趋势")), content);
		}
		function DonutCard(props) {
			const items = (props.items || []).filter(function(m) {
				return m.total > 0;
			});
			const total = props.total || 0;
			let content;
			if (items.length === 0 || total <= 0) content = react.default.createElement("div", { className: "tds-empty" }, "暂无数据");
			else {
				const size = 148, cx = 74, cy = 74, rO = 66, rI = 47;
				let angle = 0;
				const arcs = [];
				for (let i = 0; i < items.length; i++) {
					const sweep = items[i].total / total * 360;
					if (sweep < .2) continue;
					const s = Math.min(sweep, 359.95);
					arcs.push(react.default.createElement("path", {
						key: items[i].key,
						d: arcPath(cx, cy, rO, rI, angle, angle + s),
						fill: colorOf(i)
					}));
					angle += sweep;
				}
				const svg = react.default.createElement("svg", {
					width: size,
					height: size,
					viewBox: "0 0 148 148",
					style: { flex: "none" }
				}, arcs, react.default.createElement("text", {
					x: cx,
					y: 72,
					textAnchor: "middle",
					fontSize: 17,
					fontWeight: 700,
					fill: "#1d1d1f"
				}, formatNumber(total)), react.default.createElement("text", {
					x: cx,
					y: 88,
					textAnchor: "middle",
					fontSize: 9,
					fill: "#86868b"
				}, "tokens"));
				const legend = react.default.createElement("div", { className: "tds-donut-legend" }, items.slice(0, 10).map(function(m, i) {
					const pct = Math.round(m.total / total * 100);
					return react.default.createElement("div", {
						key: m.key,
						className: "tds-donut-item",
						title: m.key
					}, react.default.createElement("span", {
						className: "tds-dot",
						style: { background: colorOf(i) }
					}), react.default.createElement("span", { className: "tds-donut-name" }, shortModel(m.key)), react.default.createElement("span", { className: "tds-donut-val" }, formatNumber(m.total)), react.default.createElement("span", { className: "tds-donut-pct" }, pct + "%"));
				}));
				content = react.default.createElement("div", { className: "tds-donut-row" }, svg, legend);
			}
			return react.default.createElement("div", { className: "tds-card" }, react.default.createElement("div", { className: "tds-card-head" }, react.default.createElement("span", { className: "tds-card-title" }, "模型用量")), content);
		}
		function StatsPanel() {
			const [open] = usePanelOpen();
			const [range, setRange] = react.default.useState("week");
			const [data, setData] = react.default.useState(null);
			const [loading, setLoading] = react.default.useState(false);
			const [error, setError] = react.default.useState(null);
			const [showDiag, setShowDiag] = react.default.useState(false);
			async function load() {
				setLoading(true);
				setError(null);
				try {
					const res = await fetch("/dsh-token-stats/api");
					const result = await res.json();
					if (result && result.ok) setData(result);
					else setError(result && result.error || "HTTP " + res.status);
				} catch (e) {
					setError(String(e && e.message || e));
				} finally {
					setLoading(false);
				}
			}
			react.default.useEffect(function() {
				load();
			}, []);
			if (!open) return null;
			let body;
			if (loading && !data) body = react.default.createElement("div", { className: "tds-loading" }, "正在加载统计数据…");
			else if (error) body = react.default.createElement("div", { className: "tds-error" }, "加载失败：" + error, react.default.createElement("button", {
				type: "button",
				className: "tds-btn",
				onClick: load,
				style: { marginLeft: 8 }
			}, "重试"));
			else if (!data) body = react.default.createElement("div", { className: "tds-empty" }, "暂无数据");
			else {
				const view = buildView(data, range);
				const diag = showDiag && data._diagnostics ? react.default.createElement("pre", { className: "tds-diag" }, JSON.stringify(data._diagnostics, null, 2)) : null;
				body = react.default.createElement(react.default.Fragment, null, react.default.createElement("div", { className: "tds-filter-row" }, react.default.createElement("span", { className: "tds-filter-label" }, "时间范围"), react.default.createElement(SegControl, {
					value: range,
					onChange: setRange
				})), react.default.createElement(KpiGrid, { v: view.kpi }), react.default.createElement(HeatmapCard, { data: view.dailyR }), react.default.createElement(StackedBarsCard, {
					rows: view.stackedR,
					models: view.models
				}), react.default.createElement(DonutCard, {
					items: view.models,
					total: view.totalTokens
				}), diag);
			}
			return react.default.createElement("div", { className: "tds-panel" }, react.default.createElement("div", { className: "tds-head" }, react.default.createElement("span", { className: "tds-title" }, "📊 Token 统计"), react.default.createElement("div", { className: "tds-actions" }, react.default.createElement("button", {
				type: "button",
				className: "tds-btn",
				title: "刷新",
				onClick: load
			}, "↻"), react.default.createElement("button", {
				type: "button",
				className: "tds-btn",
				title: "诊断信息",
				onClick: function() {
					setShowDiag(!showDiag);
				}
			}, "🔍"), react.default.createElement("button", {
				type: "button",
				className: "tds-btn",
				title: "关闭",
				onClick: function() {
					setOpen(false);
				}
			}, "×"))), react.default.createElement("div", { className: "tds-content" }, body));
		}
		function FabButton() {
			const [open, setOpenLocal] = usePanelOpen();
			if (open) return null;
			return react.default.createElement("button", {
				type: "button",
				className: "tds-fab",
				title: "Token 用量统计",
				"aria-label": "打开 Token 统计",
				onClick: function() {
					setOpenLocal(true);
				}
			}, "📊");
		}
		function DashboardRoot() {
			return react.default.createElement(react.default.Fragment, null, react.default.createElement(FabButton, null), react.default.createElement(StatsPanel, null));
		}
		function apply(ctx) {
			ctx.effect(() => {
				const el = document.createElement("style");
				el.textContent = CSS;
				document.head.appendChild(el);
				return () => {
					el.remove();
				};
			}, "token-dashboard styles");
			ctx.effect(() => ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "token-dashboard",
				order: 90
			}, () => react.default.createElement(DashboardRoot))), "token-dashboard overlay");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
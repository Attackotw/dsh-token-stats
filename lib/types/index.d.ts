/**
 * @dsh-external/dsh-token-stats — Token 用量统计面板（host 侧）。
 * 聚合全部会话日志中的 usage 事件（日/周/月/按模型/按天×模型），
 * 经 webServer 路由 /dsh-token-stats/api 以 JSON 提供给 client 面板。
 */
interface HostContext {
    effect(setup: () => () => void, label?: string): void;
    [key: string]: unknown;
}
export declare const name = "@dsh-external/dsh-token-stats";
export declare const inject: string[];
export declare function apply(ctx: HostContext): void;
export {};

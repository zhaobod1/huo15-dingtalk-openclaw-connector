/**
 * 自实现的运行时存储工厂，避免依赖特定版本 openclaw 是否导出 createPluginRuntimeStore。
 * 旧版 openclaw 没有导出该函数，直接 import 会导致 TypeError，因此在此处内联实现。
 */
function createRuntimeStore(errorMessage) {
    let runtimeValue = null;
    return {
        setRuntime: (next) => {
            runtimeValue = next;
        },
        clearRuntime: () => {
            runtimeValue = null;
        },
        tryGetRuntime: () => {
            return runtimeValue;
        },
        getRuntime: () => {
            if (runtimeValue === null) {
                throw new Error(errorMessage);
            }
            return runtimeValue;
        },
    };
}
const { setRuntime: setDingtalkRuntime, getRuntime: getDingtalkRuntime } = createRuntimeStore("DingTalk runtime not initialized");
export { getDingtalkRuntime, setDingtalkRuntime };

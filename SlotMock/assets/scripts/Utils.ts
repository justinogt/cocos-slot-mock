export type RoutineFN<T> = () => T;

export function routine<T = any>(delay: number, fn: RoutineFN<T> = null) {
    return new Promise<T>(resolve =>
        setTimeout(() => resolve(fn && fn()), delay)
    );
}
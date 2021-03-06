export type RoutineFn<T> = () => T;
export type RoutineFnLazy = (resolve) => void;

export function atomicRoutineDelay<T = any>(delay: number, fn: RoutineFn<T> = null) {
  return new Promise<T>(resolve =>
    setTimeout(() => resolve(fn && fn()), delay)
  );
}

export function lazyRoutine<T>(fn: RoutineFnLazy) {
  return new Promise<T>(resolve => fn(resolve));
}
export function lazyRoutineDelay<T>(delay: number, fn: RoutineFnLazy) {
  return new Promise<T>(resolve =>
    setTimeout(() => fn(resolve), delay)
  );
}

/*
* Min included
* Max excluded
*/
export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * ((max - 1) - min + 1)) + min;
}
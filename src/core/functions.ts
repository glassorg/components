
export function assignIfDifferent(target, source) {
    if (target && source) {
        for (let name in source) {
            let value = source[name];
            if (target[name] !== value) {
                target[name] = value;
            }
        }
    }
}

export function memoize<A extends (arg) => any>(fn: A, cache: Map<any, any> = new Map()): A {
    return (function (this, arg) {
        let result = cache.get(arg)
        if (result === undefined) {
            cache.set(arg, result = fn.call(this, arg));
        }
        return result;
    } as A);
}
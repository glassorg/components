
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
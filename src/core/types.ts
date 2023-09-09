
export type Primitive = string | number | boolean | null | undefined;
export type Collection = Array<unknown> | Map<unknown, unknown> | Set<unknown>
export type TypedArray = Uint8Array | Int8Array
    | Uint16Array | Int16Array
    | Uint32Array | Int32Array
    | Float32Array | Float64Array;

export type Simplify<T> =
    T extends Primitive | TypedArray | Blob | Function ? T :
    T extends Array<infer A> ? Array<Simplify<A>> :
    T extends Set<infer A> ? Set<Simplify<A>> :
    T extends Map<infer A, infer B> ? Map<Simplify<A>, Simplify<B>> :
    T extends {} ?
    {
        [K in keyof T]: Simplify<T[K]>
    }
    : T;

export type RequiredKeys<T extends object> = { [K in keyof T]-?:
    ({} extends { [P in K]: T[K] } ? never : K)
}[keyof T];

export type OptionalKeys<T extends object> = Exclude<{
    [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>
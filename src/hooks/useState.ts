import { getActiveFunctionalComponent } from "../components/private/FunctionalComponent.js";

export function useState<T>(initialValue: T) {
    return useStateWithInitializer(() => initialValue)
}

/**
 * Like `useState`, but initialized with a function to avoid reconstructing `initialValue`.
 * @param initializer 
 * @returns 
 */
export function useStateWithInitializer<T>(initializer: () => T): [T, (value: T) => void] {
    const component = getActiveFunctionalComponent();
    const hookIndex = component.hookIndex++;
    const value = component.hooks[hookIndex] ??= initializer();
    return [
        value,
        (newValue: T) => {
            component.hooks[hookIndex] = newValue;
            component.requestUpdate();
        }
    ];
}

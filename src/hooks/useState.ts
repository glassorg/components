import { getActiveFunctionalComponent } from "../core/FunctionalComponent.js";

export function useState<T>(initialValue: T) {
    const component = getActiveFunctionalComponent();
    const hookIndex = component.hookIndex++;
    const value = component.hooks[hookIndex] ??= initialValue;
    return [
        value,
        (newValue: T) => {
            component.hooks[hookIndex] = newValue;
            component.requestUpdate();
        }
    ];
}

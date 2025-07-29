/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Returns the edited properties from a Object, used for PATCH
 * @param originalObj
 * @param newObj
 * @returns The edited properties from a Object
 */
export function patchObject<T extends Record<string, any>>(originalObj: T, newObj: Partial<T>) {
    return Object.entries(newObj).reduce((acc, [key, value]) => {
        if (value !== originalObj[key as keyof T]) {
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as Partial<T>);
}

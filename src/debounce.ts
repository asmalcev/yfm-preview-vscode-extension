export const debounce = (callback: (...args: any[]) => void, wait: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
};

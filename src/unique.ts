export const uniqueServiceFactory = () => {
    let currentValue = 0;
    return {
        next: () => {
            return currentValue++;
        },
    };
};

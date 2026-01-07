export const isImageValue = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(value);
};
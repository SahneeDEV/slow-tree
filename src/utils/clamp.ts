/**
 * Clamps the given value between two other values.
 * @param min The lowest value possible.
 * @param max The highest value possible.
 * @param value The value to clamp.
 */
const clamp = (min: number, max: number, value: number) => value < min ? min : value > max ? max : value;

export default clamp;

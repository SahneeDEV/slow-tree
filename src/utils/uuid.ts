/**
 * Creates a single section uuid.
 */
export const section = () => Math.random().toString(16).substring(2, 6);

/**
 * Creates a six section uuid.
 */
const uuid = () => section() + "-" + section() + "-" + section() + "-" + section() + "-" + section() + "-" + section();

export default uuid;
type WidthHeight = { width: number, height: number };

/**
 * Lets one size cover another. Code taken and adjusted after many trial and error fails from 
 * https://stackoverflow.com/questions/10285134/whats-the-math-behind-csss-background-sizecover
 * @param size The sizes.
 */
const cover = (size: { img: WidthHeight, container: WidthHeight }): WidthHeight => {
    const imgRatio = (size.img.height / size.img.width);      // original img ratio
    const containerRatio = (size.container.height / size.container.width);
    let width, height;
    if (containerRatio > imgRatio) {
        height = size.container.height;
        width = (size.container.height / imgRatio);
    } else {
        width = size.container.width;
        height = (size.container.width * imgRatio);
    }
    return { width, height };
}

export default cover;

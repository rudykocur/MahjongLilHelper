/**
 *
 * @param {Tile} tile
 * @return {HTMLImageElement}
 */
export function renderTile(tile) {
    let img = document.createElement('img');
    img.classList.add('tile');
    img.src = 'tiles/' + tile.toTypeString() + '.png';
    return img;
}
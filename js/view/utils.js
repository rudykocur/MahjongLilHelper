/**
 *
 * @param {Tile} tile
 * @return {HTMLElement}
 */
export function renderTile(tile) {
    let elem = document.createElement('i');
    elem.classList.add('tile-icon');
    elem.classList.add('icon-'+tile.toTypeString());
    elem.setAttribute('data-tile', tile.toTypeString());
    return elem;
}
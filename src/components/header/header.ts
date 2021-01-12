import Menu from '../menu/menu';
import Game from '../game/game';
import './header.scss';

const root = document.querySelector('#root')!;

const Header = (() => {
  const render = () => {
    let header = document.querySelector('.header');
    if (header) header.remove();
    root.appendChild(_createHeader());
  };

  const _createHeader = () => {
    const header = document.createElement('div');
    header.classList.value = 'header';

    const container = document.createElement('div');
    container.classList.value = 'header__container';
    header.appendChild(container);

    const heading = document.createElement('h1');
    heading.classList.value = 'header__heading';
    heading.innerHTML = 'Tic Tac Toe';
    container.appendChild(heading);

    const hamburger = document.createElement('button');
    hamburger.id = 'hamburger';
    hamburger.classList.value = 'header__hamburger';
    hamburger.addEventListener('click', () => {
      if (Game.getIsGameInProgress()) {
        Menu.toggleDisplay();
        Menu.reset();
        Game.toggleDisplay();
      }
    });
    container.appendChild(hamburger);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.value = 'header__svg';
    svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
    hamburger.appendChild(svg);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(
      null,
      'd',
      'M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z'
    );
    svg.appendChild(path);

    return header;
  };

  return {
    render,
  };
})();

export default Header;

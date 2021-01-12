import Header from './components/header/header';
import Menu from './components/menu/menu';
import Game from './components/game/game';
import './app.scss';

Header.render(); // inject header
Menu.render(); // inject menu

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.id === 'start-btn') {
    Game.init(Menu.getData());
    Menu.reset();
    Menu.toggleDisplay();
  }
});

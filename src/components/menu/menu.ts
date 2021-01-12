import Game from '../game/game';
import './menu.scss';

const root = document.querySelector('#root')!;

const Menu = (() => {
  let _display = true;
  let _current = 'main-menu';
  let _playerOneName = '';
  let _playerTwoName = '';
  let _mode: 'singleplayer' | 'twoplayer' = 'singleplayer';
  let _difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  const render = () => {
    let menu = document.querySelector('.menu');
    if (menu) menu.remove();
    root.appendChild(_create());
  };

  const reset = () => {
    _current = 'main-menu';
    _playerOneName = '';
    _playerTwoName = '';
    _mode = 'singleplayer';
    _difficulty = 'easy';

    render();
  };

  const getData = () => {
    return {
      playerOneName: _playerOneName,
      playerTwoName: _playerTwoName,
      mode: _mode,
      difficulty: _difficulty,
    };
  };

  const toggleDisplay = () => {
    _display = !_display;

    render();
  };

  const _toggleCurrent = () => {
    _current === 'main-menu'
      ? (_current = 'new-game-menu')
      : (_current = 'main-menu');

    render();
  };

  const _setMode = (value: 'singleplayer' | 'twoplayer') => {
    _mode = value;

    render();
  };

  const _setDifficulty = (value: 'easy' | 'medium' | 'hard') => {
    _difficulty = value;

    render();
  };

  const _create = () => {
    const menu = document.createElement('div');
    menu.classList.value = _display ? 'menu' : 'menu hidden';

    const heading = document.createElement('h2');
    heading.classList.value = 'menu__heading';
    heading.innerHTML = _current === 'new-game-menu' ? 'New Game' : 'Menu';
    menu.appendChild(heading);

    // Main Menu
    const mainMenu = document.createElement('div');
    mainMenu.classList.value =
      _current === 'main-menu' ? 'main-menu' : 'main-menu hidden';
    menu.appendChild(mainMenu);

    const resumeBtn = document.createElement('button');
    resumeBtn.classList.value = Game.getIsGameInProgress()
      ? 'menu__btn'
      : 'menu__btn hidden';
    resumeBtn.innerHTML = 'Resume';
    resumeBtn.addEventListener('click', () => {
      Game.toggleDisplay();
      toggleDisplay();
    });
    mainMenu.appendChild(resumeBtn);

    const newGameBtn = document.createElement('button');
    newGameBtn.classList.value = 'menu__btn';
    newGameBtn.innerHTML = 'New Game';
    newGameBtn.addEventListener('click', () => {
      _toggleCurrent();
    });
    mainMenu.appendChild(newGameBtn);

    // New Game Menu
    const newGameMenu = document.createElement('div');
    newGameMenu.classList.value =
      _current === 'new-game-menu' ? 'new-game-menu' : 'new-game-menu hidden';

    menu.appendChild(newGameMenu);

    const playerContainer = document.createElement('div');
    playerContainer.classList.value =
      _mode === 'twoplayer'
        ? 'new-game-menu__players'
        : 'new-game-menu__players hidden';
    newGameMenu.appendChild(playerContainer);

    const playerOneLabel = document.createElement('label');
    playerOneLabel.classList.value = 'new-game-menu__player-label';
    playerOneLabel.innerHTML = 'Player 1';
    playerContainer.appendChild(playerOneLabel);

    const playerOneInput = document.createElement('input');
    playerOneInput.classList.value = 'new-game-menu__player-input';
    playerOneInput.addEventListener('change', () => {
      _playerOneName = playerOneInput.value;
    });
    playerOneLabel.appendChild(playerOneInput);

    const playerTwoLabel = document.createElement('label');
    playerTwoLabel.classList.value = 'new-game-menu__player-label';
    playerTwoLabel.innerHTML = 'Player 2';
    playerContainer.appendChild(playerTwoLabel);

    const playerTwoInput = document.createElement('input');
    playerTwoInput.classList.value = 'new-game-menu__player-input';
    playerTwoInput.addEventListener('change', () => {
      _playerTwoName = playerTwoInput.value;
    });
    playerTwoLabel.appendChild(playerTwoInput);

    // Mode Input Container
    const modeContainer = document.createElement('div');
    modeContainer.classList.value = 'new-game-menu__radio-container';
    newGameMenu.appendChild(modeContainer);

    const modeHeading = document.createElement('h3');
    modeHeading.classList.value = 'new-game-menu__sub-heading';
    modeHeading.innerHTML = 'Mode';
    modeContainer.appendChild(modeHeading);

    const modeInputContainer = document.createElement('div');
    modeInputContainer.classList.value = 'new-game-menu__radio-inputs';
    modeContainer.appendChild(modeInputContainer);

    const singleplayerLabel = document.createElement('label');
    singleplayerLabel.classList.value = 'new-game-menu__radio-label';
    singleplayerLabel.innerHTML = '1-Player';
    modeInputContainer.appendChild(singleplayerLabel);

    const singleplayerInput = document.createElement('input');
    singleplayerInput.classList.value = 'new-game-menu__radio-input';
    singleplayerInput.type = 'radio';
    singleplayerInput.value = 'singleplayer';
    singleplayerInput.name = 'mode';
    if (_mode === 'singleplayer') singleplayerInput.checked = true;
    singleplayerInput.addEventListener('change', () =>
      _setMode('singleplayer')
    );
    singleplayerLabel.insertBefore(
      singleplayerInput,
      singleplayerLabel.firstChild
    );

    const twoplayerLabel = document.createElement('label');
    twoplayerLabel.classList.value = 'new-game-menu__radio-label';
    twoplayerLabel.innerHTML = '2-Player';
    modeInputContainer.appendChild(twoplayerLabel);

    const twoplayerInput = document.createElement('input');
    twoplayerInput.classList.value = 'new-game-menu__radio-input';
    twoplayerInput.type = 'radio';
    twoplayerInput.value = 'twoplayer';
    twoplayerInput.name = 'mode';
    if (_mode === 'twoplayer') twoplayerInput.checked = true;
    twoplayerInput.addEventListener('change', () => _setMode('twoplayer'));
    twoplayerLabel.insertBefore(twoplayerInput, twoplayerLabel.firstChild);

    // Difficulty Input Container
    const difficultyContainer = document.createElement('div');
    difficultyContainer.classList.value = 'new-game-menu__radio-container';
    _mode === 'twoplayer' && (difficultyContainer.classList.value = 'hidden');
    newGameMenu.appendChild(difficultyContainer);

    const difficultyHeading = document.createElement('h3');
    difficultyHeading.classList.value = 'new-game-menu__sub-heading';
    difficultyHeading.innerHTML = 'Difficulty';
    difficultyContainer.appendChild(difficultyHeading);

    const difficultyInputContainer = document.createElement('div');
    difficultyInputContainer.classList.value = 'new-game-menu__radio-inputs';
    difficultyContainer.appendChild(difficultyInputContainer);

    const _appendDifficultyInput = (
      value: 'easy' | 'medium' | 'hard',
      labelText: string
    ) => {
      const label = document.createElement('label');
      label.classList.value = 'new-game-menu__radio-label';
      label.innerHTML = labelText;
      difficultyInputContainer.appendChild(label);

      const input = document.createElement('input');
      input.classList.value = 'new-game-menu__radio-input';
      input.type = 'radio';
      input.value = value;
      input.name = 'difficulty';
      if (_difficulty === value) input.checked = true;
      input.addEventListener('change', () => _setDifficulty(value));
      label.insertBefore(input, label.firstChild);
    };

    _appendDifficultyInput('easy', 'Noob');
    _appendDifficultyInput('medium', 'Pro');
    _appendDifficultyInput('hard', 'Suicidal');

    const startBtn = document.createElement('button');
    startBtn.id = 'start-btn';
    startBtn.classList.value = 'menu__btn';
    startBtn.innerHTML = 'Start';
    newGameMenu.appendChild(startBtn);

    return menu;
  };

  return {
    render,
    getData,
    toggleDisplay,
    reset,
  };
})();

export default Menu;

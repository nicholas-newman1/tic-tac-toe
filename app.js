const root = document.querySelector('#root');

const Game = (() => {
  let _playerOne = { symbol: 'X' };
  let _playerTwo = { symbol: 'O' };
  let _mode;
  let _difficulty = 'easy';
  let _display = false;
  let _isGameInProgress = false;
  let _currentPlayer = _playerOne;
  let _firstPlayer = _playerOne;
  let _winningCombo = [];

  /* 0 = empty    
  'X' = animate X  
  'x' = static X  
  'O' = animate O  
  'o' = static O */
  let _gameData = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const init = ({ playerOneName, playerTwoName, mode, difficulty }) => {
    if (mode === 'singleplayer') {
      _playerOne.name = 'Player';
      _playerTwo.name = 'Computer';
      _difficulty = difficulty;
    } else if (mode === 'twoplayer') {
      _playerOne.name = playerOneName || 'Player 1';
      _playerTwo.name = playerTwoName || 'Player 2';
    }

    _mode = mode;

    _isGameInProgress = true;
    _display = true;
    render();
  };

  const reset = () => {
    _currentPlayer = _playerOne;
    _firstPlayer = _playerOne;
    _gameData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    _winningCombo = [];
    _display = false;
    _isGameInProgress = false;

    render();
  };

  const continueGame = () => {
    _currentPlayer = _getOppositePlayer(_firstPlayer);
    _firstPlayer = _getOppositePlayer(_firstPlayer);
    _gameData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    _winningCombo = [];

    if (_mode === 'singleplayer' && _currentPlayer.name === 'Computer') {
      _computerMove();
    }

    render();
  };

  const getIsGameInProgress = () => _isGameInProgress;

  const toggleDisplay = () => {
    _display = !_display;

    render();
  };

  const _toggleCurrentPlayer = () => {
    if (_currentPlayer === _playerOne) {
      _currentPlayer = _playerTwo;
    } else {
      _currentPlayer = _playerOne;
    }
  };

  const _getOppositePlayer = (player) => {
    return player === _playerOne ? _playerTwo : _playerOne;
  };

  const _makeMove = (id) => {
    _gameData = _gameData.map((item) => {
      if (item === 'X') return 'x';
      if (item === 'O') return 'o';
      return item;
    });
    _gameData[id] = _currentPlayer.symbol;
    render();

    _checkWinner();
    !_getIsGameOver() && _toggleCurrentPlayer();

    if (
      _mode === 'singleplayer' &&
      _currentPlayer.name === 'Computer' &&
      !_getIsGameOver()
    ) {
      _computerMove();
    }
  };

  const _computerMove = () => {
    const computerOccupiedSquareIds = _getOccupiedSquareIds();
    const userOccupiedSquareIds = _getOccupiedSquareIds(_playerOne.symbol);

    // check if computer has a winning move and return it
    const getWinningMove = () => {
      /* find combo that has two of its squares occupied by computer and none
      occupied by the user */
      const potentialWinningCombo = winningCombos.find((winningCombo) => {
        return (
          !winningCombo.some((id) => userOccupiedSquareIds.includes(id)) &&
          winningCombo.filter((id) => computerOccupiedSquareIds.includes(id))
            .length === 2
        );
      });

      if (potentialWinningCombo) {
        // return computer's winning move
        return potentialWinningCombo.find(
          (id) => !computerOccupiedSquareIds.includes(id)
        );
      }
    };

    // check if user has a winning move and return it
    const getPreventativeMove = () => {
      /* find winningCombo that has two of its squares occupied by user and none
      occupied by the computer */
      const potentialWinningCombo = winningCombos.find((winningCombo) => {
        return (
          !winningCombo.some((id) => computerOccupiedSquareIds.includes(id)) &&
          winningCombo.filter((id) => userOccupiedSquareIds.includes(id))
            .length === 2
        );
      });

      if (potentialWinningCombo) {
        // return user's winning move
        return potentialWinningCombo.find(
          (id) => !userOccupiedSquareIds.includes(id)
        );
      }
    };

    const getRandomMove = () => {
      const emptySquareIds = _getEmptySquareIds();
      const randomIndex = _getRandomInt(emptySquareIds.length);
      return emptySquareIds[randomIndex];
    };

    const isWinningMoveAvailable = () => {
      return typeof getWinningMove() === 'number';
    };

    const isPreventativeMoveAvailable = () => {
      return typeof getPreventativeMove() === 'number';
    };

    if (_difficulty === 'easy') {
      _makeMove(getRandomMove());
    } else if (_difficulty === 'medium') {
      if (isWinningMoveAvailable()) {
        _makeMove(getWinningMove());
      } else if (isPreventativeMoveAvailable()) {
        _makeMove(getPreventativeMove());
      } else {
        _makeMove(getRandomMove());
      }
    } else if (_difficulty === 'hard') {
      if (isWinningMoveAvailable()) {
        _makeMove(getWinningMove());
      } else if (isPreventativeMoveAvailable()) {
        _makeMove(getPreventativeMove());
      } else {
        _makeMove(getRandomMove());
      }
    } else {
      throw new Error('Invalid _difficulty');
    }

    render();
  };

  const _getEmptySquareIds = () => {
    let emptySquareIds = [];
    _gameData.forEach((symbol, i) => symbol === 0 && emptySquareIds.push(i));
    return emptySquareIds;
  };

  const _getOccupiedSquareIds = (playerSymbol = _currentPlayer.symbol) => {
    let occupiedSquareIds = _gameData
      .map((symbol, i) => {
        if (symbol !== 0 && symbol.toUpperCase() === playerSymbol) {
          return i;
        }
      })
      .filter((item) => item !== undefined);

    return occupiedSquareIds;
  };

  const _getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const _getIsWinner = () => _winningCombo.length > 0;
  const _getIsTie = () => !_gameData.some((value) => value === 0);
  const _getIsGameOver = () => _getIsWinner() || _getIsTie();

  const _checkWinner = () => {
    const occupiedSquareIds = _getOccupiedSquareIds();

    const winningCombo = winningCombos.find((winningCombo) =>
      winningCombo.every((i) => occupiedSquareIds.includes(i))
    );

    if (winningCombo) _endGame(winningCombo);
    return;
  };

  const _endGame = (winningCombo) => {
    _winningCombo = winningCombo;
  };

  const render = () => {
    let game = document.querySelector('.game');
    if (game) game.remove();
    root.appendChild(_create());
  };

  const _getPrompt = () => {
    if (_getIsWinner()) {
      return `${_currentPlayer.name} wins!`;
    } else if (_getIsTie()) {
      return 'Tie Game!';
    } else {
      return `${_currentPlayer.name}'s turn`;
    }
  };

  const _create = () => {
    const game = document.createElement('div');
    game.classList = _display ? 'game' : 'game hidden';

    const gameBoard = document.createElement('div');
    gameBoard.classList = 'game__board';
    game.appendChild(gameBoard);

    _gameData.forEach((symbol, i) => {
      const square = document.createElement('div');
      square.id = i;
      square.classList = 'game__square';
      _winningCombo.includes(i) && square.classList.add('game__square--winner');

      if (symbol === 0) {
        square.addEventListener('click', (e) => {
          !_getIsGameOver() && _makeMove(e.currentTarget.id);
        });
      } else {
        if (symbol.toLowerCase() === 'x') square.appendChild(_createX(symbol));
        if (symbol.toLowerCase() === 'o') square.appendChild(_createO(symbol));
      }

      gameBoard.appendChild(square);
    });

    const promptContainer = document.createElement('div');
    promptContainer.classList = 'game__prompt-container';
    game.appendChild(promptContainer);

    const prompt = document.createElement('h2');
    prompt.classList = 'game__prompt';
    prompt.innerHTML = _getPrompt();
    promptContainer.appendChild(prompt);

    const continueBtn = document.createElement('button');
    continueBtn.classList = 'game__continue';
    !_getIsGameOver() && continueBtn.classList.add('hidden');
    continueBtn.innerHTML = 'Continue';
    continueBtn.addEventListener('click', continueGame);
    promptContainer.appendChild(continueBtn);

    return game;
  };

  const _createX = (symbol) => {
    const animate = symbol === symbol.toUpperCase();

    const x = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    x.classList = 'game__svg';
    x.setAttributeNS(null, 'viewBox', '0 0 24 24');

    const path1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    path1.classList = `game__path ${animate ? 'game__path--animate-x-1' : ''}`;
    path1.setAttributeNS(
      null,
      'd',
      'M 0.25802778,0.25801807 23.741963,23.741982'
    );
    x.appendChild(path1);

    const path2 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    path2.classList = `game__path ${animate ? 'game__path--animate-x-2' : ''}`;
    path2.setAttributeNS(
      null,
      'd',
      'M 23.471462,0.52869874 0.52825642,23.471451'
    );
    x.appendChild(path2);

    return x;
  };

  const _createO = (symbol) => {
    const animate = symbol === symbol.toUpperCase();

    const o = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    o.classList = 'game__svg';
    o.setAttributeNS(null, 'viewBox', '0 0 24 24');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList = `game__path ${animate ? 'game__path--animate-o' : ''}`;
    path.setAttributeNS(
      null,
      'd',
      'm 12.001048,0.71208 c 5.745419,0 11.286601,5.6889519 11.286601,11.354863 0.045,5.52936 -5.586421,11.220636 -11.286601,11.220636 C 6.3913458,23.332553 0.57896053,18.36878 0.7144464,12.066943 0.7594532,6.4453094 6.3008667,0.75705493 12.001048,0.71208 Z'
    );
    o.appendChild(path);

    return o;
  };

  return {
    init,
    reset,
    getIsGameInProgress,
    toggleDisplay,
  };
})();

const Menu = (() => {
  let _display = true;
  let _current = 'main-menu';
  let _playerOneName = '';
  let _playerTwoName = '';
  let _mode = 'singleplayer';
  let _difficulty = 'easy';

  const render = () => {
    let menu = document.querySelector('.menu');
    if (menu) menu.remove();
    root.appendChild(_create());
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

  const reset = () => {
    _display = true;
    _current = 'main-menu';
    _playerOneName = '';
    _playerTwoName = '';
    _mode = 'singleplayer';
    _difficulty = 'easy';

    render();
  };

  const _setMode = (value) => {
    _mode = value;

    render();
  };

  const _setDifficulty = (value) => {
    _difficulty = value;

    render();
  };

  const _create = () => {
    const menu = document.createElement('div');
    menu.classList = _display ? 'menu' : 'menu hidden';

    const heading = document.createElement('h2');
    heading.classList = 'menu__heading';
    heading.innerHTML = 'Menu';
    menu.appendChild(heading);

    // Main Menu
    const mainMenu = document.createElement('div');
    mainMenu.classList =
      _current === 'main-menu' ? 'main-menu' : 'main-menu hidden';
    menu.appendChild(mainMenu);

    const resumeBtn = document.createElement('button');
    resumeBtn.classList = Game.getIsGameInProgress()
      ? 'menu__btn'
      : 'menu__btn hidden';
    resumeBtn.innerHTML = 'Resume';
    resumeBtn.addEventListener('click', () => {
      Game.toggleDisplay();
      toggleDisplay();
    });
    mainMenu.appendChild(resumeBtn);

    const newGameBtn = document.createElement('button');
    newGameBtn.classList = 'menu__btn';
    newGameBtn.innerHTML = 'New Game';
    newGameBtn.addEventListener('click', () => {
      Game.reset();
      _toggleCurrent();
    });
    mainMenu.appendChild(newGameBtn);

    // New Game Menu
    const newGameMenu = document.createElement('div');
    newGameMenu.classList =
      _current === 'new-game-menu' ? 'new-game-menu' : 'new-game-menu hidden';
    menu.appendChild(newGameMenu);

    const playerContainer = document.createElement('div');
    playerContainer.classList =
      _mode === 'twoplayer'
        ? 'new-game-menu__players'
        : 'new-game-menu__players hidden';
    newGameMenu.appendChild(playerContainer);

    const playerOneLabel = document.createElement('label');
    playerOneLabel.classList = 'new-game-menu__player-label';
    playerOneLabel.innerHTML = 'Player 1';
    playerContainer.appendChild(playerOneLabel);

    const playerOneInput = document.createElement('input');
    playerOneInput.classList = 'new-game-menu__player-input';
    playerOneInput.addEventListener('change', () => {
      _playerOneName = playerOneInput.value;
    });
    playerOneLabel.appendChild(playerOneInput);

    const playerTwoLabel = document.createElement('label');
    playerTwoLabel.classList = 'new-game-menu__player-label';
    playerTwoLabel.innerHTML = 'Player 2';
    playerContainer.appendChild(playerTwoLabel);

    const playerTwoInput = document.createElement('input');
    playerTwoInput.classList = 'new-game-menu__player-input';
    playerTwoInput.addEventListener('change', () => {
      _playerTwoName = playerTwoInput.value;
    });
    playerTwoLabel.appendChild(playerTwoInput);

    // Mode Input Container
    const modeContainer = document.createElement('div');
    modeContainer.classList = 'new-game-menu__radio-container';
    newGameMenu.appendChild(modeContainer);

    const modeHeading = document.createElement('h3');
    modeHeading.classList = 'new-game-menu__sub-heading';
    modeHeading.innerHTML = 'Mode';
    modeContainer.appendChild(modeHeading);

    const modeInputContainer = document.createElement('div');
    modeInputContainer.classList = 'new-game-menu__radio-inputs';
    modeContainer.appendChild(modeInputContainer);

    const singleplayerLabel = document.createElement('label');
    singleplayerLabel.classList = 'new-game-menu__radio-label';
    singleplayerLabel.innerHTML = '1-Player';
    modeInputContainer.appendChild(singleplayerLabel);

    const singleplayerInput = document.createElement('input');
    singleplayerInput.classList = 'new-game-menu__radio-input';
    singleplayerInput.type = 'radio';
    singleplayerInput.value = 'singleplayer';
    singleplayerInput.name = 'mode';
    if (_mode === 'singleplayer') singleplayerInput.checked = 'checked';
    singleplayerInput.addEventListener('change', () =>
      _setMode('singleplayer')
    );
    singleplayerLabel.insertBefore(
      singleplayerInput,
      singleplayerLabel.firstChild
    );

    const twoplayerLabel = document.createElement('label');
    twoplayerLabel.classList = 'new-game-menu__radio-label';
    twoplayerLabel.innerHTML = '2-Player';
    modeInputContainer.appendChild(twoplayerLabel);

    const twoplayerInput = document.createElement('input');
    twoplayerInput.classList = 'new-game-menu__radio-input';
    twoplayerInput.type = 'radio';
    twoplayerInput.value = 'twoplayer';
    twoplayerInput.name = 'mode';
    if (_mode === 'twoplayer') twoplayerInput.checked = 'checked';
    twoplayerInput.addEventListener('change', () => _setMode('twoplayer'));
    twoplayerLabel.insertBefore(twoplayerInput, twoplayerLabel.firstChild);

    // Difficulty Input Container
    const difficultyContainer = document.createElement('div');
    difficultyContainer.classList = 'new-game-menu__radio-container';
    _mode === 'twoplayer' && difficultyContainer.classList.add('hidden');
    newGameMenu.appendChild(difficultyContainer);

    const difficultyHeading = document.createElement('h3');
    difficultyHeading.classList = 'new-game-menu__sub-heading';
    difficultyHeading.innerHTML = 'Difficulty';
    difficultyContainer.appendChild(difficultyHeading);

    const difficultyInputContainer = document.createElement('div');
    difficultyInputContainer.classList = 'new-game-menu__radio-inputs';
    difficultyContainer.appendChild(difficultyInputContainer);

    const _appendDifficultyInput = (value, labelText) => {
      const label = document.createElement('label');
      label.classList = 'new-game-menu__radio-label';
      label.innerHTML = labelText;
      difficultyInputContainer.appendChild(label);

      const input = document.createElement('input');
      input.classList = 'new-game-menu__radio-input';
      input.type = 'radio';
      input.value = value;
      input.name = 'difficulty';
      if (_difficulty === value) input.checked = 'checked';
      input.addEventListener('change', () => _setDifficulty(value));
      label.insertBefore(input, label.firstChild);
    };

    _appendDifficultyInput('easy', 'Noob');
    _appendDifficultyInput('medium', 'Pro');
    _appendDifficultyInput('hard', 'Suicidal');

    const startBtn = document.createElement('button');
    startBtn.id = 'start-btn';
    startBtn.classList = 'menu__btn';
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

const Header = (() => {
  const render = () => {
    let header = document.querySelector('.header');
    if (header) header.remove();
    root.appendChild(_createHeader());
  };

  const _createHeader = () => {
    const header = document.createElement('div');
    header.classList = 'header';

    const container = document.createElement('div');
    container.classList = 'header__container';
    header.appendChild(container);

    const heading = document.createElement('h1');
    heading.classList = 'header__heading';
    heading.innerHTML = 'Tic Tac Toe';
    container.appendChild(heading);

    const hamburger = document.createElement('button');
    hamburger.id = 'hamburger';
    hamburger.classList = 'header__hamburger';
    hamburger.addEventListener('click', () => {
      if (Game.getIsGameInProgress()) {
        Menu.toggleDisplay();
        Game.toggleDisplay();
      }
    });
    container.appendChild(hamburger);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList = 'header__svg';
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

const App = (() => {
  Header.render(); // inject header
  Menu.render(); // inject menu

  document.addEventListener('click', (e) => {
    if (e.target.id === 'start-btn') {
      Game.init(Menu.getData());
      Menu.reset();
      Menu.toggleDisplay();
    }
  });
})();

import './game.scss';

const root = document.querySelector('#root')!;

const Game = (() => {
  let _playerOne: { symbol: 'X' | 'O'; name: string } = {
    symbol: 'X',
    name: 'Player 1',
  };
  let _playerTwo: { symbol: 'X' | 'O'; name: string } = {
    symbol: 'O',
    name: 'Player 2',
  };
  let _mode: 'singleplayer' | 'twoplayer';
  let _difficulty = 'easy';
  let _display = false;
  let _isGameInProgress = false;
  let _currentPlayer = _playerOne;
  let _firstPlayer = _playerOne;
  let _winningCombo: number[] = [];

  /* 0 = empty    
  'X' = animate X  
  'x' = static X  
  'O' = animate O  
  'o' = static O */
  let _gameData: (0 | 'x' | 'X' | 'o' | 'O')[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

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

  const init = (data: {
    playerOneName: string;
    playerTwoName: string;
    mode: 'singleplayer' | 'twoplayer';
    difficulty: 'easy' | 'medium' | 'hard';
  }) => {
    const { playerOneName, playerTwoName, mode, difficulty } = data;
    reset();

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

  const render = () => {
    let game = document.querySelector('.game');
    if (game) game.remove();
    root.appendChild(_createGameBoard());
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

  const toggleDisplay = () => {
    _display = !_display;

    render();
  };

  const getIsGameInProgress = () => _isGameInProgress;

  const _getOppositePlayer = (player: { symbol: string; name: string }) => {
    return player === _playerOne ? _playerTwo : _playerOne;
  };

  const _makeMove = (id: number) => {
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

  const _toggleCurrentPlayer = () => {
    if (_currentPlayer === _playerOne) {
      _currentPlayer = _playerTwo;
    } else {
      _currentPlayer = _playerOne;
    }
  };

  const _getIsWinner = () => _winningCombo.length > 0;
  const _getIsTie = () => !_gameData.some((value) => value === 0);
  const _getIsGameOver = () => _getIsWinner() || _getIsTie();

  const _checkWinner = () => {
    const occupiedSquareIds = _getOccupiedSquareIds();

    const winningCombo = winningCombos.find((winningCombo) => {
      return winningCombo.every((i) => occupiedSquareIds.includes(i));
    });

    if (winningCombo) _endGame(winningCombo);
  };

  const _endGame = (winningCombo: number[]) => {
    _winningCombo = winningCombo;

    render();
  };

  const _getEmptySquareIds = () => {
    let emptySquareIds: number[] = [];
    _gameData.forEach((symbol, i) => symbol === 0 && emptySquareIds.push(i));
    return emptySquareIds;
  };

  const _getOccupiedSquareIds = (playerSymbol = _currentPlayer.symbol) => {
    let occupiedSquareIds: number[] = [];

    _gameData.forEach((symbol, i) => {
      if (symbol !== 0 && symbol.toUpperCase() === playerSymbol) {
        occupiedSquareIds.push(i);
      }
    });

    return occupiedSquareIds;
  };

  const _computerMove = () => {
    // check if computer has a winning move and return it
    const getWinningMove = () => {
      const computerOccupiedSquareIds = _getOccupiedSquareIds();
      const userOccupiedSquareIds = _getOccupiedSquareIds(_playerOne.symbol);

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
        var winningMove = potentialWinningCombo.find(
          (id) => !computerOccupiedSquareIds.includes(id)
        );
      }

      return winningMove !== undefined ? winningMove : -1;
    };

    // check if user has a winning move and return it
    const getPreventativeMove = () => {
      const computerOccupiedSquareIds = _getOccupiedSquareIds();
      const userOccupiedSquareIds = _getOccupiedSquareIds(_playerOne.symbol);

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
        var preventativeMove = potentialWinningCombo.find(
          (id) => !userOccupiedSquareIds.includes(id)
        );
      }

      return preventativeMove !== undefined ? preventativeMove : -1;
    };

    const getRandomMove = () => {
      const _getRandomInt = (max: number) => {
        return Math.floor(Math.random() * Math.floor(max));
      };
      const emptySquareIds = _getEmptySquareIds();
      const randomIndex = _getRandomInt(emptySquareIds.length);
      return emptySquareIds[randomIndex];
    };

    /* returns true if current move number === num (ex: isMove(1) returns true
    if it is currently the first move of the game) */
    const isMove = (num: number) => {
      return 10 - _getEmptySquareIds().length === num;
    };

    // choose opposite corner
    const getThirdMove = () => {
      const userOccupiedSquareIds = _getOccupiedSquareIds(_playerOne.symbol);
      const userMove = userOccupiedSquareIds[0];
      if ([1, 2, 5].includes(userMove)) return 6;
      if ([3, 6, 7, 8].includes(userMove)) return 2;
      return 8;
    };

    // choose another opposite corner
    const getFifthMove = () => {
      const userOccupiedSquareIds = _getOccupiedSquareIds(_playerOne.symbol);
      if (
        userOccupiedSquareIds.some((id) => [1, 2, 5].includes(id)) &&
        userOccupiedSquareIds.includes(3)
      ) {
        return 8;
      }

      if (
        userOccupiedSquareIds.some((id) => [3, 6, 7, 8].includes(id)) &&
        userOccupiedSquareIds.includes(1)
      ) {
        return userOccupiedSquareIds.includes(8) ? 6 : 8;
      }

      return -1;
    };

    // if available, choose center, otherwise choose corner
    const getSecondMove = () => {
      const emptySquareIds = _getEmptySquareIds();
      if (emptySquareIds.includes(4)) return 4;
      return 0;
    };

    // choose a side
    const getFourthMove = () => {
      const emptySquareIds = _getEmptySquareIds();
      const emptySquareId = [1, 3, 5, 7].find((id) =>
        emptySquareIds.includes(id)
      );
      return emptySquareId ? emptySquareId : -1;
    };

    if (_difficulty === 'easy') {
      _makeMove(getRandomMove());
    } else if (_difficulty === 'medium') {
      if (getWinningMove() !== -1) {
        _makeMove(getWinningMove());
      } else if (getPreventativeMove() !== -1) {
        _makeMove(getPreventativeMove());
      } else {
        _makeMove(getRandomMove());
      }
    } else if (_difficulty === 'hard') {
      if (isMove(1)) {
        _makeMove(0);
      } else if (isMove(2)) {
        _makeMove(getSecondMove());
      } else if (isMove(3)) {
        _makeMove(getThirdMove());
      } else if (getWinningMove() !== -1) {
        _makeMove(getWinningMove());
      } else if (getPreventativeMove() !== -1) {
        _makeMove(getPreventativeMove());
      } else if (isMove(4)) {
        _makeMove(getFourthMove());
      } else if (isMove(5)) {
        _makeMove(getFifthMove());
      } else {
        _makeMove(getRandomMove());
      }
    } else {
      throw new Error('Invalid difficulty');
    }

    render();
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

  const _createGameBoard = () => {
    const game = document.createElement('div');
    game.classList.value = _display ? 'game' : 'game hidden';

    const gameBoard = document.createElement('div');
    gameBoard.classList.value = 'game__board';
    game.appendChild(gameBoard);

    _gameData.forEach((symbol, i) => {
      const square = document.createElement('div');
      square.id = i.toString();
      square.classList.value = 'game__square';
      _winningCombo.includes(i) &&
        (square.classList.value = 'game__square game__square--winner');

      if (symbol === 0) {
        square.addEventListener('click', (e) => {
          const square = e.currentTarget as HTMLDivElement;
          !_getIsGameOver() && _makeMove(+square.id);
        });
      } else {
        if (symbol === 'x' || symbol === 'X') {
          square.appendChild(_createX(symbol));
        }
        if (symbol === 'o' || symbol === 'O') {
          square.appendChild(_createO(symbol));
        }
      }

      gameBoard.appendChild(square);
    });

    const promptContainer = document.createElement('div');
    promptContainer.classList.value = 'game__prompt-container';
    game.appendChild(promptContainer);

    const prompt = document.createElement('h2');
    prompt.classList.value = 'game__prompt';
    prompt.innerHTML = _getPrompt();
    promptContainer.appendChild(prompt);

    const continueBtn = document.createElement('button');
    continueBtn.classList.value = 'game__continue';
    !_getIsGameOver() &&
      (continueBtn.classList.value = 'game__continue hidden');
    continueBtn.innerHTML = 'Continue';
    continueBtn.addEventListener('click', continueGame);
    promptContainer.appendChild(continueBtn);

    return game;
  };

  const _createX = (symbol: 'x' | 'X') => {
    const animate = symbol === symbol.toUpperCase();

    const x = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    x.classList.value = 'game__svg';
    x.setAttributeNS(null, 'viewBox', '0 0 24 24');

    const path1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    path1.classList.value = `game__path ${
      animate ? 'game__path--animate-x-1' : ''
    }`;
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
    path2.classList.value = `game__path ${
      animate ? 'game__path--animate-x-2' : ''
    }`;
    path2.setAttributeNS(
      null,
      'd',
      'M 23.471462,0.52869874 0.52825642,23.471451'
    );
    x.appendChild(path2);

    return x;
  };

  const _createO = (symbol: 'o' | 'O') => {
    const animate = symbol === symbol.toUpperCase();

    const o = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    o.classList.value = 'game__svg';
    o.setAttributeNS(null, 'viewBox', '0 0 24 24');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.value = `game__path ${
      animate ? 'game__path--animate-o' : ''
    }`;
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

export default Game;

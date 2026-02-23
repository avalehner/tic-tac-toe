// Instructions: write a program that lets two humans play a game of Tic Tac Toe in a terminal. The program should let the players take turns to input their moves. The program should report the outcome of the game. 

//npm install prompts
const prompts = require('prompts')

let boardArr =[null, null, null, null, null, null, null, null, null]

const quitGame = () => {
  console.log('Thank you for playing!')
  process.exit(0)
}

const determineMovesLeft = (board) => {
  return board.some(element => element === null) 
}

const determineWinningCombination = (board) => {
  const winningCombinations = [
    [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], //horizontal 
    [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ], //vertical
    [ 0, 4, 8 ], [ 2, 4, 6 ] //diagonal 
  ] 
 
  return winningCombinations.some(([ a, b, c ]) => {
    return board[a] !== null && board[a] === board[b] && board[b] === board[c]
  })
} 

const displayBoard = (board) => {
  const display = board.map((position, index) => {
    return position === null ? index + 1 : position
  })

  console.log(`
     ${display[0]} | ${display[1]} | ${display[2]}
    -----------
     ${display[3]} | ${display[4]} | ${display[5]}
    -----------
     ${display[6]} | ${display[7]} | ${display[8]}
  `)
}

const getWinningPlayer = (player) => {
  if(determineWinningCombination(boardArr)) {
    return  { winner: player, 
              message: `Congratulations ${player} you have won tic-tac-toe!` 
            } 
  }

  if(!determineMovesLeft(boardArr)) {
    return  { winner: null, 
              message: 'Cat scratch, nobody wins :('   
            }
  }
  return false 
}

const renderReplayMenu = async (getWinningPlayer, player) => {
    const menu = await prompts({
      type: 'select',   
      name: 'repeat', 
      message: `${getWinningPlayer(player).message}`, 
      choices: [
        {title: 'Yes', value: 'yes'},
        {title: 'Quit', value: 'quit'}
      ], 
      initial: 0
    }, { onCancel: quitGame })

    if (menu.repeat === undefined || menu.repeat === 'quit') {
      console.log('Thank you for playing, goodbye!') 
      process.exit(0)
    }

    if (menu.repeat === 'yes') {
      boardArr =[null, null, null, null, null, null, null, null, null]
      await playTicTacToe()
    }
}

const playTicTacToe = async () => {
  console.clear()

  //welcome message 
  await prompts ({
    type: 'text', 
    name: 'welcome', 
    message: `Welcome to tic-tac-toe! Press enter to begin`
  }, { onCancel: quitGame })

  //players enter their names 
  const playerOneResponse = await prompts({
    type: 'text', 
    name: 'name', 
    message: 'Enter name for Player 1: ', 
    validate: name => {
      if (name.trim() === '') {
        return 'Please enter a name for Player 1'
      }
      return true 
    }
  }, { onCancel: quitGame })

  const playerTwoResponse = await prompts({
    type: 'text', 
    name: 'name', 
    message: 'Enter name for Player 2: ', 
    validate: name => {
      if (name.trim() === '') {
        return 'Please enter a name for Player 2'
      }
      return true 
    }
  }, { onCancel: quitGame })

  const playerOne = playerOneResponse.name.trim()
  const playerTwo = playerTwoResponse.name.trim()

  //find out who goes first
  await prompts ({
    type: 'text', 
    name: 'continue', 
    message: `Hello ${playerOne} and ${playerTwo}! Press enter to see who gets to go first :)`
  }, { onCancel: quitGame })
  
  const firstPlayer = Math.random() < 0.5 ? playerOne : playerTwo
  let currentPlayer = firstPlayer

  await prompts ({
    type: 'text', 
    name: 'continue', 
    message: `${firstPlayer} is first! Press enter to start playing`
  }, { onCancel: quitGame })

  //handle player turns 
  while (!determineWinningCombination(boardArr) && determineMovesLeft(boardArr)) {
    displayBoard(boardArr)
    let playerSymbol = currentPlayer === firstPlayer ? 'X' : 'O'
      
    const playerInputResponse = await prompts ({
      type: 'text', 
      name: 'position', 
      message: `${currentPlayer} your symbol is ${playerSymbol}. Enter a digit 1 through 9 to place your symbol on the board:`, 
      validate: value => {
        const num = Number(value)
        if (isNaN(num) || num < 1 || num > 9) {
          return `${currentPlayer} Input a number between 1 and 9 (your symbol is ${playerSymbol}): `
        }
        if (boardArr[num - 1] !== null) {
          return `${currentPlayer} you cannot overwrite a previous move, enter another position (you are ${playerSymbol}): `
        }
        return true
      }
    }, { onCancel: quitGame })

    //assign player input to board position 
    let playerInput = Number(playerInputResponse.position)
    boardArr[playerInput - 1] = playerSymbol

    //assign winning player and exit while loop 
    if (getWinningPlayer(currentPlayer)) break 
  
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne
  }

  //display final board and render replay menu 
  displayBoard(boardArr)
  await renderReplayMenu(getWinningPlayer, currentPlayer)
}

playTicTacToe()


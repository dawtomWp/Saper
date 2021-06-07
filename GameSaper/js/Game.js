import { Cell } from './Cell.js';
import { UI } from './UI.js';
import {Counter} from './Counter.js';
import {Timer} from './Timer.js';
import {ResetButton} from './ResetButton.js' ;
import {Modal} from "./Modal.js";
import { CustomBoard } from './CustomBoard.js';

class Game extends UI {
  #config = { //game difficult
    easy: {
      rows:8,
      cols:8,
      mines: 10,
    },
    normal: {
      rows:16,
      cols:16,
      mines: 40,
    },
    expert: {
      rows:16,
      cols:30,
      mines: 99,
    },
    custom: {
      rows:null,
      cols:null,
      mines: null,
    }
  };

  #counter = new Counter();
  #timer = new Timer();
  #modal = new Modal();
  customGame = new CustomBoard()

  #isGameFinished = false;

  #numberOfRows = null;
  #numberOfCols = null;
  #numberOfMines = null;

  #cells = [];
  #cellsElements = null;
  #cellsToReveal = 0;
  #revealedCells = 0;

  #board = null;
  #buttons = {
    modal:null,
    easy:null,
    normal: null,
    expert: null,
    reset: new ResetButton(),

  }
  
  initializeGame() {
    this.#handleElements(); // bedziemy przypisywali uchwyty do elementow
    this.#counter.init();
    this.#timer.init();
   // console.log(this.customGame.inputMines.value)


    this.#addButtonsEventListeners();
    this.#newGame();
  }
  #newGame(
    rows = this.#config.easy.rows, 
    cols = this.#config.easy.cols, 
    mines = this.#config.easy.mines
  ) {
    this.#numberOfRows = rows;
    this.#numberOfCols = cols;
    this.#numberOfMines = mines;

    this.#counter.setValue(this.#numberOfMines)
    this.#timer.resetTimer()

    this.#cellsToReveal = this.#numberOfCols * this.#numberOfRows - this.#numberOfMines; 

    this.#buttons.reset.changeEmote('neutral');

    this.#isGameFinished = false;
    this.#revealedCells = 0;

    this.#setStyles();
    this.#generateCells();
    this.#renderBoard();

    this.#createMinesInCells();

    this.#cellsElements = this.getElements(this.UiSelectors.cell)

    this.#addCellsEventListeners();
  }
  #endGame(isWin) {
    this.#isGameFinished = true;
    this.#timer.stopTimer();
    this.customGame.customModal.classList.remove('customHide')
    this.#modal.buttonText = 'Close';


    if(!isWin) {
      this.#revealMines();
      this.#modal.infoText = 'You lost, try again !';
      this.#buttons.reset.changeEmote('negative');
      this.#modal.setText();
      this.#modal.toggleModal();
      return;
    }
    this.#modal.infoText = this.#timer.numberOfSeconds < this.#timer.maxNumberOfSeconds ? `You won, it took you ${this.#timer.numberOfSeconds} seconds, congratulations !` : 'You won, congratulations';
    this.#buttons.reset.changeEmote('positive');
    this.#modal.setText();
    this.#modal.toggleModal();
  }

  #handleElements() {
    this.#board = this.getElement(this.UiSelectors.board);
    this.#buttons.modal =this.getElement(this.UiSelectors.modalButton);
    this.#buttons.easy =this.getElement(this.UiSelectors.easyButton);
    this.#buttons.normal =this.getElement(this.UiSelectors.normalButton);
    this.#buttons.expert =this.getElement(this.UiSelectors.expertButton);
    this.#buttons.customButton = this.getElement(this.UiSelectors.customButton)
    

  }
  #addCellsEventListeners() {
    this.#cellsElements.forEach((element) =>{

      element.addEventListener('click', this.#handleCellClick);
      element.addEventListener('contextmenu', this.#handleCellContextMenu)
    })
  }
  #addButtonsEventListeners() {
    this.#buttons.modal.addEventListener('click',this.#modal.toggleModal)
    this.#buttons.easy.addEventListener('click',() => this.#handleNewGameClick(this.#config.easy.rows, this.#config.easy.cols, this.#config.easy.mines));
    this.#buttons.normal.addEventListener('click',() => this.#handleNewGameClick(this.#config.normal.rows, this.#config.normal.cols, this.#config.normal.mines));
    this.#buttons.expert.addEventListener('click',() => this.#handleNewGameClick(this.#config.expert.rows, this.#config.expert.cols, this.#config.expert.mines));
    this.#buttons.customButton.addEventListener('click',()=> this.#showCustomModal())
    this.#buttons.reset.element.addEventListener('click',() => this.#handleNewGameClick());
    this.customGame.button.addEventListener('click', () => this.createCustomBoard());

  }
  #removeCellsEventListeners() {
    this.#cellsElements.forEach((element) => {
      element.removeEventListener('click', this.#handleCellClick);
      element.removeEventListener('contextmenu', this.#handleCellContextMenu);
    })
  }

  #handleNewGameClick(rows = this.#numberOfRows, cols= this.#numberOfCols, mines = this.#numberOfMines) {
    this.#removeCellsEventListeners();
    this.#newGame(rows,cols,mines);

  }

  #generateCells() {
    console.log()
    this.#cells.length = 0;
    for(let row = 0; row < this.#numberOfRows; row++) {
       this.#cells[row] = [] //dwuwymiarowa tablica
       for(let col = 0; col < this.#numberOfCols; col++) {
         this.#cells[row].push(new Cell(col,row)) 
       }
    }
  }
  #renderBoard() {
    this.#board.innerHTML = '';
    this.#cells.flat().forEach(cell => {
      this.#board.insertAdjacentHTML('beforeend', cell.createElement())
      cell.element = cell.getElement(cell.selector)
    });
  }
  #createMinesInCells() {
   let minesToPlace = this.#numberOfMines;
  
   while(minesToPlace) {
     const rowIndex = this.#getRandomInteger(0, this.#numberOfRows -1);
     const colIndex = this.#getRandomInteger(0, this.#numberOfCols -1);

     const cell = this.#cells[rowIndex][colIndex];
     const hasCellMine = cell.isMine

     if(!hasCellMine) {
       cell.createMine();
       minesToPlace--;
     }
   }
  }
  #handleCellClick = (e) => {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'),10);
    const colIndex = parseInt(target.getAttribute('data-x'),10)

    const cell = this.#cells[rowIndex][colIndex];
    this.#clickCell(cell)
  }
  #handleCellContextMenu = (e) => {
    e.preventDefault();
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'),10);
    const colIndex = parseInt(target.getAttribute('data-x'),10)

    const cell = this.#cells[rowIndex][colIndex]

    if(cell.isReveal || this.#isGameFinished) return; //sprawdza czy odslonięte juz

    if(cell.isFlagged) {
      this.#counter.increment()
      cell.toggleFlag()
      return;
    }

    if(!this.#counter.value <= 0) { //wartosc inna od 0
      this.#counter.decrement();
      cell.toggleFlag()
    }


  }
  #clickCell(cell) {
    if(this.#isGameFinished || cell.isFlagged || cell.isReveal) return;
     if(cell.isMine) {
       this.#endGame(false)
     }
     this.#setCellValue(cell);

     if(this.#revealedCells === this.#cellsToReveal && !this.#isGameFinished) {
       this.#endGame(true)
     }
  }
  #revealMines() {
    this.#cells
    .flat().
    filter(({isMine}) => isMine)
    .forEach((cell) => cell.revealCell());
  }
  #setCellValue(cell) {
    let minesCount = 0;
    for (
      let rowIndex = Math.max(cell.y - 1,0);
      rowIndex <= Math.min(cell.y+1, this.#numberOfRows -1);
      rowIndex++) 
      {
      for(
        let colIndex = Math.max(cell.x -1,0); 
        colIndex <= Math.min(cell.x +1, this.#numberOfCols -1); 
        colIndex++) 
        {
        if(this.#cells[rowIndex][colIndex].isMine) minesCount++;
      }
    }
    cell.value = minesCount;
    cell.revealCell();
    this.#revealedCells++;

  }
  #showCustomModal() {
    this.customGame.customModal.style.left='60%'
    this.customGame.customModal.classList.toggle('customHide')
    
    this.customGame.customModalError.style.visibility='hidden';

  }
  createCustomBoard() {
    let numRow = parseInt(this.customGame.inputRow.value,10);
    let numCol = parseInt(this.customGame.inputCol.value,10);
    let numMines = parseInt(this.customGame.inputMines.value,10);

    this.#config.custom.rows = numRow;
    this.#config.custom.cols = numCol;
    this.#config.custom.mines = numMines;

    if (numRow > 5 && numCol > 5 && numMines >0 && numMines < numRow*numCol && numRow <101 && numCol <101) {
      this.#handleNewGameClick(this.#config.custom.rows, this.#config.custom.cols, this.#config.custom.mines)
      this.customGame.customModal.classList.remove('customHide')

      this.customGame.customModalError.style.visibility='hidden';
      this.customGame.inputRow.value = '';
      this.customGame.inputCol.value = '';
      this.customGame.inputMines.value = '';
    } else {
      this.customGame.customModalError.style.visibility='visible'
    }

  }


  #setStyles(){
    document.documentElement.style.setProperty('--cells-in-row',this.#numberOfCols)
  }
  #getRandomInteger(min,max) {
    return Math.floor(Math.random()* (max-min +1)) + min
  }


}



window.onload = function() {
  const game = new Game()
  game.initializeGame()
}
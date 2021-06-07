import {UI} from './UI.js';

export class CustomBoard extends UI{
    customModal = this.getElement(this.UiSelectors.customModal)
    button = this.getElement(this.UiSelectors.generateCustom);
    inputCol = this.getElement(this.UiSelectors.inputCol);
    inputRow = this.getElement(this.UiSelectors.inputRow);
    inputMines = this.getElement(this.UiSelectors.inputMines);
    customModalError =  this.getElement(this.UiSelectors.customError);
}
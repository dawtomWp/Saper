import {UI} from './UI.js'

export class Cell extends UI {
    constructor(x,y) {
        super();
        this.x = x;
        this.y = y;
        this.value = 0; //cell number value
        this.isMine = false;//mine or safe
        this.isReveal = false;
        this.isFlagged = false;
        this.selector = `[data-x="${this.x}"][data-y="${this.y}"]`;
        this.element = null;
    }

    createElement() {
        const element = `<div class="cell border border--concave" data-cell data-x="${this.x}" data-y ="${this.y}"</div>`
        return element
    }
    revealCell()  {
        this.isReveal = true;
        this.element.classList.remove('border--concave');
        this.element.classList.add('border--revealed')

        if(this.isMine) {
            this.element.classList.add('cell--is-mine')
            return;
        }
        if(this.value) {
            this.element.textContent = this.value;
            this.element.classList.add(`cell-info-${this.value}`);
        }
    }
    toggleFlag() {
        this.isFlagged = !this.isFlagged;
        this.element.classList.toggle('cell--is-flag')
   }
   createMine() {
       this.isMine = true;
   }
}
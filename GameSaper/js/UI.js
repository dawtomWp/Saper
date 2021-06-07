export class UI {
    UiSelectors = {
        board: '[data-board]',
        cell: '[data-cell]',
        counter: '[data-counter]',
        timer: '[data-timer]',
        resetButton: '[data-button-reset]',
        easyButton: '[data-button-easy]',
        normalButton: '[data-button-normal]',
        expertButton: '[data-button-expert]',
        customButton: '[data-button-custom]',
        modal: '[data-modal]',
        modalHeader: '[data-modal-header]',
        modalButton: '[data-modal-button]',
        inputCol: '[data-input-cols]',
        inputRow: '[data-input-rows]',
        inputMines: '[data-input-mines]',
        generateCustom: '[data-button-generate]',
        customModal: '[data-custom-board-modal]',
        customError: '[data-custom-error]'
    }
    getElement(selector) {
        return document.querySelector(selector)
    }
    getElements(selector) {
        return document.querySelectorAll(selector)
    }
}
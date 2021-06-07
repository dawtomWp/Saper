import {UI} from "./UI.js"

export class ResetButton extends UI{
  element = this.getElement(this.UiSelectors.resetButton)

  changeEmote(emote) {
      this.element.querySelector('use').setAttribute('href',`./assets/sprite.svg#${emote}`)
  }
}
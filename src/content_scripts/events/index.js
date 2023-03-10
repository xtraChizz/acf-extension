import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents, { EVENTS } from './common.events'
import { WindowCommandEvents } from './window-command.events'
import { AttributeEvents } from './attribute.events'
import { ClassEvents } from './class-list.events'
import { CopyEvents } from './copy.events'
import { PasteEvents } from './paste.events'
import { FuncEvents } from './func.events'
import { ReplaceEvents } from './replace.events'
import { AppendEvents } from './append.events'
import { PrependEvents } from './prepend.events'
import { ScrollToEvents } from './scroll-to.events'
import { MouseEvents } from './mouse.events'
import { TouchEvents } from './touch.events'
import { FormEvents } from './form.events'
import { KeyEvents } from './key.events'
import { LocationCommandEvents } from './location-command.events'
import { PlainEvents } from './plain.events'
import { KeyboardEvents } from './keyboard.events'

const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click']

const Events = (() => {
  const check = async (value, elements) => {
    if (value) {
      let event = /^(\w+)::/.exec(value)
      if (event) {
        event = event[1].toLowerCase()
      }
      switch (event) {
        case EVENTS.SCROLL_TO:
          ScrollToEvents.start(elements, value)
          break
        case EVENTS.MOUSE_EVENTS:
        case EVENTS.CLICK_EVENTS:
          MouseEvents.start(elements, value)
          break
        case EVENTS.TOUCH_EVENTS:
          TouchEvents.start(elements, value)
          break
        case EVENTS.FORM_EVENTS:
          FormEvents.start(elements, value)
          break
        case EVENTS.KEY_EVENTS:
          KeyEvents.start(elements, value)
          break
        case EVENTS.ATTR:
          AttributeEvents.start(elements, value)
          break
        case EVENTS.CLASS:
          ClassEvents.start(elements, value)
          break
        case EVENTS.COPY:
          CopyEvents.start(elements, value)
          break
        case EVENTS.PASTE:
          PasteEvents.start(elements, value)
          break
        case EVENTS.WINDOW_COMMAND:
          WindowCommandEvents.start(value)
          break
        case EVENTS.LOCATION_COMMAND:
          LocationCommandEvents.start(value)
          break
        case EVENTS.FUNC:
          FuncEvents.start(value)
          break
        case EVENTS.REPLACE:
          ReplaceEvents.start(elements, value)
          break
        case EVENTS.APPEND:
          AppendEvents.start(elements, value)
          break
        case EVENTS.PREPEND:
          PrependEvents.start(elements, value)
          break
        case EVENTS.KEYBOARD_EVENTS:
          KeyboardEvents.start(elements, value)
          break
        default:
          PlainEvents.start(elements, value)
      }
    } else {
      Logger.colorDebug('Default Click Events')
      elements.forEach(element => {
        DEFAULT_EVENT.forEach(event => {
          element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
        })
      })
    }
  }

  return { check }
})()

export default Events

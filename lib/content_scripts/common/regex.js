"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RADIO_CHECKBOX_NODENAME = exports.SELECT_TEXTAREA_NODENAME = exports.FORM_CLEAR_ELEMENT_NODENAME = exports.FORM_ELEMENT_NODENAME = void 0;
const FORM_ELEMENT_NODENAME = /^(select|textarea|input|button|label|option|optgroup|fieldset|output)$/gi;
exports.FORM_ELEMENT_NODENAME = FORM_ELEMENT_NODENAME;
const FORM_CLEAR_ELEMENT_NODENAME = /^(select|textarea|input)$/gi;
exports.FORM_CLEAR_ELEMENT_NODENAME = FORM_CLEAR_ELEMENT_NODENAME;
const SELECT_TEXTAREA_NODENAME = /^(select|textarea)$/gi;
exports.SELECT_TEXTAREA_NODENAME = SELECT_TEXTAREA_NODENAME;
const RADIO_CHECKBOX_NODENAME = /^(radio|checkbox)$/gi;
exports.RADIO_CHECKBOX_NODENAME = RADIO_CHECKBOX_NODENAME;
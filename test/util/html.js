const getProps = args =>
  Object.entries(args)
    .map(([key, value]) => `${key}='${value}' `)
    .join('')
export const getInput = ({ type = 'text', className = '', ...args } = {}) => `<input type='${type}'  class='${className}' ${getProps(args)} />`
export const getInputs = (n, props) => [...Array(n).keys()].map(id => getInput({ id, ...props })).join('')
export const getTextarea = ({ className = '', value = '', ...args } = {}) => `<textarea   class='${className}' ${getProps(args)} >${value}</textarea>`
export const getEditableDiv = ({ innerHTML = '', ...args } = {}) => `<div contenteditable="true" ${getProps(args)}>${innerHTML}</div>`

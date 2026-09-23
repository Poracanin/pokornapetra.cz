// Keep the editable amount readable without changing its numeric meaning.
export function parseAmount(value) {
  const digits = String(value).replace(/\s/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : NaN;
}

export function formatAmount(value) {
  const digits = String(value).replace(/\s/g, '');
  if (!/^\d+$/.test(digits)) return String(value);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatAmountField(input) {
  const previous = input.value;
  const next = formatAmount(previous);
  if (previous === next) return;
  const focused = input.ownerDocument.activeElement === input;
  const start = input.selectionStart, end = input.selectionEnd;
  const direction = input.selectionDirection;
  const position = caret => {
    const count = previous.slice(0, caret).replace(/\s/g, '').length;
    let seen = 0;
    if (!count) return 0;
    for (let i = 0; i < next.length; i++) {
      if (/\d/.test(next[i]) && ++seen === count) return i + 1;
    }
    return next.length;
  };
  input.value = next;
  if (focused && start !== null) input.setSelectionRange(position(start), position(end), direction);
}

export function bindAmountEditing(input) {
  // Backspace/Delete at a group separator removes the adjacent digit in one press.
  input.addEventListener('beforeinput', event => {
    const start = input.selectionStart, end = input.selectionEnd;
    if (start === null || start !== end) return;
    if (event.inputType === 'deleteContentBackward' && start > 1 && /\s/.test(input.value[start - 1])) {
      input.setSelectionRange(start - 2, start);
    } else if (event.inputType === 'deleteContentForward' && /\s/.test(input.value[start] || '') && start + 1 < input.value.length) {
      input.setSelectionRange(start, start + 2);
    }
  });
  formatAmountField(input);
}

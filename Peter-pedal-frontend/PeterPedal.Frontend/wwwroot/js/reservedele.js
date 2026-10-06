import { get, post, put, del } from './rest.js';

const rows = document.getElementById('part-rows');
const form = document.getElementById('part-form');
const formTitle = document.getElementById('form-title');
const idField = document.getElementById('part-id');
const nameField = document.getElementById('name');
const priceField = document.getElementById('price');
const cancelButton = document.getElementById('cancel-edit');
const message = document.getElementById('message');

const formatPrice = (price) =>
  new Intl.NumberFormat('da-DK', { minimumFractionDigits: 2 }).format(price) + ' kr';

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'message error' : 'message';
  message.hidden = false;
}

// Builds a <td> with plain text (textContent, never innerHTML).
function cell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

function button(text, className, onClick) {
  const b = document.createElement('button');
  b.textContent = text;
  b.className = className;
  b.addEventListener('click', onClick);
  return b;
}

async function loadParts() {
  const parts = await get('/api/spareparts');
  rows.replaceChildren(...parts.map(toRow));
}

function toRow(part) {
  const row = document.createElement('tr');
  const actions = document.createElement('td');
  actions.append(
    button('Rediger', 'secondary', () => run(() => startEdit(part.id))),
    ' ',
    button('Slet', 'danger', () => run(() => remove(part.id))),
  );
  row.append(cell(part.name), cell(formatPrice(part.price)), actions);
  return row;
}

// GET /api/spareparts/{id} and fill the form with the answer.
async function startEdit(id) {
  // TODO: GET /api/spareparts/{id} with get() from rest.js.
  idField.value = part.id;
  nameField.value = part.name;
  priceField.value = part.price;
  formTitle.textContent = 'Rediger reservedel';
  cancelButton.hidden = false;
}

function resetForm() {
  form.reset();
  idField.value = '';
  formTitle.textContent = 'Ny reservedel';
  cancelButton.hidden = true;
}

async function remove(id) {
  // TODO: DELETE /api/spareparts/{id} with del() from rest.js.
  showMessage('Reservedelen er slettet.');
  await loadParts();
}

// Same form for create (POST) and edit (PUT): a filled hidden id means edit.
async function save() {
  const body = { name: nameField.value, price: Number(priceField.value) };
  if (idField.value) {
    // TODO: PUT /api/spareparts/{id} with the body, using put() from rest.js.
    showMessage('Reservedelen er opdateret.');
  } else {
    // TODO: POST /api/spareparts with the body, using post() from rest.js.
    showMessage('Reservedelen er oprettet.');
  }
  resetForm();
  await loadParts();
}

// Runs an action and shows any error in the message line.
async function run(action) {
  try {
    await action();
  } catch (error) {
    showMessage(error.message, true);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  run(save);
});
cancelButton.addEventListener('click', resetForm);
run(loadParts);

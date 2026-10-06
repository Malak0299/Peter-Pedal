import { get, post, put, del } from './rest.js';

const rows = document.getElementById('customer-rows');
const form = document.getElementById('customer-form');
const formTitle = document.getElementById('form-title');
const idField = document.getElementById('customer-id');
const firstNameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const phoneField = document.getElementById('phone');
const cancelButton = document.getElementById('cancel-edit');
const message = document.getElementById('message');

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

async function loadCustomers() {
  const customers = await get('/api/customers');
  rows.replaceChildren(...customers.map(toRow));
}

function toRow(customer) {
  const row = document.createElement('tr');
  const actions = document.createElement('td');
  actions.append(
    button('Rediger', 'secondary', () => run(() => startEdit(customer.id))),
    ' ',
    button('Slet', 'danger', () => run(() => remove(customer.id))),
  );
  row.append(cell(customer.firstName), cell(customer.lastName), cell(customer.phone), actions);
  return row;
}

// GET /api/customers/{id} and fill the form with the answer.
async function startEdit(id) {
  const customer = await get(`/api/customers/${id}`);
  idField.value = customer.id;
  firstNameField.value = customer.firstName;
  lastNameField.value = customer.lastName;
  phoneField.value = customer.phone;
  formTitle.textContent = 'Rediger kunde';
  cancelButton.hidden = false;
}

function resetForm() {
  form.reset();
  idField.value = '';
  formTitle.textContent = 'Ny kunde';
  cancelButton.hidden = true;
}

async function remove(id) {
  await del(`/api/customers/${id}`);
  showMessage('Kunden er slettet.');
  await loadCustomers();
}

// Same form for create (POST) and edit (PUT): a filled hidden id means edit.
async function save() {
  const body = { firstName: firstNameField.value, lastName: lastNameField.value, phone: phoneField.value };
  if (idField.value) {
    await put(`/api/customers/${idField.value}`, body);
    showMessage('Kunden er opdateret.');
  } else {
    await post('/api/customers', body);
    showMessage('Kunden er oprettet.');
  }
  resetForm();
  await loadCustomers();
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
run(loadCustomers);

import { get } from './rest.js';
import { gql } from './graphql.js';

// Danish labels for the GraphQL CaseStatus enum values.
const STATUS_LABELS = {
  CREATED: 'Oprettet',
  AWAITING_APPROVAL: 'Afventer godkendelse',
  APPROVED: 'Godkendt',
  FINISHED: 'Afsluttet',
  PAID: 'Betalt',
};

// The fields we ask for in every query and mutation.
const CASE_FIELDS = `id frameNumber problem status price
  customer { firstName lastName } parts { id name }`;

const $ = (id) => document.getElementById(id);
let selectedId = null; // id of the case shown in the detail section

const formatPrice = (price) =>
  price === null ? '–' : new Intl.NumberFormat('da-DK', { minimumFractionDigits: 2 }).format(price) + ' kr';

function showMessage(text, isError = false) {
  $('message').textContent = text;
  $('message').className = isError ? 'message error' : 'message';
  $('message').hidden = false;
}

// Fills a <select> with { value, text } options.
function fillSelect(select, items) {
  select.replaceChildren(...items.map(({ value, text }) => new Option(text, value)));
}

// ---- Table of cases ----

async function loadCases() {
  const data = await gql(`{ repairCases { ${CASE_FIELDS} } }`);
  $('case-rows').replaceChildren(...data.repairCases.map(toRow));
}

function toRow(repairCase) {
  const row = document.createElement('tr');
  const customer = `${repairCase.customer.firstName} ${repairCase.customer.lastName}`;
  for (const text of [repairCase.frameNumber, customer, STATUS_LABELS[repairCase.status], formatPrice(repairCase.price)]) {
    const td = document.createElement('td');
    td.textContent = text;
    row.append(td);
  }
  row.style.cursor = 'pointer';
  row.addEventListener('click', () => run(() => selectCase(repairCase.id)));
  return row;
}

// ---- Detail section ----

async function selectCase(id) {
  const data = await gql(`query($id: Int!) { repairCase(id: $id) { ${CASE_FIELDS} } }`, { id });
  showDetail(data.repairCase);
}

function showDetail(repairCase) {
  selectedId = repairCase.id;
  $('detail-title').textContent = repairCase.frameNumber;
  $('detail-customer').textContent = `${repairCase.customer.firstName} ${repairCase.customer.lastName}`;
  $('detail-problem').textContent = repairCase.problem;
  $('detail-status').textContent = STATUS_LABELS[repairCase.status];
  $('detail-price').textContent = formatPrice(repairCase.price);
  $('detail-parts').replaceChildren(...repairCase.parts.map((part) => {
    const li = document.createElement('li');
    li.textContent = part.name;
    return li;
  }));
  $('status-select').value = repairCase.status;
  $('detail').hidden = false;
}

// Runs a mutation on the selected case, then shows the returned case and reloads the table.
async function changeCase(field, mutation, variables, successText) {
  const data = await gql(mutation, { caseId: selectedId, ...variables });
  showDetail(data[field]);
  showMessage(successText);
  await loadCases();
}

const addPart = () => changeCase('addPart',
  `mutation($caseId: Int!, $partId: Int!) { addPart(caseId: $caseId, partId: $partId) { ${CASE_FIELDS} } }`,
  { partId: Number($('part-select').value) }, 'Reservedelen er tilføjet.');

const calculateOffer = () => changeCase('calculateOffer',
  `mutation($caseId: Int!) { calculateOffer(caseId: $caseId) { ${CASE_FIELDS} } }`,
  {}, 'Tilbuddet er beregnet.');

const saveStatus = () => changeCase('setStatus',
  `mutation($caseId: Int!, $status: CaseStatus!) { setStatus(caseId: $caseId, status: $status) { ${CASE_FIELDS} } }`,
  { status: $('status-select').value }, 'Status er gemt.');

async function deleteCase() {
  await gql('mutation($caseId: Int!) { deleteCase(caseId: $caseId) }', { caseId: selectedId });
  $('detail').hidden = true;
  showMessage('Sagen er slettet.');
  await loadCases();
}

// ---- New case form ----

async function createCase() {
  const data = await gql(
    `mutation($customerId: Int!, $frameNumber: String!, $problem: String!) {
      createCase(customerId: $customerId, frameNumber: $frameNumber, problem: $problem) { ${CASE_FIELDS} }
    }`,
    { customerId: Number($('customer').value), frameNumber: $('frame-number').value, problem: $('problem').value });
  $('case-form').reset();
  showDetail(data.createCase);
  showMessage('Sagen er oprettet.');
  await loadCases();
}

// ---- Start-up ----

// Runs an action and shows any error in the message line.
async function run(action) {
  try {
    await action();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function start() {
  // Dropdowns are filled from the REST API; the cases come from GraphQL.
  const customers = await get('/api/customers');
  fillSelect($('customer'), customers.map((c) => ({ value: c.id, text: `${c.firstName} ${c.lastName}` })));
  const parts = await get('/api/spareparts');
  fillSelect($('part-select'), parts.map((p) => ({ value: p.id, text: p.name })));
  fillSelect($('status-select'), Object.entries(STATUS_LABELS).map(([value, text]) => ({ value, text })));
  await loadCases();
}

$('case-form').addEventListener('submit', (event) => {
  event.preventDefault();
  run(createCase);
});
$('add-part').addEventListener('click', () => run(addPart));
$('calculate').addEventListener('click', () => run(calculateOffer));
$('save-status').addEventListener('click', () => run(saveStatus));
$('delete-case').addEventListener('click', () => run(deleteCase));
run(start);

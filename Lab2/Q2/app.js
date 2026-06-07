const apiBase = 'http://localhost:5050';
let currentTransaction = null;

const $ = id => document.getElementById(id);

function log(msg, kind = '') 
{
  const div = document.createElement('div');
  div.className = `log-line ${kind}`.trim();
  div.textContent = msg;
  $('stepLog').appendChild(div);
  $('stepLog').scrollTop = $('stepLog').scrollHeight;
  $('statusLine').textContent = msg;
}

function setResult(text, ok = true) 
{
  const el = $('result');
  el.textContent = text;
  el.className = `result ${ok ? 'success' : 'error'}`;
}

function resetForm() 
{
  ['customerName','customerEmail','productName','productQuantity','shippingAddress','cardNumber','cardExpiry','cardCvv']
    .forEach(id => $(id).value = id === 'productQuantity' ? '1' : '');
  $('stepLog').innerHTML = '';
  $('statusLine').textContent = 'Waiting to start...';
  setResult('', true);
  currentTransaction = null;
}

function collectOrderData() 
{
  const data = {
    name: $('customerName').value.trim(),
    email: $('customerEmail').value.trim(),
    product: $('productName').value.trim(),
    quantity: Number($('productQuantity').value),
    shippingAddress: $('shippingAddress').value.trim(),
    cardNumber: $('cardNumber').value.trim(),
    cardExpiry: $('cardExpiry').value.trim(),
    cardCvv: $('cardCvv').value.trim()
  };
  if (!data.name || !data.email || !data.product || data.quantity < 1 || !data.shippingAddress || !data.cardNumber || !data.cardExpiry || !data.cardCvv) {
    throw new Error('Please fill all fields');
  }
  return data;
}

async function startPayment() 
{
  $('startButton').disabled = true; $('resetButton').disabled = true; $('stepLog').innerHTML = ''; setResult('', true);
  try {
    const order = collectOrderData();
    await step1(order);
    await step2();
    await step3();
    await step4();
    await stepExternal('step5','Payment Integration Completed');
    await stepExternal('step6','Bank Payment Authorized');
    await stepExternal('step7','Delivery Order Issued');
    await stepExternal('step8','Customer has been notified');
    await step9();
    log('Step 10: Transaction completed successfully', 'success');
    setResult('Order completed and committed successfully.', true);
  } catch (err) {
    await rollback(err);
    setResult(err.message || 'Error', false);
  } finally {
    $('startButton').disabled = false; $('resetButton').disabled = false;
  }
}

async function step1(order) 
{ 
    log('Step 1: Transaction started'); currentTransaction = { order, status: 'started' }; 
}

async function step2() 
{ 
    log('Step 2: Collected shopping items, shipping address, and customer info'); 
}
async function step3() 
{ 
    const unit = 29.99, ship = 9.99; const q = currentTransaction.order.quantity; 
    currentTransaction.orderTotal = Number(((q*unit)+ship).toFixed(2)); 
    log(`Step 3: Order price calculated ($${currentTransaction.orderTotal} total)`); 
}
async function step4() 
{ 
    const stock = 10, 
    q = currentTransaction.order.quantity; 
    if (q>stock) throw new Error('Inventory update failed'); 
    currentTransaction.updatedStock = stock - q; 
    log(`Step 4: Inventory updated (remaining stock: ${currentTransaction.updatedStock})`); 
}

async function stepExternal(endpoint, expect) 
{
  log(`Requesting external service: ${endpoint}`);
  const res = await fetch(`${apiBase}/${endpoint}`);
  if (!res.ok) throw new Error(`External service error ${res.status}`);
  const data = await res.json();
  if (data.status !== expect) throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
  log(`${endpoint.replace('step','Step ')}: ${data.status}`);
}

async function step9() 
{ 
    currentTransaction.status = 'committed'; 
    log('Step 9: Transaction committed'); 
}
async function rollback(err) 
{ 
    log(`Step 10: Transaction rolled back because: ${err.message}`, 'error'); 
    currentTransaction = { status: 'rolled back', error: err.message }; 
}

// expose to global (used by HTML)
window.startPayment = startPayment;
window.resetForm = resetForm;

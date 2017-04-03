/**
 * https://www.cs.drexel.edu/~introcs/Fa12/notes/10.1_Cryptography/RSAWorksheetv4d.html
 */

var d = document.getElementById('d-input');
var e = document.getElementById('e-input');
var k = document.getElementById('k-input');
var n = document.getElementById('n-input');
var p = document.getElementById('p-input');
var q = document.getElementById('q-input');
var z = document.getElementById('z-input');

function clearMessages(node) {
  for (var i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].className != undefined &&
        node.childNodes[i].className.includes('form-control-feedback')) {
      var notes = node.childNodes[i];
      node.className = node.className.replace('has-danger', '');
      node.className = node.className.replace('has-warning', '');
      notes.innerHTML = '';
    }        
  }
}

function errorMessage(formNode, message) {
  sendMessage(formNode, message, "has-danger");
}

function warningMessage(formNode, message) {
  sendMessage(formNode, message, "has-warning")
}

function successMessage(formNode, message) {
  sendMessage(formNode, message, "has-success")
}

function sendMessage(formNode, message, warningType) {
  for (var i = 0; i < formNode.childNodes.length; i++) {
    if (formNode.childNodes[i].className != undefined &&
        formNode.childNodes[i].className.includes("form-control-feedback")) {
      var notes = formNode.childNodes[i];
      if (!formNode.className.includes(warningType)) {
        formNode.className += " " + warningType;
      }
      notes.innerHTML += message + '<br />';
    }        
  }
}

d.oninput = function() {
  clearMessages(document.getElementById('d-form'));
  clearMessages(document.getElementById('ed-form'));
}
e.oninput = function() {
  clearMessages(document.getElementById('e-form'));
  clearMessages(document.getElementById('ed-form'));
}
p.oninput = function() {
  clearMessages(document.getElementById('p-form'));
  clearMessages(document.getElementById('pq-form'));
}
q.oninput = function() {
  clearMessages(document.getElementById('q-form'));
  clearMessages(document.getElementById('pq-form'));
}

var pqButton = document.getElementById('pq-button');
pqButton.onclick = function(event) {
  var parentForm = document.getElementById('pq-form');
  var pForm = document.getElementById('p-form');
  var qForm = document.getElementById('q-form');
  var isValidState = true;
  clearMessages(parentForm);
  clearMessages(pForm);
  clearMessages(qForm);

  if (p.value == "") {
    errorMessage(pForm, "No value for P.");
    isValidState = false;
  }
  if (q.value == "") {
    errorMessage(qForm, "No value for Q.");
    isValidState = false;
  }
  if (!isPrime(p.value)) {
    errorMessage(pForm, "P must be prime.");
    isValidState = false;
  }
  if (!isPrime(q.value)) {
    errorMessage(qForm, "Q must be prime.");
    isValidState = false;
  }
  if (p.value == q.value) {
    errorMessage(qForm, "P cannot equal Q.");
    isValidState = false;
  }

  if (!isValidState) {
    return;
  }
  // Generate N
  n.value = p.value * q.value;
  // Generate Z
  z.value = (p.value - 1) * (q.value - 1);

  successMessage(pForm, 'P is prime.');
  successMessage(qForm, 'Q is prime.');

  // Will override the success border
  if (n.value < 255) {
    warningMessage(parentForm, "Warning: N < 255, so some ASCII encoding will not work.");
  }
  if ( (n.value ** 2) > Number.MAX_SAFE_INTEGER) {
    warningMessage(parentForm, "Warning: N > sqrt(" + Number.MAX_SAFE_INTEGER + "), so some calculations may overflow.");
  }


  // Generate candidates for e*d % z = 1
  generateCandidates();
}

function generateCandidates() {
  var modTextArea = document.getElementById('mod-candidates');
  modTextArea.value = "";
  var valid = [];
  for (var i = 2; valid.length < 30; i++) {
    if (i % z.value == 1) {
      valid.push(i);
    }
  }

  for (var k = 0; k < valid.length; k++) {
    modTextArea.value = modTextArea.value + valid[k] + " ";
  }
}

var factorButton = document.getElementById('factors-button');
factorButton.onclick = function(event) {
  var factors = factor(k.value);
  var result = "";
  for (var i = 0; i < factors.length; i++) {
    result += factors[i] + ", ";
  }
  result = result.substr(0, result.length - 2)
  document.getElementById('factors-input').value = result;
}

function factor(k) {
  // return an array of factors of k
  var factors = [];
  for (var i = 2; i <= k; i++) {
    if (k % i == 0) {
      factors.push(i);
      console.log('found', i, 'as a factor of', k);
    }
  }
  
  return factors;
}

var edButton = document.getElementById('ed-button');
edButton.onclick = function(event) {
  var parentForm = document.getElementById('ed-form');
  var eForm = document.getElementById('e-form');
  var dForm = document.getElementById('d-form');
  var isValidState = true;
  clearMessages(parentForm);
  clearMessages(eForm);
  clearMessages(dForm);

  if (e.value == "") {
    errorMessage(eForm, "No value for E.");
    isValidState = false;
  }
  if (d.value == "") {
    errorMessage(dForm, "No value for D.");
    isValidState = false;
  }

  var eFactors = factor(e.value);
  var dFactors = factor(d.value);

  /*
   * Check if e and d have any similar factors.
  */
  var filtered = [];
  for (var i = 0; i < eFactors.length; i++) {
    if (dFactors.indexOf(eFactors[i]) >= 0) {
      filtered.push(eFactors[i]);
    }
  }
  if (filtered.length > 0) {
    errorMessage(parentForm, 'E and D are not relatively prime.');
    isValidState = false;
  }
  if ( (e.value * d.value) % z.value != 1) {
    errorMessage(parentForm, '(E*D) mod Z != 1');
    isValidState = false;
  }

  if (!isValidState) return;

  successMessage(eForm, 'E is relatively prime to Z.')
  successMessage(dForm, 'D is relatively prime to Z.')
}

var plainTextButton = document.getElementById('msg-plaintext-btn');
plainTextButton.onclick = function(event) {
  var plainTextArea = document.getElementById('msg-plaintext');
  var asciiTextArea = document.getElementById('msg-ascii');
  var ascii = asciiEncode(plainTextArea.value);
  var result = "";
  for (var i = 0; i < ascii.length; i++) {
    result += ascii[i] + " ";
  }
  asciiTextArea.value = result;
  var encoded = encryptText(ascii);
  decryptText(encoded);
}

function isPrime(num) {
  if (num == '') return false;
  var stop = Math.sqrt(num);
  for(var i = 2; i < stop; i++)
    if(num % i === 0) return false;
  return num !== 1;
}

function asciiEncode(text) {
  var chars = [];
  for (let i = 0; i < text.length; i++) {
    var ch = "" + text.charCodeAt(i);
    chars.push(ch);
  }
  return chars;
}

function powerMod(base, exp, mod) {
  if ((base < 1) || (exp < 0) || (mod < 1)) {
    return(-1);
  }
  result = 1;
  while (exp > 0) {
    if ((exp % 2) == 1) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return result;
}

function encryptText(ascii) {
  var encodedTextArea = document.getElementById('msg-encoded');
  var result = "";
  var encoded = [];
  ascii.forEach((ch) => {
    encoded.push(powerMod(ch, e.value, n.value));
    result += powerMod(ch, e.value, n.value) + " ";
  })
  encodedTextArea.value = result;
  return encoded;
}

function decryptText(arr) {
  clearMessages(document.getElementById('decrypted-form'));
  var decryptedTextArea = document.getElementById('msg-decrypted');
  var result = "";
  arr.forEach((ch) => {
    result += String.fromCharCode(powerMod(ch, d.value, n.value));
  })
  decryptedTextArea.value = result;

  // Check the result
  var plainTextArea = document.getElementById('msg-plaintext');
  if (plainTextArea.value != decryptedTextArea.value) {
    errorMessage(document.getElementById('decrypted-form'), 'Decrpted message does not match original.');
  } else {
    successMessage(document.getElementById('decrypted-form'), 'The decrypted message matches the original.');
  }
}
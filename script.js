var d = document.getElementById('d-input');
var e = document.getElementById('e-input');
var k = document.getElementById('k-input');
var n = document.getElementById('n-input');
var p = document.getElementById('p-input');
var q = document.getElementById('q-input');
var z = document.getElementById('z-input');

/* temp */
p.value = 1423;
q.value = 1361;
n.value = 1936703;
z.value = 1933920;
e.value = 7;
d.value = 828823;
document.getElementById('msg-plaintext').value = "hello hello hello";

/**
 * Generate the valid candidates that fulfil i % z == 1.
 * This should provide 30 values (avoid an overflow).
 * @param {Number} z - The number z in the equation.
 */
function generateCandidates(z) {
  var valid = [];
  for (var i = 2; valid.length < 30 && i < Number.MAX_SAFE_INTEGER; i++) {
    if (i % z == 1) {
      valid.push(i);
    }
  }
  return valid;
}

/**
 * Return an array of the factors of k, including k but not
 * 1. Since we use factor() to check if two elements are relatively
 * prime, including 1 will make every number not relatively prime.
 * @param {Number} k - The number to factor.
 */
function factor(k) {
  var factors = [];
  for (var i = 2; i <= k; i++) {
    if (k % i == 0) {
      factors.push(i);
    }
  }
  return factors;
}

/**
 * Compute if the given number is prime or not.
 * @param {Number} num - The number to check.
 * @returns {Boolean} 
 */
function isPrime(num) {
  if (num == '') return false;
  var stop = Math.sqrt(num);
  for(var i = 2; i < stop; i++)
    if(num % i === 0) return false;
  return num !== 1;
}

/**
 * Take a string of input and turn it into an array of ASCII
 * numbers representing each character.
 * @param {String} text - The input string.
 * @returns {string[]} The output array of ASCII values.
 */
function asciiEncode(text) {
  var chars = [];
  for (let i = 0; i < text.length; i++) {
    var ch = '' + text.charCodeAt(i);
    ch = ('000'+ch).substring(ch.length);
    chars.push(ch);
  }
  return chars;
}

/**
 * Compute (base^exp) % mod. Since base and exp are all relatively large
 * values, care must be taken to avoid an overflow.
 * @param {Number} base - The base of the exponent.
 * @param {Number} exp - The power of the exponent.
 * @param {Number} mod - The modulus to take.
 * @returns {Number} The result of the operation.
 */
function powerMod(base, exp, mod) {
  if ((base < 1) || (exp < 0) || (mod < 1)) {
    return -1;
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

function pad(value, length) {
    return (value.toString().length < length) ? pad("0"+value, length) : value;
}

/**
 * Take an array of ASCII values and encode them using RSA. Split the ASCII
 * string into lengths of size n, then encrypt that string.
 * @param {string[]} ascii - The ASCII value array.
 * @returns {string[]} The encoded ASCII array.
 */
function encryptText(ascii) {
  var encodedTextArea = document.getElementById('msg-encoded');
  // merge the ascii into one string and split it into strings of length n.length
  var encodedStr = ascii.join('');
  var encoded = [];
  for (var i = 0; i < encodedStr.length; i += n.value.length-1) {
    encoded.push(encodedStr.substring(i, i + n.value.length-1));
  }
  console.log('merged ascii', encoded);
  encoded = encoded.map((s) => {
    console.log(powerMod(s, e.value, n.value), n.value.length-1);
    console.log('n.length = ', n.value.length-1);
    return '' + pad(powerMod(s, e.value, n.value), n.value.length-1);
  })
  encodedTextArea.value = encoded.join('');
  return encoded;
}

/**
 * Decrypt the passed-in ASCII numbers and return a string from the
 * decoded ASCII.
 * @param {int[]} arr - The array of encrypted ASCII numbers to decrypt.
 * @returns {String} The decoded string
 */
function decryptText(arr) {
  clearMessages(document.getElementById('decrypted-form'));
  console.log('encoded:', arr);
  var decoded = [];

  // decode each element of the encrypted array
  var lastEncoded = arr[arr.length-1];
  arr.forEach(el => {
    console.log(pad(powerMod(el, d.value, n.value), n.value.length-1))
    decoded.push(pad(powerMod(el, d.value, n.value), n.value.length-1));
  })
  
  // the last element can be less than n.length, so it shouldn't be padded
  decoded[decoded.length-1] = powerMod(lastEncoded, d.value, n.value);
  console.log('decoded:', decoded);

  // turn the decoded chunks into one string and split it into size 3
  decodedStr = decoded.join('');
  var ascii = [];
  for (var i = 0; i < decodedStr.length; i += 3) {
    var sub = decodedStr.substring(i, i + 3);
    var char = String.fromCharCode(sub);
    console.log('sub:', sub, 'char:', char);
    ascii.push(char);
  }

  console.log('mapped ascii:', ascii);
  return ascii.join('');
}

function generateRandomPrime(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  var rand = Math.floor(Math.random() * (max - min + 1)) + min;

  while (rand <= max) {
    if (isPrime(rand)) {
      return rand;
    } else if (rand == max) {
      rand = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      rand++;
    }
  }
}

/**
 * When the various inputs change, the validation states should
 * be cleared until rechecked with their corresponding button.
 */
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

/**
 * Clear a node and its children from displaying a validation state (either
 * success, warning, or error), as well as messages it was displaying.
 * @param {HTMLElement} node - The DOM node to clear messages from.
 */
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

/**
 * Send an error message to a DOM node.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The message to display.
 */
function errorMessage(formNode, message) {
  sendMessage(formNode, message, "has-danger");
}

/**
 * Send a warning message to a DOM node.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The message to display.
 */
function warningMessage(formNode, message) {
  sendMessage(formNode, message, "has-warning")
}

/**
 * Send a success message to a DOM node.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The message to display.
 */
function successMessage(formNode, message) {
  sendMessage(formNode, message, "has-success")
}

/**
 * Add a validation status message to an element. The element must have a child
 * with the 'form-control-feedback' class to properly display using Bootstrap.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The validation message to display.
 * @param {String} messageType - The type of message to display: 
 *                               'has-success', 'has-warning', 'has-danger'.
 */
function sendMessage(formNode, message, messageType) {
  for (var i = 0; i < formNode.childNodes.length; i++) {
    if (formNode.childNodes[i].className != undefined &&
        formNode.childNodes[i].className.includes("form-control-feedback")) {
      var notes = formNode.childNodes[i];
      if (!formNode.className.includes(messageType)) {
        formNode.className += " " + messageType;
      }
      notes.innerHTML += message + '<br />';
    }        
  }
}


var pRandButton = document.getElementById('p-random');
pRandButton.onclick = function() {
  p.value = generateRandomPrime(1000, 5000);
}
var qRandButton = document.getElementById('q-random');
qRandButton.onclick = function() {
  q.value = generateRandomPrime(1000, 5000);
}

/**
 * Check the input values for P and Q and see if they are valid.
 * P and Q both need to be prime, cannot equal each other, and the
 * result should be both larger than 255 to display all ASCII properly
 * and smaller than MAX_SAFE_INTEGER to avoid overflow.
 */
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

  // Will override the success border, but leave the success message.
  if (n.value < 255) {
    warningMessage(parentForm, "Warning: N < 255, so some ASCII encoding will not work.");
  }
  if ( (n.value * n.value) > Number.MAX_SAFE_INTEGER) {
    warningMessage(parentForm, "Warning: N > sqrt(" + Number.MAX_SAFE_INTEGER + "), so some calculations may overflow.");
  }

  // Generate candidates for e*d % z = 1
  var valid = generateCandidates(z.value);
  var modTextArea = document.getElementById('mod-candidates');
  modTextArea.value = "";
  for (var k = 0; k < valid.length; k++) {
    modTextArea.value = modTextArea.value + valid[k] + ", ";
  }
  modTextArea.value = modTextArea.value.substr(0, modTextArea.value.length-2);
}

/**
 * Factor K and display the results into a textarea.
 */
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

/**
 * Check if the values put into E and D are valid. They need to each
 * be relatively prime to Z, and still fulfil (E*D) mod Z = 1.
 */
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
  * Check if e and d have any similar factors by factoring them
  * and seeing if the returned arrays have any factors in common.
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
    errorMessage(parentForm, '\((E*D) \mod Z != 1\)');
    isValidState = false;
  }

  if (!isValidState) return;

  successMessage(eForm, 'E is relatively prime to Z.')
  successMessage(dForm, 'D is relatively prime to Z.')
}

/**
 * Get the input from the plaintext textarea and convert it. The ASCII
 * output is displayed in one box, the encrypted ASCII output is displayed
 * in another, and the decrypted plaintext (using the encrypted ASCII) is
 * displayed in a third box.
 */
var plainTextButton = document.getElementById('msg-plaintext-btn');
plainTextButton.onclick = function(event) {
  var plainTextArea = document.getElementById('msg-plaintext');
  var asciiTextArea = document.getElementById('msg-ascii');
  var decryptedTextArea = document.getElementById('msg-decrypted');
  var ascii = asciiEncode(plainTextArea.value);
  var result = "";
  for (var i = 0; i < ascii.length; i++) {
    result += ascii[i] + " ";
  }
  asciiTextArea.value = result;
  var encoded = encryptText(ascii);
  var decrypted = decryptText(encoded);
  decryptedTextArea.value = decrypted;

  // Check the result
  if (plainTextArea.value != decryptedTextArea.value) {
    errorMessage(document.getElementById('decrypted-form'), 'Decrpted message does not match original.');
  } else {
    successMessage(document.getElementById('decrypted-form'), 'The decrypted message matches the original.');
  }
}
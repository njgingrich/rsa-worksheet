var d = document.getElementById('d-input');
var e = document.getElementById('e-input');
var k = document.getElementById('k-input');
var n = document.getElementById('n-input');
var p = document.getElementById('p-input');
var q = document.getElementById('q-input');
var z = document.getElementById('z-input');

var pqButton = document.getElementById('pq-button');
pqButton.onclick = function(event) {
  if (p.value == "" || q.value == "") {
    alert('No value for P or Q');
  } else {
    if (!isPrime(p.value) || !isPrime(q.value)) {
      alert('P or Q is not prime');
    }
  }
}

var zButton = document.getElementById('z-button');
zButton.onclick = function(event) {
  z.value = (p.value - 1) * (q.value - 1);
}

var nButton = document.getElementById('n-button');
nButton.onclick = function(event) {
  n.value = p.value * q.value;
}

var candButton = document.getElementById('cand-button');
var modTextArea = document.getElementById('mod-candidates');
candButton.onclick = function(event) {
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
  result = result.substr(0, result.length - 3)

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
  var eFactors = factor(e.value);
  var dFactors = factor(d.value);

  var filtered = [];
  for (var i = 0; i < eFactors.length; i++) {
    if (dFactors.indexOf(eFactors[i]) >= 0) {
      filtered.push(eFactors[i]);
    }
  }

  if (filtered.length > 0) {
    alert('E and D are not relatively prime.');
  } else if ( (e.value * d.value) % z.value != 1) {
    alert('(E*D) mod Z != 1');
  } else {
    alert('E and D are relatively prime and (E * D) mod Z = 1.')
  }

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

function isPrime(i) {
  return true
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
  var decryptedTextArea = document.getElementById('msg-decrypted');
  var result = "";
  arr.forEach((ch) => {
    result += String.fromCharCode(powerMod(ch, d.value, n.value));
  })
  decryptedTextArea.value = result;
}
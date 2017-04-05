const d = document.getElementById('d-input')
const e = document.getElementById('e-input')
const k = document.getElementById('k-input')
const n = document.getElementById('n-input')
const p = document.getElementById('p-input')
const q = document.getElementById('q-input')
const z = document.getElementById('z-input')

//============================================================
// RSA Functions.
//============================================================

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
    return -1
  }
  let result = 1
  while (exp > 0) {
    if ((exp % 2) == 1) {
      result = (result * base) % mod
    }
    base = (base * base) % mod
    exp = Math.floor(exp / 2)
  }
  return result
}

/**
 * Take an array of ASCII values and encode them using RSA. Split the ASCII
 * string into lengths of size n, then encrypt that string.
 * @param {string[]} ascii - The ASCII value array.
 * @returns {string[]} The encoded ASCII array.
 */
function encryptText(ascii) {
  // merge the ascii into one string and split it into strings of length(n) - 1
  const encodedStr = ascii.join('')
  let encoded = []
  for (let i = 0; i < encodedStr.length; i += n.value.length - 1) {
    encoded.push(encodedStr.substring(i, i + n.value.length - 1))
  }

  // for each chunk, encrypt it using the formula encrypted = (chunk)^E mod N.
  // This should be implemented using the powerMod() function.
  encoded = encoded.map((s) => {
    return powerMod(s, e.value, n.value)
  })

  return encoded
}

/**
 * Decrypt the passed-in ASCII numbers and return a string from the
 * decoded ASCII.
 * @param {int[]} arr - The array of encrypted ASCII numbers to decrypt.
 * @returns {String} The decoded string
 */
function decryptText(arr) {
  const decoded = []

  // Decode each element of the encrypted array.
  // The last element may be less than length(n) - 1, so it's powerMod() should
  // be calculated separately.
  const lastEncoded = arr[arr.length - 1]
  arr.forEach(el => {
    decoded.push(pad(powerMod(el, d.value, n.value), n.value.length - 1))
  })
  // the last element can be less than n.length, so it shouldn't be padded
  decoded[decoded.length - 1] = powerMod(lastEncoded, d.value, n.value)

  // Turn the decoded chunks into one string and split it into size 3, and
  // convert it back into ASCII.
  const decodedStr = decoded.join('')
  const ascii = []
  for (let i = 0; i < decodedStr.length; i += 3) {
    const sub = decodedStr.substring(i, i + 3)
    const char = String.fromCharCode(sub)
    ascii.push(char)
  }

  return ascii.join('')
}

//============================================================
// Helper functions, utilities, and validation scripts.
//============================================================

/**
 * Left-pad a string with '0's to make it a certain length.
 * @param {String} value - The value to pad.
 * @param {Number} length - The desired length of the string.
 * @returns {String} The padded string.
 */
function pad(value, length) {
  return (value.toString().length < length) ? pad('0' + value, length) : value
}

/**
 * Generate the valid candidates that fulfil i % z == 1.
 * This should provide 30 values (avoid an overflow).
 * @param {Number} z - The number z in the equation.
 */
function generateCandidates(z) {
  const valid = []
  for (let i = 2; valid.length < 30 && i < Number.MAX_SAFE_INTEGER; i++) {
    if (i % z == 1) {
      valid.push(i)
    }
  }
  return valid
}

/**
 * Return an array of the factors of k, including k but not
 * 1. Since we use factor() to check if two elements are relatively
 * prime, including 1 will make every number not relatively prime.
 * @param {Number} k - The number to factor.
 */
function factor(k) {
  const factors = []
  for (let i = 2; i <= k; i++) {
    if (k % i == 0) {
      factors.push(i)
    }
  }
  return factors
}

/**
 * Compute if the given number is prime or not.
 * @param {Number} num - The number to check.
 * @returns {Boolean} 
 */
function isPrime(num) {
  if (num == '') {
    return false
  }
  const stop = Math.sqrt(num)
  for(var i = 2; i < stop; i++)
    if(num % i === 0) {
      return false
    }
  return num !== 1
}

/**
 * Take a string of input and turn it into an array of ASCII
 * numbers representing each character.
 * @param {String} text - The input string.
 * @returns {string[]} The output array of ASCII values.
 */
function asciiEncode(text) {
  const chars = []
  for (let i = 0; i < text.length; i++) {
    var ch = '' + text.charCodeAt(i)
    ch = ('000' + ch).substring(ch.length)
    chars.push(ch)
  }
  return chars
}

/**
 * Generate a random prime between min and max, inclusive.
 * @param {Number} min - The minimum value allowed.
 * @param {Number} max - The maximum value allowed.
 * @returns {Number}
 */
function generateRandomPrime(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  var rand = Math.floor(Math.random() * (max - min + 1)) + min

  while (rand <= max) {
    if (isPrime(rand)) {
      return rand
    } else if (rand == max) {
      rand = Math.floor(Math.random() * (max - min + 1)) + min
    } else {
      rand++
    }
  }
}

/* Temp data for testing. */
var debugText = document.getElementById('debug-data')
debugText.onclick = function() {
  p.value = 1423
  q.value = 1361
  n.value = 1936703
  z.value = 1933920
  e.value = 7
  d.value = 828823
  document.getElementById('msg-plaintext').value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quis nisi massa. Proin ut nisl nec orci rhoncus dapibus. Nam commodo justo eu aliquam consequat. Etiam ultrices nisl dolor, id sagittis leo lobortis vel. Nullam porta libero sit amet tellus porta congue. Quisque tempor dolor lectus, accumsan feugiat sapien eleifend eu. Phasellus sed fermentum lorem, sed sodales mi.'
  console.info('Debug data entered!')
}

/**
 * When the various inputs change, the validation states should
 * be cleared until rechecked with their corresponding button.
 */
d.oninput = () => {
  clearMessages(document.getElementById('d-form'))
  clearMessages(document.getElementById('ed-form'))
}
e.oninput = () => {
  clearMessages(document.getElementById('e-form'))
  clearMessages(document.getElementById('ed-form'))
}
p.oninput = () => {
  clearMessages(document.getElementById('p-form'))
  clearMessages(document.getElementById('pq-form'))
}
q.oninput = () => {
  clearMessages(document.getElementById('q-form'))
  clearMessages(document.getElementById('pq-form'))
}

/**
 * Clear a node and its children from displaying a validation state (either
 * success, warning, or error), as well as messages it was displaying.
 * @param {HTMLElement} node - The DOM node to clear messages from.
 */
function clearMessages(node) {
  for (let i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].className != undefined &&
        node.childNodes[i].className.includes('form-control-feedback')) {
      const notes = node.childNodes[i]
      node.className = node.className.replace('has-danger', '')
      node.className = node.className.replace('has-warning', '')
      notes.innerHTML = ''
    }        
  }
}

/**
 * Send an error message to a DOM node.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The message to display.
 */
function errorMessage(formNode, message) {
  sendMessage(formNode, message, 'has-danger')
}

/**
 * Send a warning message to a DOM node.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The message to display.
 */
function warningMessage(formNode, message) {
  sendMessage(formNode, message, 'has-warning')
}

/**
 * Send a success message to a DOM node.
 * @param {HTMLElement} formNode - The DOM Node to display the message inside.
 * @param {String} message - The message to display.
 */
function successMessage(formNode, message) {
  sendMessage(formNode, message, 'has-success')
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
  for (let i = 0; i < formNode.childNodes.length; i++) {
    if (formNode.childNodes[i].className != undefined &&
        formNode.childNodes[i].className.includes('form-control-feedback')) {
      const notes = formNode.childNodes[i]
      if (!formNode.className.includes(messageType)) {
        formNode.className += ' ' + messageType
      }
      notes.innerHTML += message + '<br />'
    }        
  }
}


const pRandButton = document.getElementById('p-random')
pRandButton.onclick = () => {
  p.value = generateRandomPrime(1000, 5000)
}
const qRandButton = document.getElementById('q-random')
qRandButton.onclick = () => {
  q.value = generateRandomPrime(1000, 5000)
}

/**
 * Check the input values for P and Q and see if they are valid.
 * P and Q both need to be prime, cannot equal each other, and the
 * result should be both larger than 255 to display all ASCII properly
 * and smaller than MAX_SAFE_INTEGER to avoid overflow.
 */
const pqButton = document.getElementById('pq-button')
pqButton.onclick = () => {
  pqButton.classList.add('active')
  document.getElementById('pq-spinner').style.display = 'inline'
  // We need to force the UI to update before it runs the calculations,
  // so setting a 15ms wait before the calculations runs allows the
  // ui to update first.
  setTimeout(() => {
    const parentForm = document.getElementById('pq-form')
    const pForm = document.getElementById('p-form')
    const qForm = document.getElementById('q-form')
    let isValidState = true
    clearMessages(parentForm)
    clearMessages(pForm)
    clearMessages(qForm)

    if (p.value == '') {
      errorMessage(pForm, 'No value for P.')
      isValidState = false
    }
    if (q.value == '') {
      errorMessage(qForm, 'No value for Q.')
      isValidState = false
    }
    if (!isPrime(p.value)) {
      errorMessage(pForm, 'P must be prime.')
      isValidState = false
    }
    if (!isPrime(q.value)) {
      errorMessage(qForm, 'Q must be prime.')
      isValidState = false
    }
    if (p.value == q.value) {
      errorMessage(qForm, 'P cannot equal Q.')
      isValidState = false
    }
    if (!isValidState) {
      return
    }

    // Generate N
    n.value = p.value * q.value
    // Generate Z
    z.value = (p.value - 1) * (q.value - 1)

    successMessage(pForm, 'P is prime.')
    successMessage(qForm, 'Q is prime.')

    // Will override the success border, but leave the success message.
    if (n.value < 255) {
      warningMessage(parentForm, 'Warning: N < 255, so some ASCII encoding will not work.')
    }
    if ( (n.value * n.value) > Number.MAX_SAFE_INTEGER) {
      warningMessage(parentForm, 'Warning: N > sqrt(" + Number.MAX_SAFE_INTEGER + "), so some calculations may overflow.')
    }

    // Generate candidates for e*d % z = 1
    const valid = generateCandidates(z.value)
    const modTextArea = document.getElementById('mod-candidates')
    modTextArea.value = valid.join(', ')
    /*
    modTextArea.value = ''
    for (let k = 0; k < valid.length; k++) {
      modTextArea.value = modTextArea.value + valid[k] + ', '
    }
    modTextArea.value = modTextArea.value.substr(0, modTextArea.value.length - 2)
    */

    pqButton.classList.remove('active')
    document.getElementById('pq-spinner').style.display = 'none'
  }, 30)
}

/**
 * Factor K and display the results into a textarea.
 */
const factorButton = document.getElementById('factors-button')
factorButton.onclick = () => {
  factorButton.classList.add('active')
  document.getElementById('factor-spinner').style.display = 'inline'
  setTimeout(() => {
    var factors = factor(k.value)
    /*
    var result = ''
    for (var i = 0; i < factors.length; i++) {
      result += factors[i] + ", "
    }
    result = result.substr(0, result.length - 2)
    document.getElementById('factors-input').value = result
    */
    document.getElementById('factors-input').value = factors.join(', ')
    document.getElementById('factor-spinner').style.display = 'none'
  }, 15)
}

/**
 * Check if the values put into E and D are valid. They need to each
 * be relatively prime to Z, and still fulfil (E*D) mod Z = 1.
 */
const edButton = document.getElementById('ed-button')
edButton.onclick = () => {
  const parentForm = document.getElementById('ed-form')
  const eForm = document.getElementById('e-form')
  const dForm = document.getElementById('d-form')
  let isValidState = true
  clearMessages(parentForm)
  clearMessages(eForm)
  clearMessages(dForm)

  if (e.value == '') {
    errorMessage(eForm, 'No value for E.')
    isValidState = false
  }
  if (d.value == '') {
    errorMessage(dForm, 'No value for D.')
    isValidState = false
  }
  const eFactors = factor(e.value)
  const dFactors = factor(d.value)

  /*
  * Check if e and d have any similar factors by factoring them
  * and seeing if the returned arrays have any factors in common.
  */
  let filtered = []
  /*
  for (let i = 0; i < eFactors.length; i++) {
    if (dFactors.indexOf(eFactors[i]) >= 0) {
      filtered.push(eFactors[i])
    }
  }
  */
  // let's try it
  filtered = eFactors.map((e) => {
    return dFactors.indexOf(e) >= 0
  })
  if (filtered.length > 0) {
    errorMessage(parentForm, 'E and D are not relatively prime.')
    isValidState = false
  }
  if ( (e.value * d.value) % z.value != 1) {
    errorMessage(parentForm, '\((E*D) \mod Z != 1\)')
    isValidState = false
  }

  if (!isValidState) return

  successMessage(eForm, 'E is relatively prime to Z.')
  successMessage(dForm, 'D is relatively prime to Z.')
}

/**
 * Get the input from the plaintext textarea and convert it. The ASCII
 * output is displayed in one box, the encrypted ASCII output is displayed
 * in another, and the decrypted plaintext (using the encrypted ASCII) is
 * displayed in a third box.
 */
const plainTextButton = document.getElementById('msg-plaintext-btn')
plainTextButton.onclick = () => {

  factorButton.classList.add('active')
  document.getElementById('encode-spinner').style.display = 'inline'
  setTimeout(() => {
    const plainTextArea = document.getElementById('msg-plaintext')
    const asciiTextArea = document.getElementById('msg-ascii')
    const encodedTextArea = document.getElementById('msg-encoded')
    const decryptedTextArea = document.getElementById('msg-decrypted')
    const ascii = asciiEncode(plainTextArea.value)
    
    asciiTextArea.value = ascii.join(' ')
    setHeight(asciiTextArea)

    var encoded = encryptText(ascii)
    encodedTextArea.value = encoded.join('')
    setHeight(encodedTextArea)

    var decrypted = decryptText(encoded)
    decryptedTextArea.value = decrypted
    setHeight(decryptedTextArea)

    // Check the result
    clearMessages(document.getElementById('decrypted-form'))
    if (plainTextArea.value != decryptedTextArea.value) {
      errorMessage(document.getElementById('decrypted-form'), 'Decrpted message does not match original.')
    } else {
      successMessage(document.getElementById('decrypted-form'), 'The decrypted message matches the original.')
    }
    document.getElementById('encode-spinner').style.display = 'none'
  }, 30)
}

/**
 * Set the height of a text area so that the content has no scrollbar.
 * @param {HTMLElement} node - The textarea to change.
 */
function setHeight(node) {
  node.style.height = '20px'
  node.style.height = (node.scrollHeight + 10) + 'px'
}
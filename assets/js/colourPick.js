
                        // ************************ grabbing and storing colours ************************


  // Add click eventListener to 'eyedropperBtn' 
  document.getElementById('eyedropperBtn').addEventListener('click', () => {
    const resultElement = document.getElementById('result');
    const historyElement = document.getElementById('history');

    // Check if browser has eyedropper API capabilities, if not show error
    if (!window.EyeDropper) {
      resultElement.textContent = 'Sorry, but your browser does not support the EyeDropper API';
      return;
    }
    // Get/declare eyedropper API
    const eyeDropper = new EyeDropper();

    // Open eyedropper, get results, set text/background colour to selected hexcode 
    eyeDropper.open().then((result) => {
      resultElement.textContent = result.sRGBHex;
      resultElement.style.backgroundColor = result.sRGBHex;

      //Color history to be from localStorage, if none -> empty array
      let colourHistory = JSON.parse(localStorage.getItem('colourHistory')) || [];

      // Push selected hexcode to color history
      colourHistory.push(result.sRGBHex);

      // save new updated colorHistory to localStorage
      localStorage.setItem('colourHistory', JSON.stringify(colourHistory));

      // Call function to update colorHistory
      updateHistory();
  })
  // If there's an error, display error
    .catch((e) => {
      resultElement.textContent = e;
    });
  });


                        // ************************ Clearing it all away ************************



// Click eventListener added to clearBtn
document.getElementById('clearBtn').addEventListener('click', () => {
  // Remove colorHistory from localStorage
  localStorage.removeItem('colourHistory');

  // Clear colorHistory and colourList
  document.getElementById('history').innerHTML = '';
  document.getElementById('colourList').innerHTML = '';
});



                        // ************************ Showing colour collection ************************




const historyElement = document.getElementById('history');

// Function to update colourHistory
const updateHistory = () => {
  // Get from the colourHistory in localStorage/ start empty array if none
  let colourHistory = JSON.parse(localStorage.getItem('colourHistory')) || [];

  // Array of the colours plus delete button on each
  const historyElements = colourHistory.map((color, index) => {
    return `
      <div style="background-color: ${color};">
        ${color}
        <button class="deleteBtn" data-index="${index}">Delete</button>
      </div>
    `;
  });

  // The list of hexcodes for copying.
  const colourList = colourHistory.map(color => {
    return `/* background-color:  ${color} ; */ `;
  });

  // 5x per row
  const rows = [];
  for (let i = 0; i < historyElements.length; i += 5) {
    const row = document.createElement('div');
    // Style from css 
    row.classList.add('colourHistory-row'); 
    row.innerHTML = historyElements.slice(i, i + 5).join('');
    rows.push(row);
  }

  // To stop it repeating prev colours.
  historyElement.innerHTML = '';

  rows.forEach((row) => historyElement.appendChild(row));









                        // ************************ Delete buttons ************************



  // Delete buttons event listeners to remove it, update colourHistory
  document.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index, 10);
      colourHistory.splice(index, 1);
      localStorage.setItem('colourHistory', JSON.stringify(colourHistory));
      updateHistory();
    });
  });

  // Also update colorList bit
  const colourListElement = document.getElementById('colourList');
  colourListElement.textContent = colourList.join('\n');
};



updateHistory();






                        // ************************ Copy to clipboard ************************


const copyBtn = document.getElementById('copyBtn');
const colourListBit = document.getElementById('colourList');

copyBtn.addEventListener('click', () => {
  const colorListText = colourListBit.textContent;
  navigator.clipboard.writeText(colorListText);
  // Little message few secs 
  copyBtn.textContent = 'Copied!';
  setTimeout(() => (copyBtn.textContent = 'Copy Color List'), 2000);
});




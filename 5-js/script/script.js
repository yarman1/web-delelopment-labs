'use strict';
// first
const replaceContent = (id1, id2) => {
  const div1 = document.getElementById(id1);
  const div2 = document.getElementById(id2);

  const firstData = div1.innerHTML;

  div1.innerHTML = div2.innerHTML;
  div2.innerHTML = firstData;
};

// second
const trapezeArea = (base1, base2, height) => height*((base1 + base2)/2);

const getTrapezeArea = () => {
  const base1 = document.getElementById('base1');
  const base2 = document.getElementById('base2');
  const height = document.getElementById('height');

  return trapezeArea(parseInt(base1.value), parseInt(base2.value), parseInt(height.value));
};

const showTrapezeArea = () => {
  const area = getTrapezeArea();

  const textElement = document.getElementById('trapeze-result');
  textElement.innerText = 'Trapeze area: ' + area;
};

// third
const getDivisors = number => {
  const result = [];

  for (let i = number; i > 0; i--) {
    if (number % i === 0) {
      result.push(i);
    }
  }

  return result;
};

const getDivisorsString = () => {
  const inputNumber = parseInt(document.getElementById('number').value);

  const divisorsArray = getDivisors(inputNumber); 
  return divisorsArray.join(', ');
};

const setCookies = (key, data) => {
  document.cookie = `${key}=${data};`;
};

const deleteCookies = (key) => {
  setCookies(key, 'null; max-age=0');
};

const showDivisors = () => {
  const divisors = getDivisorsString();

  alert(divisors);
  setCookies('divisors', divisors);
};

const loader = () => {
  const cookie = document.cookie;

  if (cookie.indexOf('divisors') !== -1) {
    const confirmation = confirm(cookie + ' Cookies are available. Save them?');

    if (!confirmation) {
      deleteCookies('divisors');
      const form = document.getElementById('divisor-form');
      form.innerHTML = '<span>Input number:</span><input type=\"valu\" name=\"number"\ id="number\"><button name=\"find-divisors\" onclick=\"showDivisors()\">Get divisers</button><br>';
    } else {
      document.getElementById('divisor-form').innerHTML = '';
      alert('Reload the page');
    }
  } else {
    const form = document.getElementById('divisor-form');
    form.innerHTML = '<span>Input number:</span><input type=\"valu\" name=\"number"\ id="number\"><button name=\"find-divisors\" onclick=\"showDivisors()\">Get divisers</button><br>';
  }
};

// fourth
const change = (type) => {
  const element = document.getElementById('changing-text');
  const text = element.innerText.split(' ');

  const newTextArray = text.map((word) => word.charAt(0)[`to${type}Case`]() + word.slice(1));
  element.innerText = newTextArray.join(' ');

  localStorage.setItem('type', type);
};

if (localStorage.getItem('type') == 'Upper') {
  const upperRadio = document.getElementById('upper');
  upperRadio.checked = true;

  change('Upper');
}

const changeTextForm = document.getElementById('change-text');

document.addEventListener('change', (event) => {
  change(event.target.value);
});

//fifth
localStorage.setItem('counter', 0);
if (!localStorage.getItem('savedImages')) {
  localStorage.setItem('savedImages', parseInt(0));
}

const getImageUrl = async (number) => {
  const responce = await fetch(`https://picsum.photos/v2/list?limit=${number}`);
  const imageData = await responce.json();
  const image = imageData[number - 1];
  
  return image['download_url'];
};

const getImage = async () => {
  let counter = localStorage.getItem('counter');
  let url = '';
  let repeat = false;
  
  do {
    counter++;
    repeat = false;
    url = await getImageUrl(counter);
    
    const keys = Object.keys(localStorage);
    if (keys.includes(`image-${counter}`)) {
      repeat = true;
    }

  } while (repeat)

  localStorage.setItem('counter', counter);

  return url;
};

const createImageElement = (url, number) => {
  const block = document.createElement('div');
  block.className = 'adding-image';
  block.id = `image-${number}`;

  block.innerHTML = `<img src=\"${url}\" id=\"${block.id}-pic\" width=\"200\"><br><button onclick=\"addImage(this.parentElement)\">Add to storage</button><button onclick=\"deleteImage(this.parentElement)\">Remove from storage</button>`;

  const imageContainer = document.getElementById('images');
  imageContainer.appendChild(block);
};

const addImage = (block) => {
  const blockId = block.id;

  const imageElement = document.getElementById(`${blockId}-pic`);
  const url = imageElement.src;

  localStorage.setItem(blockId, url);
  const savedImages = localStorage.getItem('savedImages');
  localStorage.setItem('savedImages', parseInt(savedImages) + 1);
};

const deleteImage = (block) => {
  const blockId = block.id;
  if (localStorage.getItem(blockId)) {
    localStorage.removeItem(blockId);
    const savedImages = parseInt(localStorage.getItem('savedImages'));
    localStorage.setItem('savedImages', savedImages - 1);
  }

  block.remove();
};

const generateImage = () => {
  getImage().then((url) => {
    const number = localStorage.getItem('counter');
    createImageElement(url, number);
  });
};

if (localStorage.getItem('savedImages') > 0) {
  const keys = Object.keys(localStorage);
  const filterScheme = ['savedImages', 'counter', 'type'];
  const imagesKeys = keys.filter((x) => !filterScheme.includes(x));

  for (const key of imagesKeys) {
    const number = parseInt(key.slice(6));
    const url = localStorage.getItem(key);

    createImageElement(url, number);
  }
}

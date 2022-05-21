
class SearchedObject {
  constructor(dataObject){
    this.created = dataObject.created || '?';
    this.episodes = dataObject.episode || '?';
    this.gender = dataObject.gender || '?';
    this.id = dataObject.id || '?';
    this.image = dataObject.image || '?';
    this.location = dataObject.location || '?';
    this.name = dataObject.name || '?';
    this.origin = dataObject.origin || '?';
    this.species = dataObject.species || '?';
    this.status = dataObject.status || '?';
    this.type = dataObject.type || '?';
    this.url = dataObject.url || '?';
  }
  createElement(){
    let block = `<div class="block" data-id="${this.id}">
                <span class="status unknown">unknown</span>
                <div class="block__photo">
                  <img class="block__img" src="${this.image}">
                </div>
                <div class="block__main">
                  <div class="modal">
                    <p class="modal__gender">Gender: ${this.gender}</p>
                    <p class="modal__species">Species: ${this.species}</p>
                    <p class="modal__planet">Planet: ${this.origin.name}</p>
                    <p class="modal__location">Location: ${this.location.name}</p>
                  </div>
                  <p class="block__name">${this.name}</p>
                </div>
                <div class="block__button">
                  <button class="block__btn" id="delete-btn">Delete</button></div></div>
                </div>
              </div>`

    return block;
  }
}

const root = document.getElementById('root'),
      body = document.querySelector('body'),
      container = document.querySelector('#characters-wrap'),
      input = document.querySelector('#search-input'),
      searchButton = document.querySelector('#search-btn'),
      loadMoreButton = document.querySelector('.load-more');

const APILink = 'https://rickandmortyapi.com/api/character/';


let amountOfResults = 5;
const STEP = 5;
let MAX_ID = 826;
let savedResuls = JSON.parse(localStorage.getItem('savedResults')) || [];
let savedObjects = [];




input.placeholder = `Enter ID: 1 to ${MAX_ID}`

showSearchResults();
showHideLoadMoreButton();

function getObject(id){
  fetch(APILink + id)
    .then(response => {
      return response.json();
    })
    .then(data => {
      savedObjects.unshift(new SearchedObject(data));
      savedResuls.unshift(savedObjects[0].createElement());

      setObjectsToLocalStorage();
      clearContainer();
      showSearchResults();
      showHideLoadMoreButton();
    })
}

searchButton.addEventListener('click', handleSearch);
window.addEventListener('keydown', handleEnter);

function handleEnter(e){
  
  if (e.key === 'Enter'){
    handleSearch();
  }
}

function handleSearch(){

  if( !input.value){
    alert('Please enter id!');
    return;
  }

  if ( input.value <= 0 || input.value > MAX_ID || isNaN(input.value)) {
    alert('There is no such id');
    return;
  }

  if( isIdInList(input.value) ){
    alert('Already in list!');
    return;
  }

  getObject(input.value);
}

function showSearchResults(){
  
  if( savedResuls.length ){
    
    if ( amountOfResults - STEP >= savedResuls.length && savedResuls.length){
      amountOfResults -= STEP
    }

    for (let i = 0; i < amountOfResults; i++){
      if (savedResuls[i] === undefined) {
        continue;
      }
      container.insertAdjacentHTML('beforeend', savedResuls[i]);
    }
    return;
  }
}

function isIdInList(id){
  return savedResuls.filter(item => {
    return item.match(new RegExp(`data-id="${id}"`, 'g'));
  }).length;
}

container.addEventListener('click', deleteObject);

function deleteObject(event){
  let isButton = event.target.id === 'delete-btn';

  if( isButton && confirm('Are you sure?') ){

    savedObjects = savedObjects.filter((item, index) => { 
      return index !== [...container.children].indexOf(event.target.parentNode.parentNode);
    })

    savedResuls = savedResuls.filter((item, index) => {
      return index !== [...container.children].indexOf(event.target.parentNode.parentNode);
    })

    if ( amountOfResults - STEP >= savedResuls.length && savedResuls.length){
      amountOfResults -= STEP
    }

    setObjectsToLocalStorage();
    clearContainer();
    showSearchResults();
    showHideLoadMoreButton();
  }
}

loadMoreButton.addEventListener('click', loadMoreResults);

function loadMoreResults(){

  if (savedResuls.length <= amountOfResults){
    alert('There is nothing to show!')
    return;
  }

  amountOfResults += STEP;
  const TIME_OUT_TIME = 350;

  setTimeout( () => {
    window.scroll(0, body.scrollHeight);
  }, TIME_OUT_TIME);
  clearContainer();
  showSearchResults();
}

function showHideLoadMoreButton(){

  if (savedResuls.length > STEP){
    loadMoreButton.style.display = 'block';
    return;
  }
  loadMoreButton.style.display = 'none';
}

function getLocalStorageObjects(){
  return localStorage.getItem('savedResults');
}

function setObjectsToLocalStorage(){
  localStorage.setItem('savedResults', JSON.stringify(savedResuls));
}

function clearLocalStorage(){
  localStorage.clear();
}

function clearSavedResults() {
  savedResuls = [];
}

function clearSavedObjects() {
  savedObjects = [];
}

function clearContainer() {
  container.innerHTML = '';
}
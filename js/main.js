import {viewType} from './view-type.js';
import {hideShowFav} from './hide-show-fav.js';
import {cardsToHtml} from './cards-to-html.js';

const App = (function() {
    'use strict'
	const listOfFavourites = document.querySelector('.favourites-list'),
		listOfCards = document.querySelector('.gallery-cards'),
		select = document.querySelector('.select-genre');
		
	const favList = [],
		listOfAllGenres = [],
		listOfGenresFiltered = [];

	let closing = false;

	fetch('http://my-json-server.typicode.com/moviedb-tech/movies/list/')
		.then(response => response.json())
		.then(result => {
			result.forEach(item => listOfAllGenres.push(...item.genres))
			cardsToHtml.print(result);
            showModal(cardsToHtml.cards, result);
            printSelect(listOfAllGenres);
			downloadingFavList();
		})

	function printSelect(list){
		list.map(function(elem){
			if (!listOfGenresFiltered.some(function(item){
				return item.toLowerCase() === elem.toLowerCase();
			})) {
				listOfGenresFiltered.push(elem);
				select.insertAdjacentHTML('beforeEnd',`
					<option value="${elem}">${elem[0].toUpperCase() + elem.slice(1, elem.length)}</option>
				`);
			}
		})
	}

	function showModal(item, data){
		item.map(function(elem, index){
			elem.addEventListener('click', function(e){
				if (closing === false && !e.target.classList.contains('to-favourites')) {
					const newModal = createModal(data[index]);
					modalListener(data[index], newModal);
					setTimeout(function(){
						document.querySelector('body').classList.add('open');
						newModal.classList.add('open-z');
					}, 10);
				} else if(closing === false && e.target.classList.contains('to-favourites')){
					addRemoveToFavourite(data[index])
				}
			})
		})
	}


	function createModal(data){
		let state = '';
		function checkFav(item){
			return item.id === data.id;
		}
		if (favList.some(checkFav)) {
			state = 'change-state';
		}

		const myModal = document.createElement('div');
		myModal.classList.add('modal');
		myModal.insertAdjacentHTML('afterBegin', `
			<div class="modal-overlay">
				<div class="modal-window">
					<div class="modal-info">
						<img class="modal-img" src="${data.img}" alt="${data.name}">
						<div class="modal-year">
							<span class="to-favourites ${state}">&#9733;</span>
							<span>${data.year}</span>
						</div>
						<div class="modal-genres">
							${data.genres}
						</div>
					</div>
					<div class="modal-text">
						<h3 class="modal-title">${data.name}</h3>
						<p class="modal-desc">${data.description}</p>
						<p class="modal-director">Director: ${data.director}</p>
						<p class="modal-starring">Starring: ${data.starring}</p>
					</div>
					<button class="modal-exit" data-close='true'>&#10006;</button>
				</div>
			</div>
			`);
		document.body.append(myModal);
		return myModal;
	}

	function modalListener(data, modal){
		modal.querySelector('.to-favourites').addEventListener('click', function(){
			this.classList.toggle('change-state');
			addRemoveToFavourite(data)
		})
	}

	function destroyModal(){
		document.querySelector('.modal').classList.remove('open-z');
		document.querySelector('.modal').remove();
		closing = false;
	}

	document.body.addEventListener('click', function(e){
		if (e.target.dataset.close){
			closing = true;
			document.querySelector('body').classList.remove('open');
			setTimeout(destroyModal, 300);
		}
	})

	function addRemoveToFavourite(data){
		function checkFav(item){
			return item.id === data.id;
		}
		document.querySelector(`.card[data-movie-id = '${data.id}'] .to-favourites`).classList.toggle('change-state');
		if (favList.some(checkFav)) {
			favList.splice(favList.findIndex(checkFav), 1);
			document.querySelector(`.favourites-list-item[data-movie-id='${data.id}']`).remove();
			sessionStorage.removeItem(data.id);
		} else {
			favList.push(data);
			listOfFavourites.insertAdjacentHTML('afterBegin', `
				<li data-movie-id='${data.id}' class="favourites-list-item ">
					<p>${data.name}</p>
					<div class="fav-item-del">✖</div>
				</li>
				`);
			sessionStorage.setItem(data.id, JSON.stringify({id: data.id, name: data.name}));
			
			listOfFavourites.querySelector(`.favourites-list-item .fav-item-del`).addEventListener('click', function(){
				favList.splice(favList.findIndex(checkFav), 1);
				document.querySelector(`.favourites-list-item[data-movie-id='${data.id}']`).remove();
				sessionStorage.removeItem(data.id);
				document.querySelector(`.card[data-movie-id = '${data.id}'] .to-favourites`).classList.toggle('change-state');
			})
		}
	}

	select.addEventListener('change', function(){
		listOfCards.querySelectorAll('.card').forEach(function(item, index){
			if(item.classList.contains('none')){
				item.classList.remove('none');
			}
			if (!item.dataset.genres.split(',').some(function(elem){
				return elem.toLowerCase() === select.value.toLowerCase();
			}) && select.value !== 'all' ){ 
				item.classList.add('none'); 
			}
		})
	})


	function downloadingFavList(){
		if (sessionStorage.length) {
			for (let i = 0; i < sessionStorage.length; i++) {
                let key = sessionStorage.key(i);
                if(JSON.parse(sessionStorage.getItem(key)).id !== undefined){
                    favList.push(JSON.parse(sessionStorage.getItem(key)));
                    listOfFavourites.insertAdjacentHTML('afterBegin', `
                        <li data-movie-id='${key}' class="favourites-list-item ">
                            <p>${JSON.parse(sessionStorage.getItem(key)).name}</p>
                            <div class="fav-item-del">✖</div>
                        </li>
                    `);
                    document.querySelector(`.card[data-movie-id='${key}'] .to-favourites`).classList.add('change-state');
        
                    listOfFavourites.querySelector(`.favourites-list-item .fav-item-del`).addEventListener('click', function(){
                        function checkFav(item){
                            return item.id === key;
                        }
                        favList.splice(favList.findIndex(checkFav), 1);
                        document.querySelector(`.favourites-list-item[data-movie-id='${key}']`).remove();
                        sessionStorage.removeItem(key);
                        document.querySelector(`.card[data-movie-id='${key}'] .to-favourites`).classList.remove('change-state');
                    })
                }	
			}
		}
	}

})();
export const cardsToHtml = (function(){
	const listOfCards = document.querySelector('.gallery-cards'),
		cards = [];
	
	function printCard(data){
		let card = document.createElement('div');
		card.dataset.genres = data.genres;
		card.dataset.movieId = data.id;
		card.classList.add('card');
		card.insertAdjacentHTML('afterBegin',`
		<div class="card-img">
			<div class="to-favourites">&#9733;</div>
			<img src="${data.img}" alt="${data.name}">
		</div>
		<div class="card-text-container">
			<div class="card-title">
				<p class="card-name">${data.name}</p>
				<p class="card-year">${data.year}</p>
			</div>
			<div class="card-text">
				<p class="card-desc">${data.description}</p>
				<p class="card-genres">${data.genres}</p>
			</div>
		</div>
		`);
		listOfCards.append(card);
		cards.push(card)
	}

	function printCards(data){
		data.map(function(item){
			printCard(item);
		})
	}

	return {
		print: printCards,
		cards: cards
	}

})()

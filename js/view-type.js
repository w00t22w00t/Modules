export const viewType = (function() {
    const viewCard = document.querySelector('.gallery-type-cards'),
    listOfCards = document.querySelector('.gallery-cards'),
    viewList = document.querySelector('.gallery-type-list');

    viewCard.addEventListener('click', function(){
		if(listOfCards.classList.contains('to-list')){
			listOfCards.classList.toggle('to-list');
			viewCard.classList.toggle('selected');
			viewList.classList.toggle('selected');
		}
	})

	viewList.addEventListener('click', function(){
		if(!listOfCards.classList.contains('to-list')){
			listOfCards.classList.toggle('to-list')
			viewList.classList.toggle('selected');
			viewCard.classList.toggle('selected');
		}
	})
}())
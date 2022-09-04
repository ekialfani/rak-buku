const bookList = [];

function createBookDataObject(id, title, published, isCompleted) {
	return {
		id,
		title,
		published,
		isCompleted
	}
}


function generateId() {
	return +new Date();
}

function addNewBook(){
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const published = document.getElementById('published').value;
	const isCompleted = document.getElementById('is-completed').checked;

	const id = generateId();
	const bookData = createBookDataObject(id, title, published, isCompleted);

	bookList.push(bookData);
	console.log(bookList);
}

document.addEventListener('DOMContentLoaded', function(){
	const addBookForm = document.getElementById('add-book-form');

	addBookForm.addEventListener('submit', function(e){
		e.preventDefault();

		addNewBook();
	})
})

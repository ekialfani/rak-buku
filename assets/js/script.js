const bookList = [];
const RENDER_EVENT = 'render-book';


function findBookPosition(bookId){
	for(const position in bookList){
		if(bookList[position].id === bookId){
			return position;
		}
	}

	return -1;
}

function findBook(bookId){
	for(const book of bookList){
		if(book.id === bookId){
			return book;
		}
	}

	return null;
}


function deleteBookFromBookshelf(bookId){
	// get book position
	const bookPosition = findBookPosition(bookId);

	// delete book data by index/position
	bookList.splice(bookPosition, 1);

	// run render-event to update bookList data
	document.dispatchEvent(new Event(RENDER_EVENT));
}


function addBookToCompleted(bookId){
	const targetBook = findBook(bookId);

	if(targetBook === null) return;

	// change isCompleted from false to true
	targetBook.isCompleted = true;

	document.dispatchEvent(new Event(RENDER_EVENT));
}


function undoBookFromCompleted(bookId){
	// find book by id
	const targetBook = findBook(bookId);
	
	// when the targetBook is empty
	if(targetBook === null) return;

	// change isCompleted from true to false
	targetBook.isCompleted = false;

	// run render-event to update bookList data
	document.dispatchEvent(new Event(RENDER_EVENT));
}


function createBookItem(bookData){
	const bookTitle = document.createElement('h3');
	bookTitle.innerText = bookData.title;

	const author = document.createElement('p');
	author.innerText = 'Penulis: ' +bookData.author;

	const published = document.createElement('p');
	published.innerText = 'Tahun Terbit: ' +bookData.published;

	const container = document.createElement('li');
	container.classList.add('book-item');

	container.append(bookTitle, author, published);

	if(bookData.isCompleted){
		// add an 'undo button' to container when 'isCompleted' is true
		const undoButton = document.createElement('button');
		undoButton.innerText = 'Belum Selesai';
		undoButton.classList.add('undo-button');

		// when 'undo button' is clicked
		undoButton.addEventListener('click', function(){
			undoBookFromCompleted(bookData.id);
		})

		const deleteButton = document.createElement('button');
		deleteButton.innerText = 'Hapus Buku';
		deleteButton.classList.add('delete-button');

		// add a 'delete button' to delete book data
		deleteButton.addEventListener('click', function(){
			deleteBookFromBookshelf(bookData.id);
		})

		container.append(undoButton, deleteButton);

	}else {
		// add a 'complete button' to container when 'isCompleted' is true
		const completeButton = document.createElement('button');
		completeButton.innerText = 'Selesai Dibaca';
		completeButton.classList.add('complete-button');

		// when 'complete button' is clicked
		completeButton.addEventListener('click', function(){
			addBookToCompleted(bookData.id);
		})

		// add a 'delete button' to delete book data
		const deleteButton = document.createElement('button');
		deleteButton.innerText = 'Hapus Buku';
		deleteButton.classList.add('delete-button');

		deleteButton.addEventListener('click', function(){
			deleteBookFromBookshelf(bookData.id);
		})

		container.append(completeButton, deleteButton);
	}

	return container;
}


function renderBookList() {
	const uncompletedBookList = document.getElementById('uncompleted-list');
	const completedBookList = document.getElementById('completed-list')
	
	uncompletedBookList.innerHTML = '';
	completedBookList.innerHTML = '';

	for(const book of bookList){
		const bookItem = createBookItem(book);

		if(!book.isCompleted){
			uncompletedBookList.append(bookItem);
		}else {
			completedBookList.append(bookItem);
		}
	}
}


document.addEventListener(RENDER_EVENT, function(){
	renderBookList();
})


function createBookDataObject(id, title, author, published, isCompleted) {
	return {
		id,
		title,
		author,
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
	const bookData = createBookDataObject(id, title, author, published, isCompleted);

	bookList.push(bookData);
	document.dispatchEvent(new Event(RENDER_EVENT));
}


document.addEventListener('DOMContentLoaded', function(){
	const addBookForm = document.getElementById('add-book-form');

	addBookForm.addEventListener('submit', function(e){
		e.preventDefault();

		addNewBook();
	})
})

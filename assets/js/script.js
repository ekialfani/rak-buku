const bookList = [];
const RENDER_EVENT = 'render-book';
const BOOKSHELF_STORAGE = 'bookshelf-data';


function checkForStorage(){
	if(typeof(Storage !== undefined)){
		return true;
	}else {
		alert('Browser doesn\'t support Web Storage');
		return false;
	}
}

function loadDataFromStorage(){
	const bookData = JSON.parse(localStorage.getItem(BOOKSHELF_STORAGE));

	if(bookData !== null){
		for(const book of bookData){
			bookList.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveBookData(){
	if(checkForStorage()){
		const bookData = JSON.stringify(bookList);

		localStorage.setItem(BOOKSHELF_STORAGE, bookData);
	}
}

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


function editBookData(bookData){
	sessionStorage.setItem('book-id', JSON.stringify(bookData.id));
	const editContainer = document.querySelector('.edit-container');
	const editBook = editContainer.querySelector('.container');

	editContainer.classList.add('content-show');
	editBook.classList.replace('animation-hide', 'animation-show');

	const editForm = editBook.querySelector('#edit-form');
	editForm.querySelector('#title').setAttribute('value', bookData.title);
	editForm.querySelector('#author').setAttribute('value', bookData.author);
	editForm.querySelector('#published').setAttribute('value', bookData.published);

	editForm.addEventListener('submit', function(e){
		e.preventDefault();

		const title = editForm.querySelector('#title').value;
		const author = editForm.querySelector('#author').value;
		const published = editForm.querySelector('#published').value;

		const bookId = JSON.parse(sessionStorage.getItem('book-id'));

		const book = findBook(bookId);

		book.title = title;
		book.author = author;
		book.published = published;

		document.dispatchEvent(new Event(RENDER_EVENT));
		saveBookData();

		editBook.classList.replace('animation-show', 'animation-hide');
		setTimeout(() => {
			editContainer.classList.remove('content-show');
		}, 300);
	})

	editForm.reset();
}


function deleteBookFromBookshelf(bookId){
	// get book position
	const bookPosition = findBookPosition(bookId);

	// delete book data by index/position
	bookList.splice(bookPosition, 1);

	// run render-event to update bookList data
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBookData();
}


function confirmToDeleteBook(bookId){
	const container = document.querySelector('.popup-container');
	container.classList.add('content-show');

	container.innerHTML = '';

	const popupBox = document.createElement('div');
	popupBox.classList.add('popup-box', 'animation-show');

	const icon = document.createElement('div');
	icon.classList.add('icon','warning-icon');

	const messages = document.createElement('h3');
	messages.innerText = 'apakah anda yakin ingin menghapus buku ini?';

	const cancelButton = document.createElement('button');
	cancelButton.innerText = 'batal';
	cancelButton.classList.add('cancel-button');

	cancelButton.addEventListener('click', function(){
		popupBox.classList.replace('animation-show', 'animation-hide');

		setTimeout(() => {
			container.classList.remove('content-show');
		}, 300);
	})

	const confirmButton = document.createElement('button');
	confirmButton.innerText = 'ya';
	confirmButton.classList.add('confirm-button');

	confirmButton.addEventListener('click', function(){
		icon.classList.replace('warning-icon', 'success-icon');
		messages.innerText = 'buku berhasil dihapus';
		popupBox.removeChild(cancelButton);
		popupBox.removeChild(confirmButton);

		setTimeout(() => {
			container.classList.remove('content-show');
		}, 1000)

		deleteBookFromBookshelf(bookId);
	})

	popupBox.append(icon, messages, cancelButton, confirmButton);


	container.append(popupBox);
}


function addBookToCompleted(bookId){
	const targetBook = findBook(bookId);

	if(targetBook === null) return;

	// change isCompleted from false to true
	targetBook.isCompleted = true;

	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBookData();
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
	saveBookData();
}


function createBookItem(book){
	const title = document.createElement('h3');
	title.innerText = book.title;

	const author = document.createElement('p');
	author.innerText = 'Penulis: ' +book.author;

	const published = document.createElement('p');
	published.innerText = 'Tahun Terbit: ' +book.published;

	const container = document.createElement('li');
	container.classList.add('book-item');

	container.append(title, author, published);

	if(book.isCompleted){
		// add an 'undo button' to container when 'isCompleted' is true
		const undoButton = document.createElement('button');
		undoButton.innerText = 'Belum Selesai';
		undoButton.classList.add('undo-button');

		// when 'undo button' is clicked
		undoButton.addEventListener('click', function(){
			undoBookFromCompleted(book.id);
		})

		const deleteButton = document.createElement('button');
		deleteButton.innerText = 'Hapus Buku';
		deleteButton.classList.add('delete-button');

		// add a 'delete button' to delete book data
		deleteButton.addEventListener('click', function(){
			confirmToDeleteBook(book.id);

		})

		container.append(undoButton, deleteButton);

	}else {
		// add a 'complete button' to container when 'isCompleted' is true
		const completeButton = document.createElement('button');
		completeButton.innerText = 'Selesai Dibaca';
		completeButton.classList.add('complete-button');

		// when 'complete button' is clicked
		completeButton.addEventListener('click', function(){
			addBookToCompleted(book.id);
		})

		// add a 'delete button' to delete book data
		const deleteButton = document.createElement('button');
		deleteButton.innerText = 'Hapus Buku';
		deleteButton.classList.add('delete-button');

		deleteButton.addEventListener('click', function(){
			confirmToDeleteBook(book.id);
		})

		container.append(completeButton, deleteButton);
	}

	const editButton = document.createElement('button');
	editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'

	editButton.classList.add('edit-button');

	editButton.addEventListener('click', function(){
		editBookData(book);
	})

	container.append(editButton);

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
	saveBookData();
}


document.addEventListener('DOMContentLoaded', function(){
	const addBookForm = document.getElementById('add-book-form');

	addBookForm.addEventListener('submit', function(e){
		e.preventDefault();

		addNewBook();

		addBookForm.reset();
		window.scrollTo({
			top: 613,
			behavior: 'smooth'
		})
	})

	if(checkForStorage()){
		loadDataFromStorage();
	}
})


function searchBookByTitle(inputValue){
	const completedBookList = document.getElementById('completed-list');
	const uncompletedBookList = document.getElementById('uncompleted-list');
	
	completedBookList.innerHTML = '';
	uncompletedBookList.innerHTML = '';

	for(const book of bookList){
		const bookTitle = book.title.toLowerCase();
		if(bookTitle.indexOf(inputValue) !== -1){
			const bookItem = createBookItem(book);

			if(book.isCompleted){
				completedBookList.append(bookItem);
			}else {
				uncompletedBookList.append(bookItem);
			}
		}
	}
}


// search book by title
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function(e){
	const inputValue = e.target.value.toLowerCase();

	searchBookByTitle(inputValue);
})


window.addEventListener('scroll', function(){
	if(this.pageYOffset > 10){
		document.querySelector('header').classList.add('shadow');
	}else {
		document.querySelector('header').classList.remove('shadow');	
	}
})
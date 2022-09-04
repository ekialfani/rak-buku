document.addEventListener('DOMContentLoaded', function(){
	const addBookForm = document.getElementById('add-book-form');

	addBookForm.addEventListener('submit', function(e){
		e.preventDefault();

		const title = document.getElementById('title').value;
		const author = document.getElementById('author').value;
		const published = document.getElementById('published').value;
		const isCompleted = document.getElementById('is-completed').checked;

		console.log(title);
		console.log(author);
		console.log(published);
		console.log(isCompleted);
	})
})

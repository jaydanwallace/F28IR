const SEARCH_URL = 'https://openlibrary.org/search.json';
const COVER_URL  = 'https://covers.openlibrary.org/b/id';

async function searchBooks() {
  const query = document.getElementById('query').value.trim();
  const type  = document.getElementById('searchType').value;

  if (!query) {
    alert('Please enter a search term.');
    return;
  }

  // clear previous results and show loading message
  document.getElementById('status').textContent  = 'Loading...';
  document.getElementById('error').textContent   = '';
  document.getElementById('results').innerHTML   = '';

  try {
    // send request to Open Library using Axios
    const response = await axios.get(SEARCH_URL, {
      params: { [type]: query, limit: 10 }
    });

    const books = response.data.docs;
    const total = response.data.numFound;

    document.getElementById('status').textContent =
      `Found ${total} results. Showing first ${books.length}.`;

    if (books.length === 0) {
      document.getElementById('results').innerHTML = '<p>No books found.</p>';
      return;
    }

    // display a card for each book
    books.forEach(book => displayBook(book));

  } catch (error) {
    document.getElementById('status').textContent = '';
    document.getElementById('error').textContent  = 'Error: ' + error.message;
  }
}

function displayBook(book) {
  const coverSrc = book.cover_i
    ? `${COVER_URL}/${book.cover_i}-M.jpg`
    : 'https://placehold.co/60x90?text=No+Cover';

  const authors    = (book.author_name || ['Unknown']).join(', ');
  const year       = book.first_publish_year || 'N/A';
  const editions   = book.edition_count      || 'N/A';

  const div = document.createElement('div');
  div.className = 'book';
  div.innerHTML = `
    <img src="${coverSrc}" alt="Cover of ${book.title}" />
    <div class="book-info">
      <h3>${book.title || 'Unknown Title'}</h3>
      <p><strong>Author:</strong> ${authors}</p>
      <p><strong>First Published:</strong> ${year}</p>
      <p><strong>Editions:</strong> ${editions}</p>
    </div>
  `;

  document.getElementById('results').appendChild(div);
}

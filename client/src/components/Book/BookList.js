import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getBooksQuery } from '../../queries/queries';
import BookDetails from './BookDetails';

const BookList = () => {
  const [selectedBook, setSelectedBook] = useState('');
  const {loading, data} = useQuery(getBooksQuery);

  const displayBooks = () => {
    const books = data?.books;
    if (loading) {
      return (<div>Loading....</div>);
    } else {
      return books && books.length && books.map((book) => {
        return (<div key={book.id}>
          <li onClick={(e) => getBookDetails(e, book.id)}>{book.name}</li>
        </div>);
      });
    }
  };

  const getBookDetails = (e, id) => {
    setSelectedBook(id);
  };

  return (
    <div>
      <ul id={'book-list'}>
        {displayBooks()}
      </ul>
      <BookDetails bookId={selectedBook}/>
    </div>
  );
};

export default BookList;

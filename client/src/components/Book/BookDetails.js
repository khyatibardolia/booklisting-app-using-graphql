import { useQuery } from '@apollo/client';
import { getBookDetailsQuery } from '../../queries/queries';

const BookDetails = ({bookId}) => {
  const {loading, data} = useQuery(getBookDetailsQuery, {
    variables: {
      id: bookId
    }
  });
  const book = data?.book;
  return (<div id={'book-details'}>
    {loading ? <div>Loading details...</div> :
      book && Object.keys(book).length ?
        <div>
          <h2>{book.name}</h2>
          <p><b>Genre:</b> {book.genre}</p>
          <p><b>Author:</b> {book.author.name}</p>
          <p>All Books by {book.author.name} : </p>
          <ul className={'other-books'}>
            {book?.author?.books.map((item) =>
              <>
                <li key={item.id}>{item.name}</li>
              </>)}
          </ul>
        </div>
        : 'No' +
        ' book selected!'}
  </div>);
};

export default BookDetails;

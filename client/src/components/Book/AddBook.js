import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../../queries/queries';

const AddBook = () => {

  const [newBookObj, setNewBook] = useState({
    name: '', genre: '', authorId: ''
  });
  const {data, loading} = useQuery(getAuthorsQuery);

  const displayAuthors = () => {
    const authors = data?.authors;
    if (loading) {
      return (<div>Loading authors...</div>);
    } else {
      return authors && authors.length && authors.map((author) => {
        return (<option key={author.id} value={author.id}>
          {author.name}
        </option>);
      });
    }
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setNewBook(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addNewBook = (e) => {
    e.preventDefault();
    onSubmitHandler({
      variables: {
        name: newBookObj.name,
        genre: newBookObj.genre,
        authorId: newBookObj.authorId
      },
      refetchQueries: [{
        query: getBooksQuery
      }]
    });
  };

  const [onSubmitHandler] = useMutation(addBookMutation);

  return (<form id="add-book" onSubmit={addNewBook}>
    <div className="field">
      <label>Book name:</label>
      <input type="text" name="name" onChange={handleChange}/>
    </div>
    <div className="field">
      <label>Genre:</label>
      <input type="text" name="genre" onChange={handleChange}/>
    </div>
    <div className="field">
      <label>Author:</label>
      <select name="authorId" onChange={handleChange}>
        <option>Select author</option>
        {displayAuthors()}
      </select>
    </div>
    <button>+</button>
  </form>);
};
export default AddBook;

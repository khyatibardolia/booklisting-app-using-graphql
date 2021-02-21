import AddBook from './components/Book/AddBook';
import BookList from './components/Book/BookList';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Book List</h1>
        <div>
          <BookList/>
          <AddBook/>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;

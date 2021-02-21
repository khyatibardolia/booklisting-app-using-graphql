// The schema will describe the type of data and relationship of data

const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const mongoose = require('mongoose');

//connect to mlab db
const connection = mongoose.connection;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

//dummydata
/*const books = [{
  name: 'abc', genre: 'Fantsay', id: '1', authorId: '1'
},
  {name: 'xyz', genre: 'Fantsay1', id: '2', authorId: '2'},
  {name: 'pop', genre: 'Fantsa2y', id: '3', authorId: '3'}
];

const authors = [{
  name: 'abc', age: 33, id: '1'
},
  {name: 'xyz', age: 23, id: '2'},
  {name: 'pop', age: 11, id: '3'}
];*/

//GraphQLObjectType func will define what this BookType is all about
//We have defined 1st object type in our graph and its used to fire root queries.
//the author relationship here will let know graphql which books this author has written.
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    /* The reason for this to be a func is that, when we have multiple types and they
      have references to one another, then unless we wrap those fields in a func, one type
      might not necessarily know what another type is */
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args) {
       // return _.find(authors, {id: parent.authorId});
        return Author.findById(parent.authorId)
      }
    }
  })
});

/*To fetch {author(id: 1) {
             name
             age
             books {
             name}
            } type of data GraphQLList is used*/
//the books relationship here will grab the list of books associated with the author.
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    /* The reason for this to be a func is that, when we have multiple types and they
      have references to one another, then unless we wrap those fields in a func, one type
      might not necessarily know what another type is */
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
       // return _.filter(books, {authorId: parent.id});
        return Book.find({authorId: parent.id})
      }
    }
  })
});

//define root query
/*eg; {
        books {
          name
          genre
        }
      }
*/
/*
* the args parameter is defined if user request it with some id
* for eg; {book(id: '1') {
*            name
*            genre}
* }*/
// GraphQLID can accept string as well as int
// resolve func is responsible to look at the data and return it.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // in this func we can write what data we need from database
       // return _.find(books, {id: args.id});
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // in this func we can write what data we need from database
        //return _.find(authors, {id: args.id});
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return books;
        //when {} is passed in find it will return all data
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
       // return authors;
        return Author.find({});
      }
    }
  }
});

//Mutation for adding author & book
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        let authorData = new Author({
          name: args.name,
          age: args.age
        });
        //insertOne method of mongoose will save data to the db.
        return connection.collection('authors').insertOne(authorData);
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        let bookData = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        //insertOne method of mongoose will save data to the db.
        return connection.collection('books').insertOne(bookData);
      }
    }
  }
});

//import this schema in app file
//mutation: we are telling that the user can query using rootqueries and mutations
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')
const app = express()

// schema defines queries we can use
// const schema = new GraphQLSchema({
//     // query with : query { message }
//     query: new GraphQLObjectType({
//         name: "HelloWorld",
//         //fields define what we can query from object
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 // resolve determines how to translate / return field data
//                 resolve: () => "Hello World"
//             }
//         })
//     })
// })

const books = [
    { id: 1, name: "Book A", authorId: 1 },
    { id: 2, name: "Book B", authorId: 1 },
    { id: 3, name: "Book C", authorId: 1 },
    { id: 4, name: "Book 1", authorId: 2 },
    { id: 5, name: "Book 2", authorId: 2 },
]

const authors = [
    { id: 1, name: "Author A" },
    { id: 2, name: "Author B" },
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'A book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === books.authorId);
            }
        },
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.find(book => book.authorId === author.id);
            }
        },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id);
            }
        },
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                return authors.find(author => author.id === author.id);
            }
        },
        books: {
            type: GraphQLList(BookType),
            description: 'List of Books',
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'List of Authors',
            resolve: () => authors
        },
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log("Server started"))
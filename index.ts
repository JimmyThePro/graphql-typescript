import { buildSchema } from 'graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

export const users = [
    {id: 1, fullName: 'Jim Nilsson', adress: "Skolvägen 3", age: 66},
    {id: 2, fullName: 'Dan Olofsson', adress: "Ponnygatan 12", age: 23},
    {id: 3, fullName: 'Sara Larsson', adress: "Skogstorget 321", age: 54},
    {id: 4, fullName: 'Per Lind', adress: "Skalgatan 44", age: 39},
    {id: 5, fullName: 'Lotta Skog', adress: "Sommarsvängen 66", age: 73},
];

export const schema = buildSchema(`
    type Query {
        getUser(id: Int!): User
        getUsers: [User]
    }

    type User {
        id: Int!
        fullName: String!
        adress: String!
        age: Int!
    }

    input UserInput {
        fullName: String!
        adress: String!
        age: Int!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }
`);

type User = {
    id: number;
    fullName: string;
    adress: string;
    age: number;
};

type UserInput = 
    Pick<User, 'fullName' | 'adress' | 'age'>

const getUser = (args: { id: number }): User | undefined => 
    users.find(user => user.id === args.id);

const getUsers = (): User[] => users;

const createUser = (args: { input: UserInput}): User => {
    const user = {
        id: users.length + 1,
        ...args.input,
    }
    users.push(user);
    return user;
};

const updateUser = (args: { user: User  }): User => {
    const index = users.findIndex(user => user.id === args.user.id);
    const targetUser = users[index];

    if (targetUser) users[index] = args.user;
    return targetUser;
};

const root = {
    getUser,
    getUsers,
    createUser,
    updateUser,
};

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

const PORT = 3000;
app.listen(PORT);

console.log(`Running a GraphQL server at: http://localhost:${PORT}/graphql`); 

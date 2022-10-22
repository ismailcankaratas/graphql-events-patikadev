const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { events, locations, users, participants } = require('./data.json');

const typeDefs = `#graphql
    type User {
        id:ID!,
        username:String!,
        email: String!
    },
    type Event {
        id:ID!,
        title:String!,
        desc:String!,
        date:String!,
        from:String!,
        to:String!,
        localtion_id:String!,
        user_id:String!,
        user:User!,
        pariticipants:[Participant!],
        location:Location
    },
    type Location {
        id:ID!,
        name:String!,
        desc:String!,
        lat:Float!,
        lng:Float!,
    },
    type Participant {
        id:ID!,
        user_id:String!,
        event_id:String!,
    }
    type Query {
        # User
        users:[User!]
        user(id:ID!): User!
        # Event
        events:[Event!]
        event(id:ID!): Event!
        # Location
        locations:[Location!]
        location(id:ID!): Location!
        # Participant
        participants:[Participant!]
        participant(id:ID!): Participant!
    }
`;

const resolvers = {
    Query: {
        // User
        users: () => users,
        user: (parent, args) => users.find(user => user.id == args.id),
        // Event
        events: () => events,
        event: (parent, args) => events.find(event => event.id == args.id),
        // Location
        locations: () => locations,
        location: (parent, args) => locations.find(location => location.id == args.id),
        // Participant
        participants: () => participants,
        participant: (parent, args) => participants.find(participant => participant.id == args.id),
    },
    Event: {
        user: (parent) => users.find(user => user.id == parent.user_id),
        pariticipants: (parent) => participants.filter(participant => participant.event_id == parent.id),
        location: (parent) => locations.find(location => location.id == parent.location_id),
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
            // options
        })
    ]
});

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
})

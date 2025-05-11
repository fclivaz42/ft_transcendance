
// Create a class that will manage connections
// it should hold connections as a Set
// the class needs to have add, remove and broadcast methods
// the class can also have a Set of rooms
// need to write a function that will randomly generate a room code
// let's go with CCII (char char int int) i.e BG42
// find a way to use fastify.gamePlugin (from decorate call) to send back and forth information

export default async function websocketRoutes(fastify, options) {
    fastify.get('/ws', {websocket: true}, (connection, req) => {
        connection.socket.on("message", message => {
            console.log("Received message:", message.toString());
            connection.socket.send("hi from server");
        });
    });
}

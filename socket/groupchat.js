
module.exports = function(io, Users){

    const users = new Users();

    io.on('connection', (socket) => {
      console.log("connection successfull");

      socket.on('join', (params, callback) => {
        socket.join(params.room);
        users.addUserData(socket.id, params.name, params.room);
        //console.log(users);

        io.to(params.room).emit('usersList', users.getUsersList(params.room));

          callback();
      })

      socket.on('createMessage', (message, callback) => {
          console.log(message);

          io.to(message.room).emit('newMessage', { // you can use io.to or io.in
              text: message.text,
              room: message.room,
              from: message.sender,
              image: message.userPic
          });

          callback();
      });

      socket.on('disconnect', () => {
          var user = users.removeUser(socket.id);

          if(user){
            io.to(user.room).emit('usersList', users.getUsersList(user.room));
          }
      })

    });
}
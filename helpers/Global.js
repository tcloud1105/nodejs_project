class Global {
    constructor(){
        this.globalRoom = []; 
    }

    enterRoom(id, name, room, img){
        var roomName = {id, name, room, img};
        this.globalRoom.push(roomName);
        return roomName;
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.globalRoom.filter((user) => {
              user.id !== id;
            })
        }
        return user;
    }

    getUser(id){
      var getUser = this.globalRoom.filter((userId) => {
          return userId.id === id
      })[0];
      return getUser;
    }


    getRoomList(room){
        var roomName = this.globalRoom.filter((user) => {
            return user.room === room;
        });

        var namesArray = roomName.map((user) => {
           return {
               name: user.name,
               img: user.img
           }
        });

        return namesArray;
    }
}

module.exports = {Global};
class Users {
    constructor(){
        this.users = []; 
    }

    addUserData(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => {
              user.id !== id;
            })
        }
        return user;
    }

    getUser(id){
      var getUser = this.users.filter((userId) => {
          return userId.id === id
      })[0];
      return getUser;
    }

    getUsersList(room){
        var users = this.users.filter((user) => {
            return user.room === room;
        });

        var namesArray = users.map((user) => {
           return user.name;
        });

        return namesArray;
    }
}

module.exports = {Users};
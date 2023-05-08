const users = [];

function userJion(id, username, room) {
    const user = { id, username, room }

    const index = users.findIndex(user => user.username === username);
    index === -1 ? users.push(user) : console.log('username alreay exits')
    return user;
}


function userPop(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1);
    }
}

//get current user

function getUserName() {
    // const user = users.find(user => user.id === id);
    return users;
}

//get user room
function getRoomUsers(room) {
    const list = users.filter(user => user.room === room);
    return list;
}

// get users list in the room


module.exports = {
    userJion,
    getUserName,
    getRoomUsers,
    userPop
}
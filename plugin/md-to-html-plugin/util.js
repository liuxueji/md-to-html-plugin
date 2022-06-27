function randomNum() {
    return new Date().getTime() + parseInt(Math.random() * 1000);
}

module.exports = {
    randomNum
}
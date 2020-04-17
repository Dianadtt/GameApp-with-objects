function FetchApi(apiURL) {
    this.apiURL = apiURL
}
FetchApi.prototype.getGamesList = async function() {
    const response = await fetch(`${this.apiURL}/games`)
    return response.json()
}

FetchApi.prototype.deleteGameById = async function(gameID) {
    const response = await fetch(`${this.apiURL}/games/${gameID}`, {
        method: "DELETE"
    })
    return response.text()
}
FetchApi.prototype.createNewGame = async function(gameObject) {
    const response = await fetch(`${this.apiURL}/games`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: gameObject
    })
    return response.json()
}

FetchApi.prototype.updateGameRequest = async function(gameID, updateGameObj) {
    const response = await fetch(`${this.apiURL}/games/${gameID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: updateGameObj
    })
    return response.json()
}
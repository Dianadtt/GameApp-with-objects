function Game(id, title, imageUrl, description) {
    this._id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description

    this.fetchApi = new FetchApi("https://games-app-siit.herokuapp.com");
}

Game.prototype.render = function(mountContainer) {
    const gameElement = document.createElement("div");
    gameElement.setAttribute('id', this._id);
    this._updateDomElementForGame(gameElement);
    mountContainer.appendChild(gameElement);
}

Game.prototype._updateDomElementForGame = function(element) {
    element.innerHTML = `
    <h1>${this.title}</h1> 
    <img src="${this.imageUrl}" />
    <p>${this.description}</p> 
    <button class="delete-btn" game-id="${this._id}">Delete Game</button>
    <button class="update-btn" game-id="${this._id}">Edit Game</button>`;
    const self = this;
    element.getElementsByClassName('delete-btn')[0].addEventListener("click", async function(event) {
        event.preventDefault();
        await fetchApi.deleteGameById(event.target.getAttribute("game-id"))
        event.target.parentElement.remove();
    })
    element.getElementsByClassName('update-btn')[0].addEventListener("click", function(event) {
        event.preventDefault();

        self._showUpdateFormInDOM(event.target.parentElement);
    });
}

Game.prototype._showUpdateFormInDOM = function(domElement) {
    const form = document.getElementById("updateForm");
    const gameTitleElement = form.querySelector('input[name=gameTitle]');
    const gameDescriptionElement = form.querySelector('textarea[name=gameDescription]');
    const gameImageUrlElement = form.querySelector('input[name=gameImageUrl]');

    gameTitleElement.value = this.title;
    gameDescriptionElement.value = this.description;
    gameImageUrlElement.value = this.imageUrl;
    domElement.appendChild(form);

    const self = this;
    form.querySelector('button[id=saveGameBtn]').addEventListener('click', async function(e) {
        e.preventDefault();
        var urlencoded = new URLSearchParams();
        urlencoded.append("title", gameTitleElement.value)
            // urlencoded.append("releaseDate", self.releaseDate)
            // urlencoded.append("gender", self.gender)
            // urlencoded.append("publisher", self.publisher)
        urlencoded.append("imageUrl", gameImageUrlElement.value)
        urlencoded.append("description", gameDescriptionElement.value);
        const updatedGameFromApi = await fetchApi.updateGameRequest(self._id, urlencoded);
        if (updatedGameFromApi !== undefined) {
            self.title = updatedGameFromApi.title;
            self.imageUrl = updatedGameFromApi.imageUrl;
            self.description = updatedGameFromApi.description;
            const gameElement = document.getElementById(self._id);
            self._updateDomElementForGame(gameElement);
        }
        document.getElementById('formContainer').appendChild(form);
    });
    form.querySelector('button[id=cancelUpdateGameBtn]').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('formContainer').appendChild(form);
    });
}
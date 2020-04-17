const fetchApi = new FetchApi("https://games-world.herokuapp.com");

async function getGames() {
    const listOfGames = await fetchApi.getGamesList()
    const listGames = [];

    for (let i = 0; i < listOfGames.length; i++) {
        const gameDetail = listOfGames[i];
        const game = new Game(
            gameDetail._id,
            gameDetail.title,
            gameDetail.imageUrl,
            gameDetail.description
        );
        listGames.push(game)
    };
    //afisam jocurile in html
    const gamesContainer = document.querySelector(".container");
    for (let i = 0; i < listGames.length; i++) {
        listGames[i].render(gamesContainer);
    }
};
getGames()


function validateFormElement(inputElement, errorMessage) {
    if (inputElement.value === "") {
        if (!document.querySelector('[rel="' + inputElement.id + '"]')) {
            buildErrorMessage(inputElement, errorMessage);
        }
    } else {
        if (document.querySelector('[rel="' + inputElement.id + '"]')) {
            console.log("the error is erased!");
            document.querySelector('[rel="' + inputElement.id + '"]').remove();
            inputElement.classList.remove("inputError");
        }
    }
}

function validateReleaseTimestampElement(inputElement, errorMessage) {
    if (isNaN(inputElement.value) && inputElement.value !== "") {
        buildErrorMessage(inputElement, errorMessage);
    }
}

function buildErrorMessage(inputEl, errosMsg) {
    inputEl.classList.add("inputError");
    const errorMsgElement = document.createElement("span");
    errorMsgElement.setAttribute("rel", inputEl.id);
    errorMsgElement.classList.add("errorMsg");
    errorMsgElement.innerHTML = errosMsg;
    inputEl.after(errorMsgElement);
}

document.querySelector(".submitBtn").addEventListener("click", async function(event) {
    event.preventDefault();

    const gameTitle = document.getElementById("gameTitle");
    const gameDescription = document.getElementById("gameDescription");
    const gameGender = document.getElementById("gameGender");
    const gamePublisher = document.getElementById("gamePublisher");
    const gameImageUrl = document.getElementById("gameImageUrl");
    const gameRelease = document.getElementById("gameRelease");

    validateFormElement(gameTitle, "the title is required!")
    validateFormElement(gameGender, "the gender is required!")
    validateFormElement(gameImageUrl, "the image URL is required!")
    validateFormElement(gameRelease, "the release date is required!")

    validateReleaseTimestampElement(gameRelease, "The release date you provided is not a valid timestamp!");
    if (gameTitle.value !== "" && gameGender.value !== "" && gameImageUrl.value !== "" && gameRelease.value !== "") {
        var urlencoded = new URLSearchParams();
        urlencoded.append("title", gameTitle.value)
        urlencoded.append("releaseDate", gameRelease.value)
        urlencoded.append("gender", gameGender.value)
        urlencoded.append("publisher", gamePublisher.value)
        urlencoded.append("imageUrl", gameImageUrl.value)
        urlencoded.append("description", gameDescription.value)
        const newGameFromApi = await fetchApi.createNewGame(urlencoded)
        const newGame = new Game(newGameFromApi._id, newGameFromApi.title, newGameFromApi.imageUrl, newGameFromApi.description);
        var gamesContainer = document.querySelector(".container")
        newGame.render(gamesContainer);
    }
})
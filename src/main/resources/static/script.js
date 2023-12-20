window.addEventListener('DOMContentLoaded', (event) => {
    let gamestate = 'new';
    let playerCount = 1;
    let difficultyElem = "Easy";
    let turn = 1
    let sessionId = '';
    let size = 4;
    let botDifficulty = 'Easy';
    let requestPending = false;
    startUp().then(response => response.text())
        .then((response) => {
            sessionId = response;
        })
        .catch(err => console.log(err));
    const params = {
        gameId: "1001",
        size: "4",
        botDifficulty: difficultyElem
    };
    const queryString = new URLSearchParams(params).toString();

    async function startUp() {
        if (!requestPending) {
            requestPending = true;
            const message = await fetch(`http://172.203.234.53/connect`, {
                method: 'GET',
                credentials: 'include'
            });
            const message1 = await fetch(`http://172.203.234.53/newGame?${queryString}`, {
                method: 'GET',
                credentials: 'include'
            });
            requestPending = false;
            return message1;
        }
    }

    async function handleClick(){
        if (!requestPending) {
            requestPending = true;
            let className = parseInt(this.id.slice(-2));
            var img = this.children[0].src;
            if (img.includes('space-holder')) {
                if (turn % 2 == 1) {
                    this.children[0].src = img.slice(0, -16) + 'cross.png';
                } else {
                    this.children[0].src = img.slice(0, -16) + 'circle.png';
                }
                turn += 1;
                try {
                    let botMove = await fetch(`http://172.203.234.53/makeMove?position=` + className, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    let responseText = await botMove.text();
                    if (parseInt(responseText) < 10) {
                        responseText = '0' + parseInt(responseText);
                    }
                    var img1 = document.getElementsByClassName(`img` + responseText)[0];
                    if (turn % 2 == 1) {
                        img1.src = "./images/cross.png";
                    } else {
                        img1.src = "./images/circle.png";
                    }
                    turn += 1;
                } catch (error) {
                    console.error('Error:', error.message);
                }
            }
            requestPending = false;
        }
    }

    async function newGame() {
        const message1 = await fetch(`http://172.203.234.53/newGame?${queryString}`, {
            method: 'GET',
            credentials: 'include'
        });
        let images = document.querySelectorAll('.image');
        images.forEach((image) => {
            let prefix = image.src.split('images/')[0];
            image.src = prefix + 'images/space-holder.png';
        });
        requestPending = false;
        return message1;
    }

    async function changePlayers() {
        if (!requestPending) {
            requestPending = true;
            let playerCountButton = document.querySelectorAll('.player-button')[0];
            switch (parseInt(playerCountButton.textContent)) {
                case 1:
                    playerCount = 2;
                    break;
                case 2:
                    playerCount = 0;
                    break;
                case 3:
                    playerCount = 1;
                    break;
                default:
                    playerCount = 1;
                    break;
            }
            playerCountButton.textContent = playerCount + ' ' + playerCountButton.textContent.slice(2);
            const message = await fetch(`http://172.203.234.53/changePlayers?playerCount=` + playerCount, {
                method: 'GET',
                credentials: 'include'
            });
            requestPending = false;
            return message;
        }
    }

    async function changeDifficulty(){
        if (!requestPending) {
            requestPending = true;
            let difficultyButton = document.querySelectorAll('.difficulty-button')[0];
            let message = '';
            switch (difficultyButton.textContent) {
                case 'Easy':
                    message = await fetch(`http://172.203.234.53/changeDifficulty?difficulty=Medium`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    difficultyButton.textContent = 'Medium';
                    break;
                case 'Medium':
                    message = await fetch(`http://172.203.234.53/changeDifficulty?difficulty=Hard`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    difficultyButton.textContent = 'Hard'
                    break;
                case 'Hard':
                    message = await fetch(`http://172.203.234.53/changeDifficulty?difficulty=ML`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    difficultyButton.textContent = 'ML';
                    break;
                case 'ML':
                    message = await fetch(`http://172.203.234.53/changeDifficulty?difficulty=Easy`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    difficultyButton.textContent = 'Easy';
                    break;
                default:
                    break;
            }
            requestPending = false;
            return message;
        }
    }

    let newGameButton = document.getElementsByClassName('new-button')[0];
    newGameButton.addEventListener('click', newGame);

    let playerCountButton = document.getElementsByClassName('player-button')[0];
    playerCountButton.addEventListener('click', changePlayers);

    let difficultyButton = document.getElementsByClassName('difficulty-button')[0];
    difficultyButton.addEventListener('click', changeDifficulty);

    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
        square.addEventListener('click', handleClick);
    });
});
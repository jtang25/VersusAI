window.addEventListener('DOMContentLoaded', (event) => {
    let gamestate = 'new';
    let playerCount = 1;
    let difficultyElem = "0";
    let turn = 1
    let sessionId = '';
    let size = 4;
    let botDifficulty = 0;
    startUp().then(response => response.text())
        .then((response) => {
            console.log(response);
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
        const message = await fetch(`http://localhost:8080/connect`, {
            method:'GET',
            credentials:'include'
        });
        const message1 = await fetch(`http://localhost:8080/newGame?${queryString}`, {
            method:'GET',
            credentials:'include'
        });
        return message1;
    }

    async function handleClick(){
        let className = parseInt(this.id.slice(-2));
        var img = this.children[0].src;
        if (img.includes('space-holder')){
            if (turn % 2 == 1) {
                this.children[0].src = img.slice(0,-16)+'cross.png';
            }
            else {
                this.children[0].src = img.slice(0,-16)+'circle.png';
            }
            turn += 1;
            try {
                let botMove = await fetch(`http://localhost:8080/makeMove?position=${className}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                let responseText = await botMove.text();
                if (parseInt(responseText)<10){
                    responseText = '0'+responseText;
                }
                console.log(responseText);
                var img1 = document.getElementsByClassName(`img`+responseText)[0];
                console.log(img1);
                if (turn % 2 == 1){
                    img1.src = "./images/cross.png";
                }
                else {
                    img1.src = "./images/circle.png";
                }
                turn += 1;
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    }

    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
        square.addEventListener('click', handleClick);
    });
});
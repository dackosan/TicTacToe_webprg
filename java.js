window.onload = function(){
    let board = Array(9).fill(null);
    let currentPlayer = "X";
    let isGameOver = false;
    let isTwoPlayers = true;
    let smartBot = false;

    
    const checkWin = (player) => {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // sorok
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // oszlopok
        [0, 4, 8], [2, 4, 6]             // átlók
      ];
      return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
      );
    };

    const checkDraw = () => board.every(cell => cell !== null);

    const smartComputerMove = () => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        
        for (let i of emptyIndices) {
        board[i] = "O";
        if (checkWin("O")) {
            board[i] = null;
            return i;
        }
        board[i] = null;
        }

        for (let i of emptyIndices) {
        board[i] = "X";
        if (checkWin("X")) {
            board[i] = null;
            return i;
        }
        board[i] = null;
        }

        if (emptyIndices.includes(4)) {
            return 4;
        }

        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => emptyIndices.includes(index));
        if (availableCorners.length > 0) {
            return availableCorners[0];
        }

        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    const lameComputerMove = () => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    const renderBoard = () => {
        const boardDiv = document.getElementById("board");
        boardDiv.innerHTML = "";
        board.forEach((cell, idx) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            cellDiv.textContent = cell || "";
            cellDiv.addEventListener("click", () => handleCellClick(idx));
            boardDiv.appendChild(cellDiv);
        });
    };

    const handleCellClick = (idx) => {
        if (isGameOver || board[idx]) return;

        board[idx] = currentPlayer;
        renderBoard();

        if (checkWin(currentPlayer)) {
            document.getElementById("result").textContent = `${currentPlayer} játékos nyert.`;
            isGameOver = true;
            document.getElementById("reset").style.display = "block";
            return;
        }

        if (checkDraw()) {
            document.getElementById("result").textContent = "A játék döntetlen.";
            isGameOver = true;
            document.getElementById("reset").style.display = "block";
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (!isTwoPlayers && smartBot && currentPlayer === "O") {
            const move = smartComputerMove();
            board[move] = "O";
            renderBoard();

            if (checkWin("O")) {
                document.getElementById("result").textContent = `O játékos (számítógép) nyert.`;
                isGameOver = true;
                document.getElementById("reset").style.display = "block";
            } else if (checkDraw()) {
                document.getElementById("result").textContent = "A játék döntetlen.";
                isGameOver = true;
                document.getElementById("reset").style.display = "block";
            } else {
                currentPlayer = "X";
            }
        }
        else if (!isTwoPlayers && !smartBot && currentPlayer === "O"){
            const move = lameComputerMove();
            board[move] = "O";
            renderBoard();

            if (checkWin("O")) {
                document.getElementById("result").textContent = `O játékos (számítógép) nyert.`;
                isGameOver = true;
                document.getElementById("reset").style.display = "block";
            } else if (checkDraw()) {
                document.getElementById("result").textContent = "A játék döntetlen.";
                isGameOver = true;
                document.getElementById("reset").style.display = "block";
            } else {
                currentPlayer = "X";
            }
        }
    };

    const resetGame = () => {
        board = Array(9).fill(null);
        currentPlayer = "X";
        isGameOver = false;
        document.getElementById("result").textContent = "";
        document.getElementById("reset").style.display = "none";
        renderBoard();
    };


    renderBoard();
    document.getElementById("twoPlayers").addEventListener("click", () => {
        isTwoPlayers = true;
        resetGame();
    });

    document.getElementById("konnyuBot").addEventListener("click", () => {
        isTwoPlayers = false;
        smartBot = false;
        resetGame();
    });

    document.getElementById("taktikasBot").addEventListener("click", () => {
        isTwoPlayers = false;
        smartBot = true;
        resetGame();
    });
    
    document.getElementById("reset").addEventListener("click", resetGame);
}
const wordInput = document.getElementById("word");

const wordsElem = document.getElementById("words");

const wordSearch = document.getElementById("wordSearch");

const existsError = document.getElementById("existsError");
const smallError = document.getElementById("smallError");

existsError.style.display = "none";
smallError.style.display = "none";

let words = {};
const incorrect = new Audio("/incorrect.wav");
incorrect.volume = 1;
const correct = new Audio("/correct.wav");
correct.volume = 1;

const addWord = () => {
    const newWord = wordInput.value.toLowerCase();
    if (words[newWord.replaceAll(" ", "")]) {
        existsError.style.display = "block";
        return;
    };
    existsError.style.display = "none";
    wordInput.value = "";
    if (Object.values(words).length < 1) {
        wordsElem.innerHTML = "";
    };
    words[newWord.replaceAll(" ", "")] = true;
    const wordElem = document.createElement("button");
    wordElem.classList.add("tag");
    wordElem.innerText = newWord;
    wordElem.addEventListener("click", function () {
        delete words[newWord];
        if (Object.values(words).length < 1) {
            wordsElem.innerHTML = "No words have been added yet.";
        };
        this.remove();
    });
    wordsElem.insertAdjacentElement("beforeend", wordElem);
};

wordInput.addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
        addWord();
    };
});

document.getElementById("addWordBtn").addEventListener("click", addWord);

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rows = Array.from(new Uint8Array(width)).map(() => Array.from(new Uint8Array(height)).map(() => { }));
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                this.rows[row][col] = {
                    value: randomLetter(),
                    occupied: false,
                    position: {
                        row: row,
                        col: col
                    }
                };
            };
        };
    };
    get(row, col) {
        if (this.rows[row] && this.rows[row][col]) {
            return this.rows[row][col];
        };
    };
    set(row, col, newVal, correct) {
        if (this.rows[row] && this.rows[row][col]) {
            this.rows[row][col].value = newVal;
            this.rows[row][col].occupied = true;
            this.rows[row][col].correct = correct;
        };
    };
    unoccupy(row, col) {
        this.rows[row][col].occupied = false;
    };
};

const renderGrid = grid => {
    wordSearch.innerHTML = "";
    for (let row in grid.rows) {
        for (let col of grid.rows[row]) {
            wordSearch.innerHTML += `<letter${col.correct ? " data-correct=true" : ""}>${col.value}</letter>`;
        };
        wordSearch.innerHTML += "<br />";
    };
};

const randomLetter = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)];
};

document.getElementById("create").addEventListener("click", function () {
    const _words = Object.keys(words);
    if (_words.length < 1) {
        smallError.style.display = "block";
        return;
    };
    smallError.style.display = "none";
    wordSearch.innerHTML = "";
    const longest = _words.sort((a, b) => b.length - a.length)[0];
    let grid = new Grid(longest.length + 2, longest.length + 2);
    for (let word of _words) {
        for (let fits; !fits; fits = fits) {
            let direction = Math.round(Math.random() * 8);
            let startCol = Math.floor(Math.random() * grid.width);
            let startRow = Math.floor(Math.random() * grid.height);
            let newPos;
            let setCols;
            console.log(`rotation for ${word}`);
            switch (direction) {
                case 0: // top
                    setCols = true;
                    for (let offset = 0; offset < word.length; offset++) {
                        const col = grid.get(startRow - offset, startCol);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                    };
                    if (setCols) {
                        for (let offset = 0; offset < word.length; offset++) {
                            grid.set(startRow - offset, startCol, word[offset], true);
                        };
                        fits = true;
                    };
                    break;
                case 1: // top-right
                    setCols = true;
                    newPos = { row: startRow, col: startCol };
                    for (let i = 0; i < word.length; i++) {
                        const col = grid.get(newPos.row, newPos.col);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                        newPos.row--;
                        newPos.col++;
                    };
                    if (setCols) {
                        newPos = { row: startRow, col: startCol };
                        for (let i = 0; i < word.length; i++) {
                            grid.set(newPos.row, newPos.col, word[i], true);
                            newPos.row--;
                            newPos.col++;
                        };
                        fits = true;
                    };
                    break;
                case 2: // right
                    setCols = true;
                    for (let offset = 0; offset < word.length; offset++) {
                        const col = grid.get(startRow, startCol + offset);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                    };
                    if (!setCols) {
                        continue;
                    };
                    if (setCols) {
                        for (let offset = 0; offset < word.length; offset++) {
                            grid.set(startRow, startCol + offset, word[offset], true);
                        };
                        fits = true;
                    };
                    break;
                case 3: // bottom-right
                    setCols = true;
                    newPos = { row: startRow, col: startCol };
                    for (let i = 0; i < word.length; i++) {
                        const col = grid.get(newPos.row, newPos.col);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                        newPos.row++;
                        newPos.col++;
                    };
                    if (setCols) {
                        newPos = { row: startRow, col: startCol };
                        for (let i = 0; i < word.length; i++) {
                            grid.set(newPos.row, newPos.col, word[i], true);
                            newPos.row++;
                            newPos.col++;
                        };
                        fits = true;
                    };
                    break;
                case 4: // bottom
                    setCols = true;
                    for (let offset = 0; offset < word.length; offset++) {
                        const col = grid.get(startRow + offset, startCol);
                        console.log("ez", col || "undefined")
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                    };
                    if (setCols) {
                        for (let offset = 0; offset < word.length; offset++) {
                            grid.set(startRow + offset, startCol, word[offset], true);
                        };
                        fits = true;
                    };
                    break;
                case 5: // bottom-left
                    setCols = true;
                    newPos = { row: startRow, col: startCol };
                    for (let i = 0; i < word.length; i++) {
                        const col = grid.get(newPos.row, newPos.col);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                        newPos.row++;
                        newPos.col--;
                    };
                    if (setCols) {
                        newPos = { row: startRow, col: startCol };
                        for (let i = 0; i < word.length; i++) {
                            grid.set(newPos.row, newPos.col, word[i], true);
                            newPos.row++;
                            newPos.col--;
                        };
                        fits = true;
                    };
                    break;
                case 6: // left
                    setCols = true;
                    for (let offset = 0; offset < word.length; offset++) {
                        const col = grid.get(startRow, startCol - offset);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                    };
                    if (setCols) {
                        for (let offset = 0; offset < word.length; offset++) {
                            grid.set(startRow + offset, startCol, word[offset], true);
                        };
                        fits = true;
                    };
                    break;
                case 7: // top-left
                    setCols = true;
                    newPos = { row: startRow, col: startCol };
                    for (let i = 0; i < word.length; i++) {
                        const col = grid.get(newPos.row, newPos.col);
                        if (!col || (col && col.occupied)) {
                            setCols = false; console.log(grid);
                            break;
                        };
                        newPos.row--;
                        newPos.col--;
                    };
                    if (setCols) {
                        newPos = { row: startRow, col: startCol };
                        for (let i = 0; i < word.length; i++) {
                            grid.set(newPos.row, newPos.col, word[i], true);
                            newPos.row--;
                            newPos.col--;
                        };
                        fits = true;
                    };
                    break;
            };
            console.log("grid for rotation", grid);
        };
    };
    renderGrid(grid);
});

const blankGrid = new Grid(4, 4);
for (let row in blankGrid.rows) {
    for (let col in blankGrid.rows[row]) {
        blankGrid.set(row, col, "-");
    };
};
renderGrid(blankGrid);

addEventListener("click", function (e) {
    if (e.target.tagName == "LETTER") {
        if (e.target.dataset.correct) {
            e.target.style.color = "green";
            correct.play();
            correct.currentTime = 0;
        } else {
            e.target.style.color = "red";
            incorrect.play();
            incorrect.currentTime = 0;
        };
    };
});
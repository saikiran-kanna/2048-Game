function createBoard(){
    const grid = document.querySelector(".grid");
    for(let i = 0; i < 16; i++){
        const divi = document.createElement("div");
        divi.innerText = " ";
        divi.id = `${i}`;
        grid.append(divi);
    }
}
function generate(){
    let numArr = [2,2,2,2,2,2,2,2,2,4];
    const num = numArr[Math.floor(Math.random()*10)];
    let filteredBlocks = Array.from(document.querySelector('.grid').children).filter((item)=> item.textContent === " ");
    if(filteredBlocks.length == 0) return;
    let block = filteredBlocks[Math.floor(Math.random()*filteredBlocks.length)];
    block.innerText = num;
} 
function leftshift(arr){
    let filtered_arr = arr.filter(it => it != 0);
    for(let i = filtered_arr.length; i < 4; i++) filtered_arr.push(0);
    return filtered_arr;
}

function rightshift(arr){
    let filtered_arr = arr.filter(it => it != 0);
    for(let i = filtered_arr.length; i < 4; i++) filtered_arr.unshift(0);
    return filtered_arr;
}

function rowOperation(cb){
    const grid = Array.from(document.querySelector('.grid').children);
    let s = 0, e = 4;
    for(let i = 0; i < 4; i++){
        let new_arr = [];
        for(let j = s; j < e; j++){
            const val = parseInt(grid[j].innerText, 10);
            if(isNaN(val))
                new_arr.push(0);
            else
                new_arr.push(val);
        }
        let filtered_arr = cb(new_arr);
        let v = 0;
        for(let k = s; k < e; k++){
            if(filtered_arr[v] == 0){
                grid[k].innerText = " ";
            } else{
                grid[k].innerText = filtered_arr[v];
            }
            v++;
        }
        s += 4;
        e += 4;
    }
}

function coloumnOperation(cb){
    const grid = Array.from(document.querySelector('.grid').children);
    for(let i = 0; i < 4; i++){
        let new_arr = []
        for(let j = i; j < 16; j+=4){
            const val = parseInt(grid[j].innerText, 10);
            if(isNaN(val))
                new_arr.push(0);
            else
                new_arr.push(val);
        }
        let filtered_arr = cb(new_arr);
        let v = 0;
        for(let j = i; j < 16; j+=4){
            if(filtered_arr[v] == 0){
                grid[j].innerText = " ";
            } else{
                grid[j].innerText = filtered_arr[v];
            }
            v++;
        }
    }
}
function ShiftingTiles(direction){
    if(direction == 'L') rowOperation(leftshift);
    if(direction == 'R') rowOperation(rightshift);
    if(direction == 'U') coloumnOperation(leftshift);
    if(direction == 'D') coloumnOperation(rightshift);
}
function mergeOperationForRowL(arr){ 
    for(let i = 0; i < 3; i++){
        if(arr[i] == 0) continue;
        if(arr[i] == arr[i+1]){
            arr[i] += arr[i+1];
            arr[i+1] = 0;
            let curr_score = parseInt(document.querySelector('#score').innerText, 10);
            curr_score += arr[i];
            document.querySelector('#score').innerText = curr_score;
            break;
        }
    }
    return arr;
}
function mergeOperationForRowR(arr){ 
    for(let i = 3; i > 0; i--){
        if(arr[i] == 0) continue;
        if(arr[i] == arr[i-1]){
            arr[i] += arr[i-1];
            arr[i-1] = 0;
            let curr_score = parseInt(document.querySelector('#score').innerText, 10);
            curr_score += arr[i];
            document.querySelector('#score').innerText = curr_score;
            break;
        }
    }
    return arr;
}
function colorGrading(){
    const grid = Array.from(document.querySelector('.grid').children);
    grid.forEach(it => {

    });
}
function isGameOver(){
    const grid = Array.from(document.querySelector('.grid').children);
    let filtered_grid = grid.filter(it => it.innerHTML == " ");
    // console.log(filtered_grid);
    if(filtered_grid.length != 0) return false;
    let s = 0, e = 4;
    for(let i = 0; i < 4; i++){
        for(let j = s; j < e-1; j++){
            if(grid[j].innerText === grid[j+1].innerText)
                return false;
        }
        s += 4;
        e += 4;
    }
    for(let i = 0; i < 4; i++){
        for(let j = i; j < 12; j+=4){
            if(grid[j].innerText === grid[j+4].innerText)
                return false;
        }
    }
    return true;
}
function checkForWin(){
    const grid = Array.from(document.querySelector('.grid').children);
    let is2048 = [];
    is2048 = grid.filter(it => it.innerText == "2048");
    if(is2048.length != 0){
        document.querySelector('#result').innerText = "YOU WIN";
        document.querySelector('#result').style.color = "green";
        document.querySelector("body").removeEventListener("keyup", control);
    }
}

function restartGame(){
    const grid = Array.from(document.querySelector('.grid').children);
    grid.forEach(it => {
        it.remove();
    })
    document.querySelector("#score").innerText = 0;
    document.querySelector("#result").innerText = "Join the numbers and get to the 2048 tile!";
    document.querySelector("#result").style.color = "black";
    createBoard();
    generate();
    generate();
    document.querySelector("body").addEventListener("keyup", control);
}
function check(before){
    const after = document.querySelector('.grid').children;
    for(let i = 0; i < before.length; i++){
        if(before[i].innerHTML != after[i].innerHTML) return true;
    }
    return false;
}
const control = (e)=>{
    let prev_score = parseInt(document.querySelector('#score').innerText, 10);
    if(e.keyCode === 37){
        const grid = (document.querySelector('.grid')).cloneNode(true);
        ShiftingTiles('L');
        rowOperation(mergeOperationForRowL);
        ShiftingTiles('L');
        if(check(grid.children))
            generate();
    } 
    else if(e.keyCode === 40){
        const grid = (document.querySelector('.grid')).cloneNode(true);
        ShiftingTiles('D');
        coloumnOperation(mergeOperationForRowR);
        ShiftingTiles('D');
        if(check(grid.children))
            generate();
    } 
    else if(e.keyCode === 38){
        const grid = (document.querySelector('.grid')).cloneNode(true);
        ShiftingTiles('U');
        coloumnOperation(mergeOperationForRowL);
        ShiftingTiles('U');
        if(check(grid.children))
            generate();
    } 
    else if(e.keyCode === 39){
        const grid = (document.querySelector('.grid')).cloneNode(true);
        ShiftingTiles('R');
        rowOperation(mergeOperationForRowR);
        ShiftingTiles('R');
        if(check(grid.children))
            generate();
    }
    let curr_score = parseInt(document.querySelector('#score').innerText, 10);
    if(curr_score > prev_score)
        checkForWin();
    else if(isGameOver()){
        document.querySelector('#result').innerText = "Game Over!";
        document.querySelector('#result').style.color = "red";
        document.querySelector("body").removeEventListener("keyup", control);
    }
}
createBoard();
generate();
generate();
document.querySelector("body").addEventListener("keyup", control);
document.querySelector("#restart-button").addEventListener("click", restartGame);

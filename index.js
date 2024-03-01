function createBoard(){
    const grid = document.querySelector(".grid");
    for(let i = 0; i < 16; i++){
        const divi = document.createElement("div");
        divi.innerText = 0;
        divi.id = `${i}`;
        grid.append(divi);
    }
}
function generate(){
    let numArr = [2,2,2,2,2,2,2,2,2,4];
    let ind = Math.floor(Math.random()*10);
    const num = numArr[ind];
    let all_blocks = Array.from(document.querySelector('.grid').children);
    let filteredBlocks = all_blocks.filter((item)=> item.textContent == 0);
    if(filteredBlocks.length == 0) return false;
    let block = filteredBlocks[Math.floor(Math.random()*filteredBlocks.length)];
    block.innerText = num;
    block.style.visibility = "visible";
    return true;
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
            new_arr.push(parseInt(grid[j].innerText, 10));
        }
        let filtered_arr = cb(new_arr);
        let v = 0;
        for(let k = s; k < e; k++){
            grid[k].innerText = filtered_arr[v];
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
            new_arr.push(parseInt(grid[j].innerText, 10));
        }
        let filtered_arr = cb(new_arr);
        let v = 0;
        for(let j = i; j < 16; j+=4){
            grid[j].innerText = filtered_arr[v];
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
function scoreUpdate(){
    
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
function isGameOver(){
    const grid = Array.from(document.querySelector('.grid').children);
    let filtered_grid = [];
    filtered_grid = grid.filter(it => it.innerText == 0);
    if(filtered_grid.length == 0){
        let s = 0, e = 4;
        for(let i = 0; i < 4; i++){
            for(let j = s; j < e-1; j++){
                if(grid[j].innerText === grid[j+1].innerText){
                    return false;
                } 
            }
            s += 4;
            e += 4;
        }
        for(let i = 0; i < 4; i++){
            for(let j = i; j < 12; j+=4){
                if(grid[j].innerText === grid[j+4].innerText){
                    return false;
                } 
            }
        }
        return true;
    }
    else{
        return false;
    }
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
function blockZeros(){
    const grid = Array.from(document.querySelector(".grid").children);
    grid.forEach((it) =>{
        if(it.innerText == 0)
            it.innerText.style.visibility = "hidden";
        else
            it.innerText.style.visibility = "visible";
    })
}

const control = (e)=>{
    let prev_score = parseInt(document.querySelector('#score').innerText, 10);
    if(e.keyCode === 37){
        ShiftingTiles('L');
        rowOperation(mergeOperationForRowL);
        ShiftingTiles('L');
        generate();
    } 
    else if(e.keyCode === 40){
        ShiftingTiles('D');
        coloumnOperation(mergeOperationForRowR);
        ShiftingTiles('D');
        generate(); 
    } 
    else if(e.keyCode === 38){
        ShiftingTiles('U');
        coloumnOperation(mergeOperationForRowL);
        ShiftingTiles('U');
        generate();  
    } 
    else if(e.keyCode === 39){
        ShiftingTiles('R');
        rowOperation(mergeOperationForRowR);
        ShiftingTiles('R');
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
    // blockZeros();
}
createBoard();
generate();
generate();
document.querySelector("body").addEventListener("keyup", control);
document.querySelector("#restart-button").addEventListener("click", restartGame);
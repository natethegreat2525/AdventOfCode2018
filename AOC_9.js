
let str = ``;

let arr = str.split('\n');


let numP = 452;
let lastM = 7125000;


let scores = new Array(numP).fill(0);
let curMarb = {prev: null, next: null, val: 0};
curMarb.prev = curMarb;
curMarb.next = curMarb;
let curMblNum = 1;
while (true) {
    if (curMblNum % 23 === 0) {
        let curElf = curMblNum % numP;
        let score = curMblNum;
        let rm = curMarb.prev.prev.prev.prev.prev.prev.prev;
        score += rm.val;
        curMarb = rm.next;
        rm.next.prev = rm.prev;
        rm.prev.next = rm.next;
        scores[curElf] += score;
        //if (score == lastM) {
        //    break;
        //}
    } else {
        curMarb = curMarb.next;
        let nx = curMarb.next;
        let nw = {prev: curMarb, next: nx, val: curMblNum};
        nx.prev = nw;
        curMarb.next = nw;
        curMarb = nw;
    }
    if (curMblNum === lastM) {
        break;
    }
    curMblNum++;
}

let max = 0;
for (let i = 0; i < numP; i++) {
    max = Math.max(scores[i], max);
}

console.log(max);
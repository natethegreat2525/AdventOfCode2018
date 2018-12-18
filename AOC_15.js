var crypto = require('crypto');

class BinaryHeap {
  constructor(scoreFunction) {
    this.scoreFunction = scoreFunction;
    this.content = [];
  }
  push(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  }

  pop() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  }

  remove(node) {
    var length = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();
      // If the element we popped was the one we needed to remove,
      // we're done.
      if (i == length - 1) break;
      // Otherwise, we replace the removed element with the popped
      // one, and allow it to float up or sink down as appropriate.
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  }

  size() {
    return this.content.length;
  }

  bubbleUp(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n], score = this.scoreFunction(element);
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
      parent = this.content[parentN];
      // If the parent has a lesser score, things are in order and we
      // are done.
      if (score >= this.scoreFunction(parent))
        break;

      // Otherwise, swap the parent with the current element and
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  }

  sinkDown(n) {
    // Look up the target element and its score.
    var length = this.content.length,
    element = this.content[n],
    elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
        child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
        child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // No need to swap further, we are done.
      if (swap == null) break;

      // Otherwise, swap and continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
}

function log(obj) {
  console.log(JSON.stringify(obj, null, 4));
}

let solveSalesman = (dists, options, prev) => {
  let min = 99999;
  for (let k = 0; k < options.length; k++) {
    let cur = options[k];
    let curCost = dists[prev < options[k] ? prev + "," + options[k] : options[k] + "," + prev];
    let cpy = JSON.parse(JSON.stringify(options));
    cpy.splice(k, 1);
    let val = solveSalesman(dists, cpy, cur);
    min = Math.min(min, val + curCost);
  }
  if (min == 99999) {
    return 0;
  }
  return min;
};

function addPath(obj, a, b, weight, directional) {
  obj = obj || {};
  obj[a] = obj[a] || [];
  obj[a].push({"b": b, "weight": weight});
  if (!directional) {
    obj[b] = obj[b] || [];
    obj[b].push({"b": a, "weight": weight});
  }
  return obj;
}

//returns {path: [a, b, c...], weight: 0}
function findPath(graph, a, b) {
  let state = {
    score: 0,
    prev: null,
    state: {
      node: a
    }
  };
  if (!graph[a]) {
    return null;
  }

  let makeMoves = (s) => {
    return graph[s.state.node].map((n) => {
      return {
        score: s.score - n.weight,
        prev: s,
        state: {
          node: n.b
        }
      };
    });
  };

  let checkWin = (s) => {
    return s.state.node === b;
  };

  let val = optimizeMoves(state, makeMoves, checkWin);
  let path = [];
  let cur = val;
  if (!val) {
    return null;
  }
  while (cur) {
    path.push(cur.state.node);
    cur = cur.prev;
  }
  return {
    weight: val.score,
    path: path.reverse()
  };
}

//initState - starting state
//makeMoves - (state) => [newState1, newState2, newState3]
//checkWin - (state) => bool
//state - {score, state}
function optimizeMoves(initState, makeMoves, checkWin, hashFunc) {
  let prevState = {};
  let unprocessedMoves = new BinaryHeap(function(x){return -(x.score + (x.h || 0));});
  let putState = (s) => {
    let str = "";
    if (hashFunc) {
      str = hashFunc(s.state);
    } else {
      str = JSON.stringify(s.state);
    }
    if (prevState.hasOwnProperty(str)) {
        let other = prevState[str];
        if (other >= s.score) {
          return false;
        }
    }
    prevState[str] = s.score;
    unprocessedMoves.push(s);
    return true;
  };
  let popState = () => {
    return unprocessedMoves.pop();
  }
  putState(initState);
  let win = false;
  let cnt = 0;
  let lastScore = 0;
  while (!win) {
    cnt++;
    let state = popState();
    //if (cnt % 1000 == 0) {
      //console.log(cnt, state.score);
    //}
    if (!state) {
      return null;
    }
    //log(state);
    // if (state.score !== lastScore) {
    //   for (let s in prevState) {
    //     if (prevState[s] > lastScore) {
    //       delete prevState[s];
    //     }
    //   }
    //   lastScore = state.score;
    // }
    if (checkWin(state)) {
      return state;
    }
    let moves = makeMoves(state);
    for (let i in moves) {
      putState(moves[i]);
    }
  }
}

function greIdx(a) {
  var idx = 0;
  var val = -999999999;
  for (var i = 0; i < a.length; i++) {
    if (a[i] > val) {
      val = a[i];
      idx = i;
    }
  }
  return idx;
}

function gre(a) {
  idx = greIdx(a);
  return a[idx];
}

function lesIdx(a) {
  var idx = 0;
  var val = 999999999;
  for (var i = 0; i < a.length; i++) {
    if (a[i] < val) {
      val = a[i];
      idx = i;
    }
  }
  return idx;
}

function les(a) {
  idx = lesIdx(a);
  return a[idx];
}

function permutations(str){
var arr = str.split(''),
    len = arr.length,
    perms = [],
    rest,
    picked,
    restPerms,
    next;

    if (len == 0)
        return [str];

    for (var i=0; i<len; i++)
    {
        rest = Object.create(arr);
        picked = rest.splice(i, 1);

        restPerms = permutations(rest.join(''));

       for (var j=0, jLen = restPerms.length; j< jLen; j++)
       {
           next = picked.concat(restPerms[j]);
           perms.push(next.join(''));
       }
    }
   return perms;
}

function permutationsArr(str){
var arr = str,
    len = arr.length,
    perms = [],
    rest,
    picked,
    restPerms,
    next;

    if (len == 0)
        return [str];

    for (var i=0; i<len; i++)
    {
        rest = Object.create(arr);
        picked = rest.splice(i, 1);

        restPerms = permutationsArr(rest.splice(0));

       for (var j=0, jLen = restPerms.length; j< jLen; j++)
       {
           next = picked.concat(restPerms[j]);
           perms.push(next.splice(0));
       }
    }
   return perms;
}

let str = `################################
##########.###.###..############
##########..##......############
#########...##....##############
######.....###..G..G############
##########..........############
##########.............#########
#######G..#.G...#......#########
#..G##....##..#.G#....#...######
##......###..##..####.#..#######
#G.G..#..#....#.###...G..#######
#.....GG##................######
#....G........#####....E.E.#####
#####G...#...#######........####
####.E#.G...#########.......####
#...G.....#.#########......#####
#.##........#########.......####
######......#########........###
######......#########..E.#....##
#######..E.G.#######..........##
#######E......#####............#
#######...G............E.......#
####............##............##
####..G.........##..........E.##
####.G.G#.....####E...##....#.##
#######.......####...####..#####
########....E....########..#####
##########.......#########...###
##########.......#########..####
##########....############..####
###########...##################
################################`;

/*
str = `#########
#G..G..G#
#.......#
#.......#
#G..E..G#
#.......#
#.......#
#G..G..G#
#########`;

str = `#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`;

str = `#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`;

*/


//3 attack, 200 hp
let arr = [];
let combatants = [];
let elfDeath = false;
function setup() {
  arr = str.split('\n').map(a => a.split(''));
  combatants = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i][j] === 'E') {
        combatants.push({i: i, j: j, t: 'E', hp: 200});
      }
      if (arr[i][j] === 'G') {
        combatants.push({i: i, j: j, t: 'G', hp: 200});
      }
    }
  }
}

function resetRound() {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      let a = arr[i][j];
      if (a === 'E' || a === 'G') {
        arr[i][j] = '.';
      }
    }
  }
  for (let i = 0; i < combatants.length; i++) {
    let c = combatants[i];
    arr[c.i][c.j] = c.t;
  }
}

function initGraph() {
  let graph = {};
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i][j] !== '.') {
        continue;
      }
      if (arr[i+1][j] === '.') {
        addPath(graph, j + ',' + i, j + ',' + (i+1), 1, false);
      }
      if (arr[i][j+1] === '.') {
        addPath(graph, j + ',' + i, (j+1) + ',' + i, 1, false);
      }
    }
  }
  return graph;
}

function empty(i, j) {
  return arr[i][j] === '.';
}

let dirs = [[0,-1],[-1,0],[1,0],[0,1]].reverse();
function findShortestPaths(x1, y1, x2, y2, graph) {
  let g2 = JSON.parse(JSON.stringify(graph));
  if (empty(y2,x2+1)) {
    addPath(g2, x2 + ',' + y2, (x2+1) + "," + y2, 1, false);
  }
  if (empty(y2,x2-1)) {
  addPath(g2, x2 + ',' + y2, (x2-1) + "," + y2, 1, false);
  }
  if (empty(y2+1,x2)) {
  addPath(g2, x2 + ',' + y2, (x2) + "," + (y2+1), 1, false);
  }
  if (empty(y2-1,x2)) {
  addPath(g2, x2 + ',' + y2, (x2) + "," + (y2-1), 1, false);
  }

  let path = null;
  let minDist = 9999;
  for (let i = 0; i < 4; i++) {
    let loc1 = (x1+dirs[i][0]) + ',' + (y1+dirs[i][1])
    let loc2 = x2 + ',' + y2;
    let p = findPath(g2, loc1, loc2);
    if (!p) {
      continue;
    }

    if (p.path.length <= minDist) {
      minDist = p.path.length;
      path = p;
    }
  }
  return path;
}

function move(player, graph) {
  let paths = [];
  for (let i = 0; i < combatants.length; i++) {
    let c = combatants[i];
    if (c.t === player.t) {
      continue;
    }
    if (Math.abs(c.i - player.i) + Math.abs(c.j - player.j) === 1) {
      return;
    }

    let path = findShortestPaths(player.j, player.i, c.j, c.i, graph);

    if (path) {
      if (paths.length === 0) {
        paths.push(path);
      } else {
        if (path.path.length < paths[0].path.length) {
          paths = [path];
        } else if (path === paths[0].path.length) {
          paths.push(path);
        }
      }
    }
  }
  if (paths.length === 0 || paths[0].path.length === 1) {
    return;
  }

  paths.sort((a, b) => {
    let aa = a.path[a.path.length-2].split(',').map(c => parseInt(c))
    let bb = b.path[b.path.length-2].split(',').map(c => parseInt(c))
    return aa[1]*200 + aa[0] - (bb[1]*200 + bb[0]);
  });

  let newCoords = paths[0].path[0].split(',').map(c => parseInt(c));
  player.i = newCoords[1];
  player.j = newCoords[0];
}

function doAttack(player) {
  //log(player);
  let up = getCombatant(player, player.i-1, player.j);
  let down = getCombatant(player, player.i+1, player.j);
  let left = getCombatant(player, player.i, player.j-1);
  let right = getCombatant(player, player.i, player.j+1);
  let min = Math.min(up ? up.hp : 999, down ? down.hp : 999, left ? left.hp : 999, right ? right.hp : 999);
  if (min === 999) {
    return;
  }
  //log(min);
  let at = 3;
  if(player.t === 'E') {
    at = elfAttack;
  }
  if (up && up.hp === min) {
    up.hp -= at;
    //log(JSON.stringify(player) + "\n attacks \n" + JSON.stringify(up) + "\n")
    checkDie(up);
  } else if (left && left.hp === min) {
    left.hp -= at;
    //log(JSON.stringify(player) + "\n attacks \n" + JSON.stringify(left) + "\n")
    checkDie(left);
  } else if (right && right.hp === min) {
    right.hp -= at;
    //log(JSON.stringify(player) + "\n attacks \n" + JSON.stringify(right) + "\n")
    checkDie(right);
  } else if (down && down.hp === min) {
    down.hp -= at;
    //log(JSON.stringify(player) + "\n attacks \n" + JSON.stringify(down) + "\n")
    checkDie(down);
  }
}

function getCombatant(pl, i, j) {
  if (arr[i][j] === 'E' || arr[i][j] === 'G') {
    for (let k = 0; k < combatants.length; k++) {
      let c = combatants[k];
      if (c.i === i && c.j === j && c.t !== pl.t) {
        return c;
      }
    }
  }
  return null;
}

function checkDie(c) {
  if (c.hp <= 0) {
    if (c.t === 'E') {
      elfDeath = true;
    }
    for (let i = 0; i < combatants.length; i++) {
      let comb = combatants[i];
      if (comb.i === c.i && comb.j === c.j) {
        combatants[i].dead = true;;
        break;
      }
    }
  }
}

function doRound() {
  combatants.sort((a, b) => a.i * 200 + a.j - (b.i * 200 + b.j));
  for (let i = 0; i < combatants.length; i++) {
    let gex = false;
    let eex = false;
    let sum = 0;
    for (let a = 0; a < combatants.length; a++) {
      sum += combatants[a].hp;
      if (combatants[a].t === 'G') {
        gex = true;
      }
      if (combatants[a].t === 'E') {
        eex = true;
      }
    }
    if (!gex || !eex) {
      return sum;
    }
    resetRound();
    let graph = initGraph();
    let player = combatants[i];
    move(player, graph);
    doAttack(player);
    for (let k = 0; k < combatants.length; k++) {
      if (combatants[k].dead) {
        combatants.splice(k, 1);
        if (k < i) {
          i--;
        }
      }
    }
  }
}

function print() {
  for (let i = 0; i < arr.length; i++) {
    log(arr[i].join(''));
  }
  log("");
}

let elfAttack = 3;//1;

//while (true) {
  setup();
  print();
  let score = 0;
  for (let i = 1; i <= 470000; i++) {
    let val = doRound();
    if(val) {
      score = val * (i-1);
      break;
    }
    if (elfDeath) {
     // break;
    }
    resetRound();
    log("round " + i);
    print();  
  }
  if (!elfDeath) {
    log(elfAttack);
    log(score);
    //break;
  }

  elfAttack++;
  elfDeath = false;
//}


// str = `asdf asdf
// 234 jkh2 32jk`;
//
// log(crypto.createHash('md5').update("name").digest('hex'));
// log(crypto.createHash('md5').update("name").digest('base64'));
// log(crypto.createHash('md5').update("name").digest('latin1'));
//
// arr = str.split("\n").map((x)=>x.split(" "));
// console.log(arr);
//
// console.log(greIdx([1, 2, 5, 6, 2, 3, 1, -1]))
// console.log(gre([1, 2, 5, 6, 2, 3, 1, -1]))
// console.log(lesIdx([1, 2, 5, 6, -5, 3, 1, -1]))
// console.log(les([1, 2, 5, 6, -5, 3, 1, -1]))
//
// var heap = new BinaryHeap(function(x){return x;});
// [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5].forEach((x) => heap.push(x));
//
// heap.remove(2);
// while (heap.size() > 0)
//   console.log(heap.pop());


// let path = addPath({}, "a", "b", 1);
// path = addPath(path, "b", "c", 2);
// path = addPath(path, "c", "d", 1);
// path = addPath(path, "a", "d", 5);
// path = addPath(path, "b", "e", 1);
// path = addPath(path, "e", "c", .5);
// path = findPath(path, "a", "d");
// log(path);


//let win = optimizeMoves(state, makeMoves, checkWin);
//console.log(win);

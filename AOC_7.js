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

let str = `Step G must be finished before step M can begin.
Step T must be finished before step E can begin.
Step P must be finished before step M can begin.
Step V must be finished before step L can begin.
Step Y must be finished before step B can begin.
Step K must be finished before step Z can begin.
Step H must be finished before step I can begin.
Step D must be finished before step U can begin.
Step C must be finished before step L can begin.
Step R must be finished before step Z can begin.
Step U must be finished before step B can begin.
Step J must be finished before step M can begin.
Step M must be finished before step E can begin.
Step I must be finished before step X can begin.
Step N must be finished before step O can begin.
Step S must be finished before step F can begin.
Step X must be finished before step A can begin.
Step F must be finished before step Q can begin.
Step B must be finished before step Z can begin.
Step Q must be finished before step W can begin.
Step L must be finished before step W can begin.
Step O must be finished before step Z can begin.
Step A must be finished before step Z can begin.
Step E must be finished before step W can begin.
Step W must be finished before step Z can begin.
Step G must be finished before step R can begin.
Step H must be finished before step A can begin.
Step A must be finished before step W can begin.
Step Y must be finished before step D can begin.
Step O must be finished before step A can begin.
Step V must be finished before step U can begin.
Step H must be finished before step W can begin.
Step K must be finished before step F can begin.
Step J must be finished before step X can begin.
Step V must be finished before step R can begin.
Step Q must be finished before step A can begin.
Step F must be finished before step B can begin.
Step G must be finished before step P can begin.
Step L must be finished before step A can begin.
Step B must be finished before step Q can begin.
Step H must be finished before step J can begin.
Step J must be finished before step L can begin.
Step F must be finished before step E can begin.
Step U must be finished before step A can begin.
Step G must be finished before step Q can begin.
Step G must be finished before step S can begin.
Step K must be finished before step J can begin.
Step N must be finished before step B can begin.
Step F must be finished before step O can begin.
Step C must be finished before step Z can begin.
Step B must be finished before step E can begin.
Step M must be finished before step S can begin.
Step A must be finished before step E can begin.
Step E must be finished before step Z can begin.
Step K must be finished before step I can begin.
Step P must be finished before step A can begin.
Step Y must be finished before step L can begin.
Step Y must be finished before step J can begin.
Step G must be finished before step N can begin.
Step Q must be finished before step L can begin.
Step D must be finished before step X can begin.
Step C must be finished before step I can begin.
Step K must be finished before step B can begin.
Step N must be finished before step F can begin.
Step D must be finished before step M can begin.
Step B must be finished before step A can begin.
Step U must be finished before step J can begin.
Step Q must be finished before step Z can begin.
Step X must be finished before step F can begin.
Step K must be finished before step X can begin.
Step U must be finished before step E can begin.
Step X must be finished before step W can begin.
Step K must be finished before step Q can begin.
Step I must be finished before step E can begin.
Step D must be finished before step J can begin.
Step P must be finished before step I can begin.
Step K must be finished before step D can begin.
Step S must be finished before step X can begin.
Step C must be finished before step R can begin.
Step P must be finished before step W can begin.
Step I must be finished before step O can begin.
Step S must be finished before step O can begin.
Step K must be finished before step C can begin.
Step N must be finished before step Q can begin.
Step L must be finished before step E can begin.
Step L must be finished before step Z can begin.
Step K must be finished before step W can begin.
Step Y must be finished before step A can begin.
Step L must be finished before step O can begin.
Step N must be finished before step W can begin.
Step R must be finished before step W can begin.
Step C must be finished before step O can begin.
Step H must be finished before step X can begin.
Step V must be finished before step Y can begin.
Step S must be finished before step W can begin.
Step V must be finished before step E can begin.
Step Q must be finished before step E can begin.
Step P must be finished before step H can begin.
Step V must be finished before step H can begin.
Step N must be finished before step Z can begin.
Step C must be finished before step A can begin.`;



let arr = str.split('\n').map(a=>a.split(' ').filter(b=>b.length === 1));

let map = {};
let letters = {};
for (let i = 0; i < arr.length; i++) {
  if (!map[arr[i][0]]) map[arr[i][0]] = [];
  if (!map[arr[i][1]]) map[arr[i][1]] = [];

  map[arr[i][0]].push(arr[i][1]);
  letters[arr[i][0]] = true;
  letters[arr[i][1]] = true;
}
letters = Object.keys(letters);

let fin = [];
let done = {};

let workers = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0};
//let workers = {'1': 0, '2': 0};
let workersC = {'1': '', '2': '', '3': '', '4': '', '5': ''};
let second = 0;
let completed = true;
while (Object.keys(map).length > 0) {
  
  for (let wn in workers) {
    if (workers[wn] <= 0) {
      if (workersC[wn] !== '') {
        fin.push(workersC[wn]);
        delete map[workersC[wn]];
        workersC[wn] = '';
      }
    }
  }
  let root = [];
  for (let i = 0; i < letters.length; i++) {
    let flg = false;
    let chr = letters[i];
    if (done[chr]) {
      continue;
    }
    for (let c in map) {
      if (map[c].includes(chr)) {
        flg = true;
      }
    }
    if (!flg) {
      root.push(chr);
      //done[chr] = true;
    }
  }
  root.sort();

  for (let wn in workers) {
    if (workers[wn] <= 0  && root.length > 0) {
      let chr = root.shift();
      done[chr] = true;
      let cost = 61 + (chr.charCodeAt(0) - 65);
      workers[wn] = cost;
      workersC[wn] = chr;
    }
    workers[wn]--;
  }
  //log(second);
  //log(fin);
  //log(workers);
  second++;
}

log(second-1);

/*
let curList = root;
let finlist = [];
while (true) {
  let nextList = [];
  curList.sort();
  for (let i = 0; i < curList.length; i++) {
    finlist.push(curList[i]);

  }


}
*/

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

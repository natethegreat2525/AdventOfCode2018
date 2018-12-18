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

let str = `+19
-13
+3
+3
+3
+8
+11
+20
-19
+14
+13
+4
+18
+8
+17
+18
-13
+4
+4
+6
+2
+10
+13
-2
+1
-7
+14
-15
-2
+16
+15
-2
-8
-16
-18
-10
+20
+18
+9
+17
-9
-14
+7
-3
+20
+8
+12
-3
-3
+11
+19
+6
-2
-1
-10
+5
+11
+10
-8
+16
+4
+17
-9
-3
-8
+4
+11
+4
-3
+15
-6
+16
-19
-20
-6
+9
+2
-6
-3
-10
-8
+4
-16
+11
-10
+4
-2
+19
-13
+18
-13
-8
+18
-6
+1
+25
+18
+10
+13
-6
-18
+17
-13
-10
+15
-2
+14
+18
-5
-15
+18
-5
+6
+8
+2
-1
-2
+16
+16
-6
+11
+11
-15
+18
+1
-7
+1
-7
+8
-12
+7
+1
+15
+4
+10
+15
+19
-14
-19
+10
+12
-2
+4
+6
+8
+4
+17
-10
+5
-11
-16
-18
-18
-4
-10
+18
-7
+19
+9
-5
-18
-3
+11
-15
+6
-9
+1
-17
+15
-6
-20
-4
-3
+16
-15
+1
-20
+2
+13
+1
+7
-20
+10
-7
-11
+16
+19
-3
-22
+9
-4
-16
-2
-8
-3
-7
+3
+9
-19
-19
+11
+2
-15
+10
+9
-11
+10
+15
+1
+21
+6
-3
-22
+5
-14
-7
+25
+2
-36
-18
-7
+11
-15
+21
-13
+14
-19
-12
-4
-30
-4
-18
-7
-13
+8
-15
+6
+2
-9
+17
+3
+7
+4
+11
+5
-9
+3
+10
-18
+1
+2
+1
-7
+14
+4
+6
+22
-23
-4
-10
-20
-6
-10
-11
+1
+19
+12
+1
+18
-17
+19
-27
-8
-14
+10
-25
-24
-5
+14
-11
-1
-16
-12
-7
+17
-4
-18
+16
-12
-18
-16
-2
-5
-7
+1
+15
-10
+18
+4
+1
+13
+8
+19
+3
-9
+1
-13
-15
-1
+5
-18
-11
-3
-17
+18
+8
+1
+3
+18
-2
-5
+1
+14
-13
+7
+14
+21
-19
+2
+8
-15
+6
+15
+20
+5
+17
+14
-25
-10
+5
+18
-7
-13
-2
-9
-15
+10
-35
+15
+4
+37
-24
+14
+15
+2
-32
-34
-12
-12
-25
-19
-16
+10
-7
-10
+20
+17
+8
+16
-8
-1
-2
-12
+2
-7
+3
-5
-27
-8
-8
-2
+19
-15
-1
+24
-15
-3
-1
+3
-34
-16
+8
-24
+9
-8
-31
-7
-31
-33
-50
-11
+70
+60
+61
+12
+1
+56
+18
+39
-13
-5
+54
-48
-47
+137
-62
-76
-168
-329
-59773
-19
+4
+16
-6
-13
+6
+16
+5
-6
-5
+13
+9
-8
-15
-7
-14
+1
-10
-6
+18
+14
-18
+16
+19
-14
+11
+6
+5
-1
+18
-14
-15
+9
-16
+9
-3
-13
+2
-8
-3
+1
-10
-19
-17
-13
-3
-12
-14
-13
+15
-17
+8
-5
-7
-7
-3
-12
+18
-8
+4
+16
+3
-2
+6
+14
+6
+14
-8
+15
-3
+4
-17
-12
+22
-13
+7
-10
-8
+6
+19
+17
+2
+15
+18
-12
+2
-1
-3
-16
-14
+15
-19
+16
+15
+8
-11
-8
-13
-8
+15
-2
-4
-3
-18
+4
+1
-4
+9
-22
-6
-4
-22
+18
-13
-8
-15
-14
-5
-2
-3
-4
-11
-17
-18
-8
+9
-3
+11
+14
+15
-1
-9
-11
+19
-10
+8
+6
+16
-12
-13
+8
-12
-8
+6
-1
-11
+19
-16
+6
-14
-5
+11
-15
-11
+14
-19
-12
-1
+12
+4
+19
+7
-6
-17
+5
+10
-9
-2
-6
+10
-17
+16
-24
-13
+19
+1
-18
-1
+5
-2
-9
-5
-13
+5
-16
+4
+16
-12
+17
-11
-2
+14
-17
-2
+16
-17
-13
+1
-5
+6
-8
+4
-9
-5
-15
-15
+10
-16
+15
-16
-18
+16
-11
-3
-4
-7
+17
+1
-10
-15
-1
-8
+2
+11
+9
+10
+8
-4
-19
+9
+12
-10
+14
+19
-9
+6
-9
+14
+14
-5
+16
-9
+5
+21
-4
-14
-17
-15
+9
+19
-15
-15
-16
-6
-12
+10
+22
+11
-8
-8
+10
-8
+23
+10
-3
+17
+23
+17
-4
-9
+11
-8
+11
+18
-14
-16
+10
-4
+12
+13
+13
-16
+1
-6
+16
-12
+18
+19
+20
+21
-18
+12
+17
+9
+4
+2
-19
-9
-6
-14
-14
+5
+43
+5
+2
-18
+24
-3
-9
-23
+18
+7
-12
+25
+2
+12
+18
+8
-3
-17
-21
+5
+5
+16
+28
-15
-22
-15
+11
-24
-10
+28
+22
+18
+8
+26
+16
-4
+2
+17
-14
+28
+2
-32
-16
-6
-22
-18
-4
+13
+45
-6
+79
+7
+3
+8
-4
-5
+6
-7
+16
-20
-24
-24
-13
+7
+52
+21
-2
+21
+18
+17
-8
+27
-7
-19
+8
+7
+20
+2
+12
-16
-11
-20
+4
-28
-10
-32
-9
-3
+129
-7
+31
+2
+16
+27
-68
-45
-222
-27
-27
+19
+4
-58
+14
+27
-1
-119
-15
+68
-14
-46
-101
+16
-25
+58
-119
+11
-251
-59893
+1
-4
+17
+16
-12
-13
+1
+7
-6
+10
+11
-13
-16
-17
+6
+16
-12
+2
+15
-6
-19
+6
-15
+14
-16
-12
-15
-1
+20
+9
-5
-16
-4
+15
-8
-16
-14
-10
-7
-14
-6
+15
-4
-1
-12
-12
+2
+5
+15
-9
+6
-2
+15
+5
+10
-2
+4
+8
-15
-14
+20
-4
+18
+17
+3
+11
+12
+5
-18
-16
+19
+6
-17
+13
+14
-9
+1
+13
-12
-16
-5
-19
-18
+13
+14
+7
-3
+14
+5
-11
-13
-22
+4
+12
+2
-15
-13
+15
+1
-13
-12
-8
-5
-9
+7
+19
-8
+9
+16
+11
-33
+3
+5
-12
-20
-13
-7
+121412`;

let prev = {};

let a = str.split('\n');
let val = 0;
for (let j = 0; j < a.length*1000; j++) {
  let i = j % a.length;
  val += parseInt(a[i]);
  if (prev[""+val]) {
    log(val);
    break;
  }

  prev[val] = true;
}
log(val);


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

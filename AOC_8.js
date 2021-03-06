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

let str = `7 11 6 3 5 5 3 6 1 7 0 10 1 7 4 5 1 3 1 5 9 1 1 3 2 1 3 1 2 1 6 0 9 2 5 9 4 1 1 2 7 2 3 1 3 3 1 3 1 9 0 9 1 7 9 9 1 7 9 5 8 2 1 3 3 3 2 1 2 2 5 2 1 3 2 1 3 6 1 6 0 7 1 2 6 4 4 3 4 1 2 2 1 2 3 1 9 0 11 9 2 3 2 6 7 1 4 5 3 4 1 1 3 1 3 3 2 3 1 1 8 0 7 1 3 6 8 8 3 8 1 3 1 1 2 2 3 3 3 1 5 2 2 1 3 6 1 8 0 10 7 3 1 4 9 5 4 4 8 6 2 1 1 1 1 3 3 3 1 9 0 10 7 9 1 2 2 1 3 9 2 3 2 1 3 2 2 1 1 2 1 1 9 0 8 1 6 1 8 5 1 1 1 1 1 3 1 3 3 3 1 1 2 4 4 4 2 1 3 5 1 6 0 6 1 8 5 2 1 9 3 3 1 1 1 3 1 7 0 10 2 6 9 7 8 1 1 3 2 1 3 1 2 2 1 2 3 1 8 0 6 1 9 6 1 9 5 1 2 1 1 3 3 1 2 4 2 2 2 5 3 7 1 9 0 8 5 9 3 1 4 3 1 5 1 2 1 1 3 1 2 1 2 1 5 0 8 5 1 3 6 3 1 3 9 3 1 3 3 2 1 7 0 11 7 8 5 4 9 6 2 8 7 1 9 3 1 2 2 1 3 1 5 5 5 5 5 1 4 1 3 5 5 2 5 3 3 7 1 7 0 11 3 1 4 9 2 7 7 9 5 5 9 2 3 1 2 3 3 3 1 9 0 10 9 5 1 6 9 4 1 6 1 1 3 3 2 3 3 1 3 3 3 1 6 0 8 7 4 4 1 1 1 8 3 3 1 1 1 2 2 5 4 4 3 2 3 3 3 7 1 7 0 9 1 9 3 5 5 4 3 3 1 1 3 1 3 1 2 2 1 6 0 6 1 8 1 4 1 5 3 1 2 1 1 1 1 5 0 8 2 4 3 4 4 4 3 1 1 1 1 3 3 5 5 3 5 2 5 2 3 6 1 8 0 7 7 9 1 1 8 1 2 3 2 2 1 2 1 1 1 1 7 0 7 7 6 3 5 1 8 8 1 3 3 1 2 3 3 1 6 0 10 9 4 6 1 9 4 2 1 1 4 1 1 3 1 2 2 4 4 1 3 2 2 3 4 1 8 0 10 9 2 2 9 5 5 6 3 3 1 1 3 2 2 3 1 1 3 1 6 0 10 1 5 1 6 2 1 8 8 3 8 1 1 1 1 2 1 1 9 0 7 8 4 2 5 1 1 7 1 2 2 2 1 1 3 3 1 1 1 4 2 3 6 1 7 0 9 9 2 9 2 9 5 7 1 6 2 1 1 2 3 3 1 1 9 0 10 1 5 8 3 4 4 1 2 3 1 2 2 3 1 3 2 2 1 1 1 8 0 9 1 8 1 6 1 7 3 1 2 2 1 1 2 1 1 2 2 4 4 3 5 1 3 4 2 7 4 3 3 4 1 5 0 8 9 1 5 9 2 1 3 7 1 3 2 1 1 1 6 0 11 2 9 1 4 9 1 1 1 6 7 7 1 1 1 3 1 1 1 8 0 9 9 9 7 9 9 8 6 6 1 1 3 1 2 1 2 1 1 3 5 2 3 3 4 1 6 0 11 6 2 8 1 7 5 7 2 6 4 1 2 2 1 1 2 3 1 7 0 6 7 2 5 1 5 6 2 1 3 3 2 1 3 1 6 0 6 1 8 3 6 9 5 3 2 1 2 2 1 3 1 4 2 3 5 1 5 0 7 8 1 3 6 1 9 3 2 3 2 1 2 1 6 0 8 8 2 1 7 4 2 5 9 1 3 3 1 1 2 1 5 0 9 1 8 2 8 1 4 8 9 3 1 2 1 3 3 5 4 2 4 3 3 5 1 9 0 10 1 5 7 1 1 3 6 1 5 6 1 3 1 1 2 1 2 1 2 1 7 0 10 1 4 3 1 9 1 7 9 1 1 1 1 3 1 3 1 3 1 9 0 8 8 4 8 3 1 8 3 5 2 1 3 1 1 1 1 1 3 5 5 4 2 3 4 6 4 5 4 3 7 1 9 0 10 7 1 1 6 3 7 8 1 6 6 3 1 1 1 3 1 1 2 2 1 6 0 9 2 2 5 2 1 4 9 9 1 1 3 2 1 1 1 1 7 0 7 6 4 8 5 7 1 1 3 3 1 1 2 1 1 5 2 3 1 2 5 1 3 4 1 9 0 8 2 9 3 1 4 8 8 9 3 2 3 1 1 1 1 3 2 1 5 0 7 8 2 4 2 1 1 3 3 1 2 3 1 1 7 0 11 7 8 7 5 5 4 6 7 3 1 1 3 1 2 1 3 1 3 3 1 4 3 3 5 1 8 0 9 1 1 2 9 8 1 6 9 5 2 2 3 1 3 2 1 1 1 9 0 6 8 7 2 7 1 3 2 1 1 1 2 1 3 1 3 1 9 0 6 5 5 1 8 6 4 1 1 1 2 1 1 1 1 1 2 4 1 4 5 3 4 1 8 0 6 5 4 1 3 1 4 3 2 2 1 3 2 3 1 1 9 0 9 2 1 4 1 3 6 4 8 8 2 3 1 1 1 2 3 2 1 1 9 0 8 2 8 5 1 9 8 2 5 1 2 1 1 3 3 3 1 3 3 5 1 2 3 6 1 8 0 11 7 2 9 2 8 4 9 1 3 1 2 1 2 1 2 3 1 1 1 1 5 0 11 6 8 1 4 7 4 1 1 8 5 7 2 1 1 1 2 1 9 0 8 1 6 1 5 1 8 5 5 3 1 2 3 2 3 1 1 1 1 4 3 5 1 1 6 5 1 1 5 3 3 5 1 8 0 8 1 2 5 4 2 7 9 6 1 1 2 1 2 2 3 2 1 8 0 9 4 5 8 1 7 7 1 1 6 3 3 2 3 2 2 1 3 1 5 0 8 6 7 5 3 1 4 5 2 1 1 2 1 2 5 5 1 5 3 3 5 1 9 0 7 6 9 8 1 1 7 6 3 1 2 1 1 2 2 2 3 1 7 0 6 2 1 2 5 4 8 2 3 3 1 1 3 1 1 5 0 9 1 8 4 7 9 4 2 7 8 1 3 2 1 2 2 2 4 3 3 3 5 1 7 0 11 3 2 9 5 7 1 4 7 7 1 9 1 3 3 1 2 1 1 1 7 0 10 2 1 9 8 9 1 6 4 1 3 2 3 3 1 1 3 1 1 9 0 10 8 9 5 9 2 1 5 1 9 6 1 3 2 1 1 2 1 1 2 1 3 4 1 1 3 7 1 9 0 7 2 8 1 6 1 6 6 2 3 1 1 3 3 2 1 2 1 9 0 10 1 6 5 4 1 9 4 7 4 9 1 3 1 3 1 2 1 1 3 1 8 0 9 4 7 1 2 2 7 2 6 3 1 3 2 3 2 2 1 2 4 2 3 1 1 5 1 3 6 1 6 0 9 3 1 4 6 3 5 3 6 5 2 1 1 2 1 1 1 5 0 6 5 1 2 3 3 3 1 2 1 3 1 1 7 0 7 3 7 1 7 4 3 7 1 3 1 3 3 1 1 5 4 2 4 2 4 4 4 4 4 4 3 4 1 7 0 10 1 3 7 5 1 1 7 8 6 8 3 3 1 2 1 1 3 1 6 0 8 9 1 5 4 4 3 4 7 1 1 2 1 1 3 1 7 0 10 7 1 1 1 1 3 2 3 8 7 1 2 3 1 1 3 3 3 4 1 2 3 7 1 8 0 8 3 4 2 6 1 1 6 9 3 1 2 2 3 1 2 1 1 6 0 10 4 8 9 6 9 2 2 9 1 4 1 2 1 2 2 2 1 8 0 10 6 4 4 9 4 1 5 8 4 2 2 2 1 2 2 1 1 1 1 4 2 1 3 5 5 3 7 1 8 0 10 5 2 6 8 1 2 7 6 2 1 2 2 2 1 3 1 2 3 1 6 0 9 4 1 6 1 1 8 1 4 6 1 1 2 1 2 1 1 7 0 7 1 9 4 1 7 5 1 1 3 2 2 3 1 3 2 2 1 1 3 4 3 3 4 1 7 0 6 7 1 6 3 8 7 2 1 1 2 1 2 2 1 5 0 8 8 4 9 9 7 5 2 1 1 3 1 1 1 1 6 0 9 7 1 6 8 1 2 7 1 6 1 3 3 2 3 2 2 2 2 2 2 2 2 1 7 5 5 7 2 5 3 3 7 1 5 0 7 2 3 7 9 7 9 1 1 1 1 2 3 1 5 0 9 5 5 7 9 2 3 2 9 1 1 1 2 2 2 1 6 0 6 1 2 7 1 1 6 1 1 1 1 1 3 3 5 5 1 3 1 3 3 6 1 8 0 9 1 1 6 8 8 7 7 5 8 1 1 1 3 2 1 1 2 1 5 0 6 1 6 3 9 7 1 3 2 1 3 1 1 9 0 11 3 2 2 2 1 7 5 6 6 1 7 1 1 2 1 1 1 2 1 3 1 3 3 1 5 4 3 5 1 7 0 7 1 7 1 1 4 8 2 3 2 3 1 1 1 3 1 8 0 7 4 6 8 7 1 5 5 1 1 3 1 1 3 3 3 1 5 0 9 8 5 9 9 1 2 5 6 9 2 1 1 3 1 4 1 2 2 1 3 6 1 5 0 10 6 9 5 3 3 7 5 5 1 2 3 1 1 3 3 1 7 0 9 1 1 3 4 5 1 3 6 7 2 1 1 3 3 1 1 1 7 0 8 5 1 4 4 4 8 9 8 1 2 2 3 1 3 2 1 4 3 5 4 5 3 5 1 5 0 6 5 2 5 1 5 4 3 1 1 1 2 1 8 0 7 7 3 8 5 1 7 9 2 2 2 2 2 3 1 1 1 6 0 7 7 9 3 9 1 2 6 2 3 1 2 2 1 4 4 5 1 3 3 2 5 5 4 3 6 1 7 0 11 8 1 6 6 1 6 8 4 4 1 6 1 3 1 1 3 2 2 1 6 0 9 6 4 3 1 5 2 1 1 2 1 1 1 2 2 1 1 6 0 7 4 6 3 3 1 6 8 1 1 1 2 2 3 3 4 3 5 4 2 3 4 1 8 0 8 1 1 4 1 5 9 5 2 3 1 3 1 1 2 3 2 1 5 0 10 3 5 1 5 4 4 4 9 3 2 1 2 1 1 2 1 6 0 9 1 9 1 3 4 4 7 4 1 2 1 3 3 1 1 3 2 2 2 3 7 1 5 0 10 7 4 6 9 3 1 3 2 4 5 1 2 1 3 3 1 8 0 9 5 6 1 7 7 6 5 5 1 2 1 2 3 3 2 2 1 1 8 0 11 1 2 4 1 8 7 9 2 6 7 6 1 2 3 1 2 1 1 2 2 3 3 2 5 4 4 3 4 1 6 0 11 6 9 9 4 8 9 3 5 1 7 6 2 3 1 2 3 3 1 9 0 7 5 4 9 1 1 5 1 2 1 1 2 3 1 1 2 3 1 5 0 7 1 5 8 1 7 4 5 2 1 3 1 1 3 5 5 1 3 4 1 6 0 6 6 1 5 1 4 7 3 2 3 1 1 1 1 6 0 11 5 3 8 6 2 8 7 4 1 7 5 2 3 2 1 3 1 1 9 0 10 6 2 1 1 2 5 9 4 1 4 3 1 3 1 3 3 1 2 2 2 3 5 2 3 7 2 3 4 5 3 4 1 8 0 9 7 1 9 1 2 9 4 8 2 2 3 1 2 1 2 2 1 1 6 0 9 4 1 8 9 6 1 7 6 8 1 3 3 3 1 1 1 5 0 8 1 1 7 8 6 4 1 7 1 2 1 3 1 5 4 1 5 3 6 1 5 0 8 9 8 4 1 5 4 2 9 1 1 2 3 3 1 6 0 7 1 7 7 6 2 1 8 2 2 2 1 1 2 1 8 0 9 9 7 7 1 4 8 3 5 5 3 1 2 1 1 1 2 2 3 1 3 5 1 2 3 7 1 5 0 11 7 1 3 1 6 9 3 2 3 3 3 1 1 3 2 2 1 8 0 10 1 6 9 5 5 3 8 5 6 3 1 3 1 3 3 1 3 2 1 6 0 11 8 7 3 4 6 1 2 6 7 4 4 1 2 1 1 3 1 5 5 3 3 1 1 4 3 7 1 9 0 9 3 8 5 8 9 1 1 5 5 2 2 2 2 1 1 3 1 2 1 9 0 11 5 6 1 1 4 6 7 9 8 5 8 1 1 2 3 3 1 2 2 3 1 8 0 9 5 1 4 9 8 1 1 8 9 1 3 1 1 2 1 2 1 1 1 1 2 2 1 5 2 6 2 3 5 5 4 3 6 1 7 0 8 3 6 2 7 6 1 8 6 1 3 3 1 2 1 1 1 7 0 10 8 7 5 4 3 3 1 1 7 1 3 1 2 1 2 2 1 1 8 0 10 1 9 9 1 4 9 5 2 8 6 1 2 1 3 3 2 2 2 3 2 1 2 2 3 3 6 1 6 0 10 1 2 3 7 5 4 3 3 1 6 3 1 1 1 1 2 1 5 0 9 9 7 7 4 1 4 6 7 7 3 1 2 2 1 1 6 0 9 8 4 3 1 4 1 2 9 1 1 1 1 2 2 3 1 1 3 1 3 1 3 4 1 5 0 10 3 7 4 2 4 1 5 6 8 7 1 2 2 3 2 1 5 0 8 5 7 9 8 3 5 1 2 2 1 1 1 1 1 9 0 9 7 7 9 7 1 3 7 1 9 2 1 3 2 1 1 2 1 2 1 3 4 4 3 5 1 7 0 10 9 1 6 6 7 2 6 4 5 9 1 3 1 3 1 2 2 1 8 0 8 7 1 2 8 6 4 7 9 1 2 2 3 2 1 3 1 1 5 0 8 7 1 2 1 9 6 2 9 1 3 3 1 1 2 1 2 3 3 3 6 1 5 0 7 2 5 8 5 1 2 5 2 3 3 1 3 1 7 0 7 1 9 5 5 8 6 4 2 3 1 1 1 1 1 1 8 0 7 8 8 3 1 2 7 2 1 3 3 3 1 3 1 2 5 4 2 3 2 3 5 3 5 7 4 5 3 4 1 6 0 8 1 2 7 7 1 1 3 8 2 3 2 3 1 1 1 9 0 10 1 7 3 9 8 6 1 3 1 7 1 1 3 3 3 2 1 1 3 1 9 0 6 5 6 9 2 1 8 1 3 2 2 3 1 1 3 2 2 1 3 2 3 4 1 9 0 7 8 7 1 6 7 2 1 3 1 2 2 2 1 1 2 2 1 8 0 11 1 6 5 1 6 1 6 6 8 5 3 3 1 1 3 2 2 2 2 1 6 0 9 4 3 9 6 6 1 2 8 6 1 3 1 1 1 3 2 2 1 2 3 7 1 6 0 10 1 6 5 7 1 6 1 1 8 7 3 3 3 2 1 1 1 5 0 8 7 1 7 3 4 5 9 8 1 2 1 1 2 1 8 0 8 1 4 6 5 1 1 7 1 1 3 3 1 3 1 1 1 5 5 3 5 1 3 5 3 5 1 7 0 11 2 2 6 8 4 7 2 7 8 1 9 3 3 3 2 1 2 3 1 9 0 6 4 6 1 1 1 7 3 3 2 1 2 1 1 3 1 1 5 0 8 5 3 7 7 4 5 1 8 3 3 3 1 1 2 3 1 5 3 1 2 4 3 1 5 4 3 5 1 9 0 6 7 4 4 4 1 5 1 2 1 3 1 3 1 2 3 1 8 0 10 4 6 2 8 1 9 9 4 5 4 1 3 1 2 2 3 2 2 1 5 0 7 5 1 1 6 6 6 1 2 2 1 1 2 2 5 3 5 5 3 5 1 9 0 7 6 1 8 7 1 3 7 1 2 3 3 3 2 2 1 1 1 5 0 11 3 2 3 2 1 4 5 1 2 8 3 3 2 3 1 3 1 8 0 10 8 1 3 9 2 1 6 9 6 3 2 1 1 3 3 3 2 1 1 1 3 3 5 3 7 1 6 0 8 8 1 9 6 4 9 8 1 2 2 1 2 3 2 1 9 0 11 3 5 4 7 2 7 1 6 6 9 4 2 3 1 1 1 1 2 3 1 1 5 0 11 2 1 4 2 1 7 3 9 3 5 1 2 1 3 3 3 4 5 2 5 2 3 2 3 4 1 5 0 8 9 1 5 6 1 6 4 5 2 1 1 1 2 1 7 0 9 6 1 4 8 8 7 4 1 1 2 2 1 3 1 1 1 1 7 0 8 1 8 8 3 5 6 7 2 3 1 3 3 2 1 2 1 2 1 1 3 5 1 9 0 6 7 1 7 7 7 8 3 2 1 3 1 1 1 1 1 1 6 0 8 6 2 1 8 8 8 1 4 2 1 2 3 1 1 1 6 0 7 9 1 6 6 7 3 5 2 2 1 1 1 2 4 4 4 2 4 1 5 7 7 4 3 3 6 1 7 0 7 2 6 7 1 8 1 9 1 2 2 3 1 2 1 1 7 0 7 2 9 9 1 8 4 8 1 3 1 1 2 2 2 1 5 0 7 7 1 6 1 9 3 8 2 1 1 1 1 3 1 4 4 4 4 3 5 1 7 0 8 6 1 1 7 5 3 5 8 2 2 1 3 1 1 3 1 9 0 9 4 9 3 3 1 3 9 3 1 3 1 3 1 3 1 1 3 2 1 8 0 11 6 3 2 7 7 1 6 1 1 7 6 1 3 2 1 1 3 2 2 1 3 2 3 2 3 5 1 6 0 11 1 1 7 7 8 1 2 3 7 1 5 1 2 3 3 2 1 1 6 0 7 4 1 1 5 9 7 3 2 2 1 1 3 3 1 6 0 10 8 7 1 2 9 6 6 1 8 5 3 3 1 3 1 2 5 2 5 4 3 3 7 1 7 0 11 5 9 1 3 1 5 4 5 4 9 7 2 1 3 3 1 1 3 1 6 0 8 1 2 4 7 1 8 4 6 2 1 1 1 3 1 1 8 0 9 1 6 4 3 1 3 2 6 3 1 2 1 1 1 3 1 1 4 3 5 4 1 4 3 4 5 2 6 5 7 3 5 3 3 5 1 5 0 7 7 1 8 3 1 9 1 1 1 2 2 1 1 9 0 8 1 8 1 2 6 1 2 6 2 3 3 3 1 2 3 1 3 1 8 0 9 2 1 1 9 9 5 5 2 4 1 3 3 3 1 2 3 2 3 5 5 4 3 3 5 1 7 0 7 5 7 1 7 8 6 6 2 1 3 2 3 2 2 1 7 0 7 6 3 6 9 4 1 1 3 1 2 3 2 3 2 1 9 0 7 4 7 1 2 4 5 8 3 3 3 1 1 1 1 1 1 4 4 3 5 1 3 4 1 6 0 7 8 3 8 9 1 6 2 3 1 2 1 2 2 1 9 0 9 3 9 1 7 1 3 1 3 7 1 1 1 1 2 1 2 3 2 1 5 0 9 8 6 2 1 2 6 2 7 1 2 1 2 1 2 3 5 2 2 3 6 1 5 0 6 8 1 6 8 7 4 2 1 2 2 1 1 7 0 9 5 3 4 6 2 4 3 1 1 1 2 1 1 3 1 1 1 7 0 11 2 7 1 1 9 9 7 6 5 5 8 2 3 3 1 1 2 3 3 1 3 5 2 4 3 6 1 6 0 9 9 8 2 6 9 8 1 4 4 1 3 2 1 3 1 1 9 0 6 8 2 1 2 5 9 1 2 1 2 1 3 2 1 2 1 5 0 9 3 3 8 4 9 1 5 5 7 2 1 3 1 2 3 5 1 2 2 3 2 4 5 4 5 3 6 1 7 0 10 6 9 9 9 3 4 8 9 9 1 3 1 2 1 1 1 2 1 9 0 6 1 1 2 3 6 1 1 3 1 1 2 3 3 2 3 1 8 0 7 5 6 2 9 6 1 4 1 3 1 1 1 1 2 3 3 3 2 1 5 3 3 4 1 6 0 9 1 1 1 9 1 5 2 2 5 3 3 2 3 1 2 1 6 0 11 4 1 4 1 4 1 2 5 8 6 6 3 2 3 1 2 3 1 9 0 8 6 9 1 6 4 7 2 9 1 2 1 1 1 1 1 2 3 3 2 2 1 3 5 1 7 0 7 3 8 1 8 1 7 5 2 2 2 1 1 1 3 1 8 0 7 5 1 3 1 6 4 9 1 3 3 1 3 1 2 2 1 8 0 9 9 9 7 4 2 1 9 8 1 3 1 1 1 3 3 3 1 1 4 2 2 1 3 5 1 9 0 8 1 3 3 2 1 4 9 3 3 2 1 1 2 2 3 1 3 1 5 0 8 1 8 4 6 2 9 3 2 2 1 1 3 2 1 6 0 9 1 1 4 7 1 2 9 7 8 1 1 1 2 1 3 2 5 5 2 4 6 1 3 4 1 5 3 3 5 1 7 0 10 2 1 4 1 3 3 9 3 6 9 1 1 1 2 3 2 2 1 9 0 6 6 7 1 4 8 1 1 3 3 1 1 3 1 1 2 1 7 0 9 2 9 5 7 7 3 1 5 8 1 2 3 1 3 3 2 1 5 5 5 1 3 4 1 5 0 6 4 7 7 1 2 5 2 2 3 2 1 1 6 0 9 7 5 6 1 1 4 4 8 3 2 2 2 1 3 2 1 5 0 9 1 1 7 9 7 8 1 5 9 2 1 1 2 3 3 4 5 3 3 6 1 6 0 10 1 6 2 6 9 3 2 5 7 3 2 1 2 3 1 1 1 5 0 9 6 4 2 7 1 2 7 2 1 1 2 1 1 3 1 5 0 7 1 1 6 3 9 5 5 3 1 3 1 3 5 1 4 2 3 1 3 7 1 5 0 11 8 1 6 8 4 9 7 6 5 1 1 1 3 2 1 1 1 7 0 10 7 7 4 4 7 4 3 1 1 1 1 3 3 1 2 1 1 1 5 0 10 4 4 1 1 3 2 8 6 1 3 1 1 1 1 2 2 1 1 3 5 1 3 3 6 1 9 0 7 6 1 6 5 5 3 6 1 3 1 2 1 3 1 1 2 1 9 0 6 1 3 9 3 9 3 3 3 2 1 1 1 1 1 1 1 9 0 11 7 5 5 1 8 9 2 1 8 4 1 2 2 2 1 2 2 2 1 1 3 5 4 5 1 5 4 2 7 5 5 3 7 1 5 0 10 7 3 6 3 1 4 5 1 2 8 2 1 1 2 2 1 8 0 11 5 2 1 9 4 8 2 1 2 3 5 3 3 1 3 2 3 2 1 1 5 0 10 6 1 5 2 5 8 8 4 1 6 2 2 2 1 3 2 1 3 5 3 3 1 3 7 1 8 0 11 8 5 9 9 9 3 1 5 2 6 4 3 1 2 2 2 1 3 1 1 7 0 7 9 4 1 5 1 7 3 1 1 1 3 2 1 1 1 6 0 8 8 5 2 5 8 1 7 5 3 1 1 1 1 3 5 2 3 1 1 1 2 3 4 1 9 0 7 6 3 4 1 7 6 7 2 2 3 1 1 1 1 1 3 1 6 0 6 8 3 7 1 6 2 3 1 1 3 1 1 1 9 0 9 1 4 6 9 8 3 6 5 6 1 1 2 3 2 2 1 2 2 3 1 1 2 3 6 1 6 0 8 3 4 2 1 2 9 7 1 2 2 1 1 1 2 1 6 0 10 3 3 5 7 6 7 1 1 7 3 3 2 3 2 1 3 1 5 0 9 1 4 8 5 7 3 1 9 1 1 1 2 1 3 5 1 2 1 2 3 3 6 1 6 0 10 1 8 1 8 6 7 6 2 9 2 2 1 1 1 3 1 1 9 0 10 5 2 6 7 3 1 6 2 7 9 3 3 2 1 1 3 2 2 3 1 5 0 10 2 8 3 6 5 3 3 3 1 4 1 3 3 1 2 3 2 2 2 4 1 4 2 4 4 6 4 4 3 4 1 8 0 9 9 4 7 4 2 9 3 1 4 2 1 1 3 3 1 2 2 1 5 0 10 6 8 3 2 2 1 1 2 4 2 1 3 3 1 3 1 7 0 9 1 8 4 9 9 5 5 1 8 3 1 2 2 3 1 3 4 2 1 2 3 5 1 9 0 6 4 2 7 5 7 1 2 3 1 1 2 2 3 2 3 1 9 0 7 3 1 9 6 9 1 9 2 3 3 1 1 2 2 1 3 1 6 0 9 1 3 4 4 4 2 6 6 7 2 2 3 1 1 2 4 3 4 1 5 3 4 1 5 0 11 6 2 1 8 9 1 4 2 9 2 8 2 1 2 1 1 1 8 0 6 4 5 5 7 9 1 2 2 2 3 1 2 2 2 1 5 0 8 7 2 7 6 4 9 1 3 3 1 3 1 2 1 5 4 3 3 7 1 6 0 7 9 8 4 5 3 1 3 3 1 1 1 1 3 1 5 0 11 1 1 3 8 5 5 5 8 1 4 4 3 1 1 2 3 1 5 0 6 1 6 8 6 8 9 1 1 1 1 2 5 1 4 3 3 3 4 4 2 1 4 5 5 3 5 1 8 0 6 4 1 7 1 8 5 3 1 1 3 2 3 2 1 1 8 0 11 3 7 2 9 1 1 7 6 2 8 9 3 1 3 3 1 1 2 1 1 9 0 8 6 4 3 2 2 2 1 7 2 3 3 1 1 3 3 1 3 5 1 2 1 2 3 4 1 9 0 7 6 9 9 2 2 1 8 1 3 3 1 3 3 1 2 1 1 7 0 10 7 8 1 6 6 9 5 5 1 8 3 2 1 2 2 1 3 1 9 0 10 3 5 9 5 5 1 5 2 7 1 3 1 1 3 3 1 1 3 1 1 3 1 5 3 6 1 6 0 9 4 7 8 1 7 3 1 9 6 1 2 1 2 2 1 1 9 0 6 2 1 2 3 2 7 3 1 1 1 3 3 3 3 2 1 9 0 10 9 3 8 8 4 1 5 3 3 1 1 2 3 1 2 3 3 1 1 3 3 2 4 1 5 3 5 1 5 0 10 6 7 3 1 9 8 9 5 7 9 2 3 3 3 1 1 6 0 8 2 7 4 4 6 5 7 1 2 2 1 1 1 1 1 9 0 9 1 9 9 9 7 8 1 3 6 2 1 1 1 1 3 2 1 3 3 4 4 1 2 3 6 1 6 0 8 9 1 2 4 7 4 1 6 1 3 1 2 3 3 1 6 0 11 1 3 9 2 6 1 4 2 5 4 4 3 3 1 2 3 3 1 7 0 7 2 6 1 2 1 6 1 3 1 1 1 2 1 2 1 2 2 2 1 5 5 3 5 7 1 5 4 3 7 1 7 0 11 1 3 5 5 2 7 6 4 8 8 9 1 1 1 3 1 1 3 1 8 0 8 9 6 1 7 1 1 7 8 3 2 2 2 2 1 2 1 1 5 0 7 8 4 1 1 3 8 4 3 2 1 2 1 5 3 2 1 2 4 3 3 4 1 9 0 9 6 8 6 9 1 4 5 3 1 1 3 1 3 3 1 2 3 2 1 9 0 6 5 1 2 1 8 2 2 2 1 3 3 1 2 3 1 1 7 0 6 5 1 8 1 6 2 1 3 2 3 2 3 3 3 1 4 3 3 7 1 6 0 9 2 1 1 5 8 1 9 5 5 1 1 1 2 1 1 1 6 0 11 8 4 6 4 2 7 4 3 1 7 1 1 3 1 3 1 1 1 7 0 6 5 9 4 2 1 1 1 3 2 2 2 3 1 4 4 4 4 5 3 2 3 6 1 9 0 8 1 7 4 5 7 1 2 1 3 1 1 3 3 2 1 1 2 1 9 0 11 2 8 8 1 2 7 5 5 6 1 4 3 2 2 1 1 1 2 2 1 1 6 0 9 4 7 8 1 7 1 8 7 2 3 3 1 3 2 1 2 3 5 1 4 5 3 5 1 9 0 11 9 7 2 9 9 8 1 1 2 9 1 1 2 2 1 2 2 3 3 3 1 8 0 9 4 5 7 1 7 1 9 5 2 1 2 1 3 2 1 3 1 1 9 0 8 7 1 5 2 5 5 8 9 3 3 3 2 3 2 1 2 3 3 2 2 3 3 3 5 1 1 5 4 2 6 3 4 3 3 7 1 6 0 8 1 2 7 9 8 9 5 3 1 2 1 2 3 1 1 5 0 8 2 7 6 9 1 7 1 3 3 3 2 2 1 1 7 0 6 8 1 1 4 6 2 1 3 1 1 2 3 1 3 1 2 2 5 5 1 3 7 1 5 0 11 4 6 8 1 7 1 9 3 8 3 3 2 3 1 2 3 1 5 0 7 2 4 1 5 4 8 1 1 1 3 2 2 1 8 0 7 8 6 7 8 1 1 8 1 3 3 2 3 2 2 3 5 3 4 1 2 3 5 3 6 1 7 0 10 4 5 4 8 1 7 6 2 5 9 1 3 3 2 3 1 1 1 6 0 11 3 4 6 8 6 9 1 9 3 3 2 3 2 2 2 1 1 1 8 0 6 7 4 1 4 2 5 1 1 3 2 1 2 3 1 3 4 4 5 1 2 3 5 1 5 0 10 8 1 4 3 3 1 3 8 5 1 1 1 1 1 2 1 8 0 9 1 5 7 5 6 8 8 1 3 3 1 2 1 1 3 2 3 1 9 0 9 9 2 4 2 9 7 9 1 3 3 1 2 2 2 2 1 1 1 4 3 5 3 1 5 1 5 5 5 3 6 1 6 0 8 6 9 4 3 5 4 1 1 2 1 1 2 3 1 1 5 0 11 8 2 3 9 3 7 9 7 5 1 8 1 3 1 1 1 1 9 0 9 7 8 1 3 1 6 4 7 3 3 1 2 2 2 1 3 3 1 5 1 2 1 1 2 3 6 1 8 0 8 4 1 4 5 8 2 8 6 1 2 1 1 3 1 3 2 1 7 0 9 1 3 9 1 8 2 1 1 9 3 1 3 3 3 2 2 1 8 0 7 5 1 2 9 2 2 5 1 2 3 3 2 3 1 2 2 3 2 3 5 4 3 5 1 6 0 6 1 4 1 6 4 4 1 2 1 1 1 1 1 9 0 8 7 9 8 2 6 1 8 3 3 1 3 1 3 1 1 1 3 1 8 0 9 6 1 8 9 5 1 7 2 8 3 3 1 1 3 3 3 2 3 4 3 1 5 3 7 1 6 0 8 8 2 7 1 4 7 2 3 1 3 1 1 3 2 1 7 0 7 4 1 2 1 1 3 9 1 3 3 2 3 3 1 1 6 0 10 1 6 1 4 3 1 9 3 7 4 3 1 2 3 3 1 1 3 3 2 2 5 1 3 6 1 9 0 11 9 5 1 4 7 6 2 4 1 2 2 2 1 1 1 2 2 2 1 3 1 5 0 7 2 1 7 7 1 2 1 1 1 3 1 3 1 9 0 9 7 9 4 7 6 6 6 1 9 1 1 3 2 2 1 1 2 3 1 2 5 2 5 2 1 1 1 7 2 4 4 3 5 1 9 0 6 5 1 3 8 2 1 2 1 1 2 2 1 2 2 2 1 6 0 8 9 9 7 1 3 8 1 2 2 3 1 2 2 1 1 5 0 9 1 4 7 9 5 3 7 1 7 2 2 2 1 1 1 2 1 1 2 3 7 1 5 0 10 4 9 6 2 4 1 6 6 3 5 2 1 1 2 3 1 6 0 7 1 4 9 7 5 5 1 2 1 1 2 1 3 1 6 0 10 5 3 2 3 2 5 9 6 1 2 1 3 1 1 2 1 2 4 4 5 4 3 1 3 6 1 5 0 9 1 1 2 4 7 8 4 7 3 1 2 3 1 1 1 7 0 11 6 4 2 6 7 4 1 2 2 3 1 1 2 3 2 2 2 3 1 7 0 8 9 1 7 8 8 2 3 1 1 3 3 2 1 1 2 3 1 2 2 2 5 3 6 1 6 0 9 8 6 5 9 7 1 1 2 7 1 3 2 3 1 1 1 8 0 7 6 1 8 5 7 7 1 1 1 1 1 2 1 3 2 1 8 0 11 9 1 6 6 1 9 1 7 2 8 1 1 1 2 3 3 3 3 1 1 5 1 2 3 2 2 3 2 2 5 4 3 6 1 8 0 6 8 8 1 9 4 1 1 1 2 2 3 3 3 3 1 9 0 10 5 5 6 3 5 1 3 6 3 4 2 2 2 3 2 1 3 2 1 1 7 0 8 4 1 1 8 4 6 6 7 3 1 1 3 2 1 1 3 1 2 3 3 2 3 6 1 6 0 6 8 1 2 6 3 9 1 3 3 3 1 3 1 5 0 8 2 1 2 4 4 9 3 1 1 1 1 1 1 1 7 0 7 1 5 1 5 3 2 1 1 1 1 1 2 1 3 5 2 1 2 3 2 3 5 1 5 0 9 9 2 5 4 4 1 3 1 9 3 1 3 1 3 1 5 0 8 6 2 1 8 3 5 5 4 1 2 2 1 1 1 8 0 6 8 4 2 1 3 7 1 1 3 3 1 2 2 1 3 3 3 1 1 3 7 1 6 0 11 4 6 6 6 7 7 8 9 1 8 4 2 1 3 1 1 2 1 6 0 9 3 4 5 4 1 6 2 7 3 1 1 1 2 1 1 1 9 0 6 6 7 1 1 8 1 3 1 3 2 2 1 1 1 1 4 4 1 3 3 5 3 3 6 1 8 0 7 1 1 6 5 8 2 4 1 3 3 3 3 3 1 3 1 8 0 7 8 9 1 6 7 1 9 2 2 3 2 1 2 2 1 1 5 0 7 1 9 1 9 2 5 2 3 3 2 1 1 4 5 4 1 4 1 5 4 5 6 5 3 3 6 1 6 0 6 3 8 2 6 1 6 2 3 1 2 2 3 1 8 0 9 9 5 4 5 9 7 1 3 9 2 3 1 3 1 2 1 1 1 7 0 10 3 5 3 8 5 5 1 7 2 6 1 2 1 3 3 2 2 4 4 1 2 4 3 3 7 1 8 0 6 8 5 4 1 1 5 1 1 2 2 3 3 1 1 1 6 0 10 7 3 3 1 9 9 5 1 1 2 1 3 1 3 3 1 1 5 0 9 1 1 1 8 9 3 1 7 2 1 2 1 3 1 4 2 5 5 1 2 4 3 4 1 7 0 11 7 6 1 3 4 1 4 4 3 5 8 1 2 3 1 1 1 1 1 5 0 7 1 1 9 5 1 4 9 1 2 3 1 3 1 9 0 10 1 4 9 1 2 1 3 2 1 4 1 1 1 1 2 2 1 3 2 3 1 2 3 3 4 1 8 0 6 3 8 1 1 5 2 2 1 1 3 1 3 1 3 1 9 0 7 1 2 5 6 7 3 1 2 3 1 2 3 3 2 2 1 1 9 0 9 1 1 1 3 9 6 1 9 4 3 2 1 2 3 2 3 3 1 2 4 4 5 3 5 1 8 0 10 8 9 1 6 4 5 8 5 8 3 1 2 1 2 1 1 1 3 1 9 0 10 4 1 7 8 3 7 1 7 5 6 1 1 2 3 3 3 3 1 1 1 7 0 9 2 1 4 2 6 3 1 9 4 1 3 1 1 3 2 3 5 3 1 1 2 5 6 3 5 4 3 6 1 5 0 9 5 7 6 2 5 2 8 2 1 1 3 3 3 1 1 9 0 8 1 1 2 1 1 4 1 5 2 2 1 1 3 1 3 1 1 1 9 0 6 9 7 6 5 1 8 3 1 3 2 1 1 2 3 1 1 4 2 4 3 3 3 6 1 5 0 9 3 4 1 6 6 5 4 4 4 1 1 2 3 1 1 9 0 6 9 1 1 7 7 8 2 1 1 2 1 3 1 1 1 1 5 0 6 3 6 1 7 7 9 2 2 1 1 1 1 4 4 2 4 2 3 4 1 8 0 7 1 3 1 9 6 3 1 1 2 1 2 2 3 3 3 1 8 0 9 3 2 5 1 1 2 1 9 8 3 3 1 3 1 1 3 2 1 5 0 8 1 4 3 8 9 3 5 5 3 2 3 1 1 1 3 3 2 3 5 1 7 0 10 8 9 7 4 7 8 2 5 1 1 3 2 2 2 2 1 2 1 5 0 6 3 4 1 1 2 6 1 1 2 3 1 1 5 0 11 1 5 9 9 5 1 1 7 2 4 6 1 3 1 3 3 2 5 5 5 1 3 5 1 6 0 8 8 1 7 9 8 4 1 1 1 3 3 2 1 3 1 7 0 7 8 1 8 3 8 7 8 2 2 2 1 2 3 3 1 5 0 6 4 1 2 5 5 1 1 1 2 1 1 1 4 4 1 5 4 4 5 1 7 5 5 6 3 5 5 3 4 1 6 0 11 5 8 5 5 2 1 4 2 6 2 1 1 1 2 1 1 1 1 7 0 11 1 5 3 4 8 6 6 8 5 1 6 2 1 3 3 2 1 1 1 6 0 8 8 1 1 4 4 6 4 6 2 1 1 1 3 1 1 4 2 1 3 5 1 5 0 10 4 7 2 5 1 3 9 5 7 4 1 1 2 3 1 1 6 0 11 2 4 3 2 7 7 9 1 1 2 6 1 1 3 3 2 1 1 8 0 10 5 5 2 3 8 6 3 1 6 7 2 1 3 2 1 3 3 2 1 2 5 3 4 3 4 1 9 0 11 1 1 5 9 9 3 4 1 9 8 3 3 2 2 3 1 1 3 1 2 1 6 0 10 9 8 2 5 4 6 1 1 9 5 1 3 2 1 3 2 1 5 0 11 4 9 3 9 4 9 4 4 2 1 4 1 1 2 3 2 1 3 3 2 3 5 1 7 0 7 3 1 5 2 6 3 2 2 3 1 2 3 3 1 1 9 0 7 7 6 1 3 9 4 1 2 1 1 1 1 1 1 2 3 1 6 0 11 8 1 6 5 1 4 9 3 5 7 8 3 1 1 3 3 1 2 3 2 5 1 3 4 1 7 0 10 7 6 1 8 3 8 1 9 1 1 1 2 1 1 3 3 3 1 9 0 8 2 4 4 7 1 5 6 1 3 3 2 3 2 1 1 2 2 1 8 0 11 6 1 4 6 6 9 9 6 5 6 4 3 3 1 3 3 1 1 3 1 4 4 5 2 4 4 7 3 5 3 3 4 1 6 0 7 5 9 4 7 4 1 6 3 1 2 3 1 1 1 8 0 6 2 1 6 9 1 8 1 1 1 2 2 1 2 2 1 9 0 9 7 5 2 8 1 1 2 3 9 3 3 1 1 1 3 3 1 1 2 1 2 4 3 6 1 6 0 8 5 1 6 6 1 7 3 5 2 1 2 2 1 3 1 8 0 8 9 8 5 3 8 5 1 7 1 3 1 1 3 2 2 3 1 5 0 6 9 3 8 1 2 6 2 1 3 1 3 2 5 1 5 2 4 3 7 1 8 0 6 9 7 3 6 1 2 3 3 3 2 3 1 1 1 1 7 0 8 4 2 8 3 1 9 1 3 1 3 1 2 1 1 2 1 5 0 8 4 4 1 4 3 2 4 8 1 1 3 1 2 2 2 3 2 5 2 1 3 4 1 7 0 10 7 6 8 5 5 7 1 4 1 3 2 2 3 3 3 1 1 1 8 0 9 4 4 5 2 3 7 8 1 7 3 1 1 1 1 1 3 2 1 6 0 9 4 8 5 4 8 7 1 4 5 3 3 2 3 1 3 1 2 4 1 3 4 1 7 0 8 8 8 6 2 5 4 1 5 3 3 3 2 1 3 1 1 8 0 8 1 1 1 4 9 7 2 6 3 2 2 3 3 1 1 1 1 5 0 10 1 1 8 4 1 8 9 8 5 6 1 1 2 2 3 3 2 1 1 5 4 3 5 4 3 7 1 5 0 11 9 4 9 2 8 1 3 2 7 3 7 2 1 2 3 1 1 8 0 9 3 3 1 2 3 6 1 4 6 3 1 3 3 1 1 1 1 1 9 0 6 1 9 6 4 2 9 1 3 1 1 1 1 2 2 3 4 4 1 5 1 4 2 3 6 1 9 0 10 2 1 4 5 5 9 9 7 6 1 1 3 1 1 2 2 1 3 3 1 5 0 9 6 1 2 1 1 8 6 3 9 2 3 3 1 3 1 7 0 8 7 8 9 8 3 3 1 8 2 2 1 1 2 1 2 3 1 1 1 2 5 3 6 1 7 0 7 2 7 4 3 2 7 1 1 2 2 3 2 2 2 1 7 0 6 6 9 9 1 5 2 1 3 2 3 2 2 3 1 8 0 11 5 4 9 1 6 4 9 7 5 7 6 3 3 1 2 3 2 1 1 3 4 1 4 5 2 3 6 1 6 0 8 4 5 9 1 4 5 5 4 1 2 3 1 3 3 1 8 0 10 7 1 1 8 9 7 3 9 3 6 2 1 1 3 3 1 1 2 1 7 0 10 3 6 3 9 8 4 7 1 3 1 3 1 1 1 1 1 1 3 2 2 4 2 2 3 5 1 9 0 6 5 5 5 1 1 1 2 3 1 3 1 3 3 1 1 1 8 0 10 2 4 3 7 1 6 3 1 1 6 2 3 2 1 2 2 1 2 1 8 0 7 2 7 1 1 2 1 5 2 3 1 2 1 3 3 2 4 5 2 4 1 6 5 4 6 5 4 3 5 1 8 0 7 3 1 2 4 1 7 1 2 1 1 1 2 2 1 1 1 6 0 11 1 8 9 2 7 1 4 1 9 1 9 2 2 1 3 1 3 1 9 0 11 2 1 6 9 1 4 3 3 1 9 1 2 1 3 2 3 3 1 3 1 5 3 5 3 4 3 5 1 9 0 6 1 2 7 1 7 9 3 3 3 1 2 3 3 3 3 1 7 0 8 2 9 6 1 1 9 2 7 3 2 3 1 1 1 1 1 8 0 10 7 6 1 1 4 7 4 3 2 5 1 2 2 2 2 1 3 2 1 2 5 1 2 3 7 1 7 0 8 4 6 9 1 5 8 9 2 1 2 1 2 2 1 1 1 9 0 8 6 8 1 1 5 5 4 2 1 2 3 1 3 3 1 1 1 1 8 0 9 1 7 1 1 9 2 2 4 9 2 1 3 3 1 3 2 2 4 3 2 2 2 2 1 3 6 1 7 0 9 5 9 7 1 5 7 7 1 2 1 2 2 2 2 1 3 1 7 0 7 4 5 4 6 1 5 1 3 1 1 2 1 3 1 1 8 0 9 9 2 9 1 6 8 9 3 1 1 2 3 1 1 2 3 2 5 2 2 3 4 2 3 5 1 5 0 6 1 5 1 7 7 9 1 1 3 1 3 1 6 0 6 7 4 6 1 7 4 2 1 1 1 2 2 1 5 0 9 5 9 7 3 6 4 1 9 4 1 2 1 1 1 4 3 4 2 5 2 5 5 3 5 4 3 6 1 8 0 9 7 3 5 2 1 4 9 9 3 2 2 2 1 2 1 1 2 1 8 0 7 3 3 7 5 5 6 1 1 2 3 1 2 1 3 2 1 8 0 10 1 1 5 5 3 7 4 6 9 1 3 1 2 1 1 3 2 2 4 5 2 3 4 4 3 4 1 5 0 9 1 4 1 8 1 9 8 5 6 2 3 3 1 1 1 9 0 9 2 1 4 7 3 1 3 2 3 2 1 1 2 3 2 1 2 1 1 6 0 7 2 4 7 5 1 6 9 1 3 3 2 1 2 2 1 2 3 3 7 1 5 0 10 4 1 9 4 6 7 1 1 2 7 2 3 1 2 3 1 9 0 10 9 9 5 5 1 3 1 1 2 2 3 3 2 2 2 2 1 3 3 1 7 0 9 8 1 4 6 7 8 3 7 6 1 2 2 1 3 3 2 1 4 1 5 5 5 4 3 4 1 9 0 11 4 5 2 7 9 1 4 7 3 7 8 3 1 2 1 3 1 1 2 1 1 9 0 9 1 3 1 7 6 6 2 4 8 2 1 3 2 1 3 3 3 1 1 9 0 11 5 6 8 4 1 3 6 4 6 5 4 3 2 3 1 1 2 3 2 2 3 3 1 3 3 7 1 8 0 9 1 4 9 6 3 4 8 3 1 2 3 3 2 1 3 3 1 1 5 0 10 5 5 1 6 1 8 4 3 4 6 3 2 2 1 2 1 7 0 6 7 4 9 6 1 6 3 2 1 1 1 2 1 5 1 2 4 5 1 4 5 4 2 5 5 4 3 7 1 6 0 8 2 5 4 6 2 1 9 8 2 2 1 3 3 2 1 8 0 11 2 1 4 6 6 9 8 6 6 2 5 1 1 1 2 1 2 2 1 1 8 0 8 7 4 4 8 4 1 3 4 1 3 1 1 2 1 2 1 2 5 1 3 3 1 3 3 5 1 8 0 8 1 8 1 1 3 6 1 8 1 1 3 3 2 2 3 1 1 7 0 9 7 8 6 4 8 1 1 8 4 1 3 2 1 2 3 1 1 5 0 11 4 8 2 5 1 4 7 7 9 1 1 1 3 1 1 3 2 5 2 2 2 3 6 1 6 0 7 3 1 5 8 1 8 2 2 1 1 3 2 1 1 8 0 10 2 2 4 9 1 7 2 8 3 3 1 2 3 1 2 3 2 2 1 5 0 6 1 7 8 3 4 5 3 3 2 1 2 2 1 5 1 4 5 3 4 1 6 0 7 5 3 1 9 5 6 3 3 2 2 1 1 3 1 9 0 10 1 1 1 1 6 3 5 1 6 2 1 1 3 2 2 2 1 1 3 1 7 0 10 1 3 6 7 1 2 5 1 7 4 3 1 3 2 3 2 1 5 1 3 2 3 6 1 7 0 8 6 1 7 3 1 5 1 3 1 1 2 1 3 1 2 1 6 0 9 9 7 8 6 2 4 1 7 6 1 1 2 3 2 3 1 9 0 11 4 1 4 8 6 7 6 4 9 4 4 2 1 3 1 2 3 1 1 1 2 3 1 1 2 3 3 2 5 4 7 3 8 6 3 5 4 3 4 1 9 0 10 6 1 6 1 2 2 6 2 7 5 2 1 3 1 3 3 2 2 1 1 7 0 8 3 3 4 1 9 8 1 1 2 3 3 3 3 1 1 1 8 0 8 7 4 7 5 2 6 1 8 3 3 1 1 2 3 3 2 3 4 3 5 3 4 1 7 0 6 8 6 6 1 6 9 2 1 1 2 1 1 1 1 8 0 7 9 6 3 8 1 4 2 3 1 2 2 1 1 3 3 1 6 0 10 9 4 1 9 1 9 3 9 6 3 3 1 2 3 2 1 3 3 2 2 3 5 1 9 0 11 6 8 8 3 8 1 6 4 1 4 7 3 2 2 3 1 2 2 3 2 1 5 0 6 1 6 1 4 7 7 2 2 3 1 1 1 9 0 9 5 7 1 7 3 2 5 2 1 3 2 1 2 3 3 1 2 1 2 1 5 4 2 3 7 1 5 0 9 9 1 7 1 8 3 5 3 2 1 3 2 2 2 1 5 0 10 8 3 4 8 8 2 4 3 1 8 2 1 3 1 1 1 5 0 6 1 1 9 3 9 5 2 1 3 1 3 3 3 3 1 1 2 3 3 7 1 9 0 6 7 6 4 9 1 9 1 3 3 2 1 3 3 2 1 1 8 0 10 6 3 2 1 7 2 7 6 4 1 1 2 1 1 1 2 2 1 1 9 0 9 2 5 7 4 7 3 1 1 3 3 3 2 3 1 2 1 2 1 5 3 5 2 1 2 3 6 2 5 1 5 4 3 7 1 9 0 7 7 7 1 8 5 1 7 2 3 3 1 1 3 2 1 2 1 8 0 7 4 4 1 6 6 8 9 3 1 1 2 1 1 3 2 1 9 0 10 9 3 2 3 4 1 6 5 4 4 3 1 1 2 2 3 3 1 2 1 5 4 3 4 2 3 3 5 1 5 0 7 1 1 3 5 8 4 3 1 3 2 3 2 1 5 0 10 6 5 5 1 9 9 4 8 4 4 1 3 2 1 1 1 5 0 8 8 8 3 8 1 2 5 3 1 1 2 3 2 3 5 3 3 4 3 7 1 8 0 9 6 3 9 2 7 1 9 2 7 3 3 1 1 2 3 1 3 1 8 0 9 9 7 1 9 2 9 1 9 6 1 1 2 1 3 2 3 1 1 5 0 6 9 5 1 7 8 9 1 3 2 1 1 3 2 3 4 4 3 5 3 6 1 6 0 6 7 1 4 5 3 8 1 3 3 3 2 3 1 8 0 6 1 7 1 2 9 1 1 1 1 1 2 2 1 2 1 8 0 9 6 3 2 3 1 9 3 2 2 2 3 1 1 2 1 2 1 3 5 3 5 3 4 3 5 1 6 0 9 5 5 2 1 4 8 9 4 1 1 2 2 1 2 2 1 8 0 9 1 3 4 3 6 4 3 2 1 2 1 2 3 3 3 1 2 1 9 0 11 5 3 3 3 9 7 4 8 6 1 3 3 3 1 1 1 1 2 1 2 3 4 2 3 3 2 2 2 2 5 4 3 6 1 9 0 8 8 7 7 1 1 5 3 9 3 1 2 2 2 2 2 1 1 1 7 0 6 9 8 1 2 1 2 1 2 2 3 2 3 1 1 6 0 6 3 1 8 6 8 6 3 2 1 2 2 1 4 5 3 1 3 4 3 4 1 9 0 8 2 1 9 8 5 9 2 9 2 1 1 3 3 1 2 3 1 1 6 0 9 7 5 7 1 7 5 7 4 4 1 1 1 1 2 1 1 9 0 8 1 8 9 9 3 8 6 4 3 2 2 3 1 1 1 3 2 3 2 1 4 3 7 1 8 0 10 9 7 1 1 6 5 8 3 1 3 3 2 2 1 2 1 1 3 1 7 0 7 4 6 9 1 1 8 2 3 3 1 2 1 1 1 1 6 0 7 7 6 2 7 1 8 4 3 1 1 2 3 3 4 5 4 5 3 1 2 3 5 1 9 0 8 8 8 9 4 6 1 4 9 3 1 3 1 1 2 1 3 3 1 7 0 10 5 3 7 9 2 6 6 2 1 3 3 1 2 3 1 2 1 1 5 0 10 6 1 5 2 9 1 9 3 1 8 3 1 1 1 3 4 1 5 3 5 3 5 1 8 0 10 2 9 5 7 1 9 3 5 5 1 3 2 2 1 1 1 3 2 1 8 0 7 3 8 1 6 6 8 9 3 1 1 3 1 1 3 2 1 5 0 7 2 5 1 9 9 8 9 3 1 1 3 3 5 3 3 3 3 3 4 3 1 5 3 3 7 1 7 0 9 7 1 9 9 2 4 3 3 2 3 1 1 1 1 2 2 1 6 0 9 1 4 3 7 7 1 9 8 7 3 3 1 3 1 1 1 5 0 6 8 9 4 1 4 5 3 3 1 1 2 3 1 5 4 5 3 2 3 6 1 7 0 10 1 5 6 5 1 1 9 2 1 7 2 1 1 3 1 1 2 1 9 0 8 7 4 8 6 8 1 1 7 1 2 2 1 3 1 2 1 3 1 8 0 8 1 5 9 1 2 2 2 5 1 3 2 3 1 1 3 3 3 1 3 2 5 4 3 7 1 8 0 10 1 5 1 5 6 5 1 3 8 5 1 3 1 2 3 3 3 3 1 7 0 11 7 9 7 8 9 7 1 1 5 1 1 2 2 1 1 3 3 2 1 5 0 10 1 9 3 9 5 1 3 6 8 6 3 2 1 3 1 1 2 5 5 5 5 4 3 7 1 7 0 6 1 9 5 9 3 4 1 1 3 3 3 3 1 1 7 0 11 4 1 1 1 1 6 5 8 4 3 1 1 2 3 1 1 1 1 1 9 0 10 8 6 6 4 2 1 4 2 4 4 1 1 1 3 1 2 1 2 1 3 5 3 3 1 2 3 3 5 1 8 0 8 7 6 8 5 1 1 5 8 2 1 2 3 1 2 1 2 1 5 0 11 6 2 7 3 5 4 1 6 6 6 1 2 1 1 3 1 1 5 0 11 5 1 5 6 1 6 5 4 8 1 2 1 1 2 2 1 5 3 3 4 3 4 6 5 5 3 3 6 1 5 0 7 6 1 3 4 5 4 6 1 2 1 1 1 1 8 0 8 1 5 5 7 8 1 1 7 3 3 2 1 3 2 3 1 1 8 0 8 8 7 1 4 8 7 2 3 2 1 2 3 3 3 2 3 3 5 5 4 1 4 3 6 1 6 0 11 7 8 7 1 1 8 2 7 2 2 9 1 2 1 2 1 1 1 7 0 6 3 8 2 8 1 5 1 1 1 2 2 3 1 1 7 0 9 4 1 9 6 3 8 2 9 2 2 3 1 1 3 1 1 4 2 2 4 3 3 3 4 1 6 0 10 1 5 9 2 3 7 9 4 7 6 3 1 3 3 3 1 1 9 0 6 1 1 2 1 7 1 1 3 3 1 3 1 1 2 2 1 8 0 9 7 5 3 1 5 5 9 6 4 3 3 1 1 3 1 1 1 2 2 4 2 3 5 1 7 0 11 4 3 4 8 4 7 6 9 7 6 1 2 1 3 1 1 2 2 1 6 0 8 3 1 4 1 4 7 3 3 3 1 1 3 2 1 1 5 0 8 2 2 1 4 1 8 1 6 3 1 3 2 2 1 2 2 5 5 3 5 1 9 0 11 1 9 6 8 8 6 4 1 4 8 1 3 1 1 1 1 1 1 3 1 1 8 0 6 4 3 3 1 6 2 2 1 2 1 2 2 3 1 1 6 0 11 2 1 4 2 8 8 6 1 8 4 2 1 2 1 1 1 2 5 5 1 1 3 3 1 5 5 4 3 6 1 7 0 9 9 7 4 1 4 6 3 5 7 2 3 1 3 1 1 2 1 9 0 6 8 9 1 1 4 1 1 3 3 1 1 3 1 1 1 1 6 0 7 4 1 4 6 3 1 8 3 1 1 1 2 2 2 1 5 4 3 5 3 6 1 8 0 9 1 2 8 1 6 8 7 5 9 1 3 3 3 2 1 1 2 1 9 0 6 6 1 2 6 9 9 3 3 1 2 3 3 1 1 2 1 8 0 6 5 7 2 1 5 1 3 1 1 3 1 1 2 3 1 4 3 1 3 4 3 5 1 5 0 8 4 1 5 9 8 8 1 5 1 3 2 1 3 1 9 0 10 1 7 6 1 8 8 8 8 5 9 1 1 3 2 3 3 2 1 1 1 5 0 7 4 6 9 1 7 3 5 2 2 1 2 1 1 2 3 1 4 3 7 1 8 0 6 8 1 2 9 2 4 1 1 2 2 2 1 2 1 1 5 0 8 5 4 1 8 4 8 1 9 3 2 1 3 1 1 5 0 9 1 6 6 9 1 6 1 1 1 1 1 1 1 3 2 2 1 3 1 2 1 3 6 1 8 0 6 3 1 9 2 8 3 1 2 1 2 2 1 2 1 1 6 0 6 5 7 3 1 2 1 2 3 1 2 1 1 1 7 0 8 8 3 1 6 5 9 9 9 1 1 3 2 1 1 2 4 1 1 2 3 1 2 5 3 2 4 5 2 6 3 4 5 3 7 1 8 0 11 4 8 9 4 1 4 8 8 9 3 2 1 1 2 2 1 1 2 3 1 6 0 8 1 3 9 1 7 2 8 3 3 1 1 3 2 1 1 7 0 9 7 2 9 9 7 2 8 1 1 1 1 3 1 1 3 3 3 1 3 1 2 4 4 3 7 1 5 0 7 9 2 7 4 1 6 4 3 1 1 3 2 1 5 0 6 7 5 1 8 7 1 2 2 2 2 1 1 6 0 11 6 6 2 7 1 1 4 7 3 4 1 1 3 3 1 2 2 2 2 3 2 2 2 3 3 4 1 6 0 11 1 1 5 4 7 8 7 3 9 1 7 2 2 3 2 1 3 1 9 0 11 9 8 1 8 4 3 8 5 1 9 1 2 1 1 2 2 3 2 2 1 1 7 0 7 1 7 9 1 3 5 6 1 2 1 3 3 1 3 2 1 2 5 3 5 1 8 0 11 1 7 9 6 7 1 3 3 3 5 3 1 1 3 2 3 1 3 3 1 9 0 6 1 2 1 1 3 6 2 2 2 3 3 1 2 2 3 1 8 0 11 9 9 9 6 1 6 4 9 1 3 9 3 3 1 2 1 2 2 2 2 4 3 4 1 2 4 6 4 5 5 5 3 7 1 5 0 8 4 1 3 9 7 6 8 7 1 1 1 1 1 1 9 0 10 4 5 5 2 3 3 7 5 1 4 1 2 3 3 1 1 1 3 3 1 5 0 8 8 1 4 4 1 5 9 8 3 1 3 1 2 2 3 1 4 2 1 4 3 6 1 8 0 10 4 6 4 1 3 9 4 1 3 7 1 1 1 1 1 1 1 1 1 7 0 7 6 9 1 2 9 9 4 2 1 3 2 1 1 1 1 8 0 10 9 5 1 1 3 5 9 1 2 8 2 1 2 1 1 2 3 3 2 3 2 2 3 3 3 6 1 6 0 11 1 3 1 9 6 4 4 3 5 1 7 2 2 1 1 1 1 1 5 0 8 2 6 8 1 3 2 6 1 2 2 3 1 3 1 8 0 7 3 7 3 9 6 1 7 2 1 2 3 3 2 3 3 5 2 5 5 5 3 3 4 1 5 0 8 1 2 1 1 8 4 2 4 1 1 3 2 3 1 5 0 6 1 1 3 3 2 6 3 1 2 3 3 1 6 0 11 1 6 3 3 5 3 1 8 1 9 1 3 2 2 1 3 1 5 5 2 1 3 5 1 7 0 8 7 4 9 3 9 5 1 1 3 1 1 3 1 1 3 1 8 0 7 6 5 7 1 4 2 1 1 2 2 2 2 3 1 1 1 8 0 10 1 3 3 1 8 3 9 6 6 9 1 1 1 1 2 3 1 1 3 3 5 1 5 4 1 3 1 6 5 5 3 4 1 5 0 6 8 2 1 4 9 3 1 2 1 2 2 1 9 0 10 4 2 7 7 7 1 1 2 3 4 3 2 1 2 1 2 1 3 3 1 7 0 11 5 1 4 4 1 8 2 9 4 9 5 3 3 3 2 1 2 1 2 1 2 1 3 6 1 6 0 9 8 2 2 1 2 1 3 6 2 2 2 1 1 2 1 1 7 0 10 6 7 8 8 2 1 2 1 4 7 1 1 2 1 2 2 3 1 7 0 11 7 4 8 1 9 8 1 7 9 5 1 1 2 1 3 3 2 3 2 2 5 3 5 4 3 5 1 5 0 7 3 7 1 1 3 7 7 1 1 1 1 3 1 6 0 10 2 4 5 8 3 1 4 8 1 5 1 2 1 1 2 2 1 6 0 10 9 6 1 1 8 4 4 1 9 6 3 3 1 2 1 2 1 4 3 2 2 3 4 1 7 0 6 8 2 9 9 4 1 2 1 1 2 3 3 2 1 6 0 9 1 9 6 2 2 4 8 1 4 1 2 1 1 3 1 1 9 0 8 7 8 1 1 3 3 4 7 3 1 1 3 3 2 1 2 2 1 5 3 1 3 4 1 9 0 6 4 4 6 1 1 9 3 3 2 3 3 1 2 1 2 1 5 0 6 8 3 1 9 9 8 2 3 1 1 1 1 8 0 6 5 1 8 2 1 8 3 1 1 3 2 3 1 1 2 3 4 5 1 2 3 7 1 5 4 3 6 1 8 0 8 5 8 6 9 5 6 1 4 2 2 1 2 1 3 3 2 1 6 0 9 7 7 3 1 3 3 1 6 7 3 1 1 3 3 2 1 5 0 7 4 4 1 2 2 7 2 1 2 1 3 2 4 3 1 2 1 4 3 7 1 5 0 8 4 5 2 2 3 1 7 8 1 1 3 3 3 1 5 0 10 1 8 3 5 5 7 9 9 1 2 1 2 3 1 2 1 6 0 11 1 1 6 4 1 9 9 7 1 4 1 1 3 2 2 2 1 3 4 4 5 3 1 5 3 4 1 5 0 7 3 1 7 5 5 3 5 2 1 3 1 2 1 9 0 11 8 9 1 8 3 8 6 4 4 5 3 1 1 1 3 1 3 2 2 3 1 5 0 10 3 5 3 1 4 8 7 2 2 9 1 3 2 1 1 2 2 4 4 3 7 1 5 0 8 2 5 9 7 7 1 5 6 2 1 3 1 1 1 9 0 6 1 4 7 6 4 9 1 2 1 1 1 1 2 3 3 1 8 0 11 9 6 3 9 1 5 1 1 7 2 4 1 3 2 2 2 3 2 3 3 2 4 1 4 1 1 3 5 1 9 0 9 9 1 2 7 5 2 9 8 8 1 3 3 2 1 1 3 2 1 1 7 0 8 4 9 1 4 5 8 6 2 1 1 2 2 3 3 1 1 7 0 11 1 5 4 2 9 2 3 7 1 2 4 1 2 2 3 1 3 3 5 3 2 1 5 2 3 2 2 4 5 3 5 1 9 0 6 5 1 2 3 6 2 1 1 3 1 1 2 3 3 1 1 7 0 9 6 4 6 2 3 8 3 1 8 1 2 1 1 1 1 1 1 7 0 9 6 3 5 5 1 6 2 1 2 3 3 2 3 3 1 1 4 4 2 3 1 3 7 1 7 0 10 2 8 1 5 6 2 7 7 6 8 3 3 3 2 1 3 3 1 8 0 6 3 5 6 1 3 1 1 2 1 3 1 3 1 1 1 8 0 9 1 5 7 9 3 9 7 8 1 2 3 2 1 2 2 2 2 2 1 4 2 4 2 5 3 5 1 6 0 10 2 2 5 4 5 8 1 9 9 1 2 1 3 1 1 3 1 9 0 7 9 1 2 3 2 8 3 3 3 1 2 1 1 3 2 1 1 8 0 7 3 7 6 1 6 5 6 2 1 2 1 2 3 2 1 5 3 2 2 1 3 5 1 9 0 7 9 3 5 1 1 9 4 1 3 1 3 1 3 1 3 3 1 5 0 10 6 1 3 8 3 1 5 8 9 4 2 1 2 2 2 1 8 0 8 9 5 8 5 5 7 4 1 3 3 1 1 3 2 1 3 2 4 4 3 4 1 1 3 4 1 5 4 3 7 1 9 0 11 5 7 9 9 9 7 4 7 2 1 6 1 1 3 2 2 3 1 2 2 1 5 0 6 2 2 6 1 9 4 2 3 3 1 2 1 7 0 6 4 1 5 1 2 5 2 3 1 3 1 1 2 1 5 5 1 2 1 4 3 5 1 9 0 7 7 6 7 1 4 3 1 3 1 3 1 3 3 1 1 2 1 7 0 9 1 2 8 8 2 1 5 9 8 3 2 2 2 3 1 1 1 9 0 6 7 1 1 4 4 4 2 2 2 1 1 2 1 1 3 5 5 5 2 2 3 7 1 5 0 7 1 1 5 1 9 1 4 1 3 2 1 1 1 8 0 11 5 1 8 3 6 8 6 3 2 4 4 3 3 3 1 1 2 2 1 1 7 0 10 8 1 3 1 6 8 1 3 1 1 3 3 2 1 1 2 1 1 2 2 2 1 2 3 3 4 1 8 0 7 9 9 5 1 6 1 2 2 2 2 2 2 1 3 1 1 6 0 9 1 4 2 5 9 7 8 7 6 3 1 3 1 3 1 1 6 0 6 8 2 1 7 9 1 1 2 1 3 1 1 1 5 3 3 3 5 1 8 0 9 5 3 6 3 1 3 1 7 8 1 1 3 1 1 1 1 2 1 5 0 7 2 3 3 4 8 1 7 2 1 1 3 1 1 8 0 7 3 8 3 8 2 1 3 1 2 1 1 1 2 2 1 4 3 1 5 3 2 1 5 6 2 6 4 5 7 9 3 8 1 8 8 4 6 1`;
//str = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`;
let arr = str.split(' ').map(a => parseInt(a));
//log(arr);
let stack = [];
let root = {children: [], meta: []};
let cstack = [root];
let cur = root;
let sum = 0;
let n = 0;
for (let i = 0; i < arr.length; i++) {
  n++;
  let q = arr[i];
  i++;
  let md = arr[i];
  stack.push({md, q});
  i++;
  cur.children.push({children: [], meta: [], num: n});
  cur = cur.children[cur.children.length - 1];
  cstack.push(cur);
  //log(i);
  //log(q);
  //log(md);
  if (q === 0) {
    let pop = stack.pop();
    let last = cstack.pop();
    cur = cstack[cstack.length - 1];
    stack[stack.length - 1].q--;
    while (pop.q === 0) {
      log(cur.num);
      for (let k = 0; k < pop.md; k++) {
        last.meta.push(arr[i]);
        i++;
      }

      if (stack.length > 0 && stack[stack.length - 1].q === 0) {
        pop = stack.pop();
        last = cur;
        cstack.pop();
        cur = cstack[cstack.length - 1];
        if (stack.length > 0) {
          stack[stack.length - 1].q--;
        }
      } else {
        break;
      }
    }
  }
  i--;
}
//log(root.children);
root = root.children[0];

function getScore(node) {
  //log(node);
  if (node.children.length === 0) {
    let sum = 0;
    for (let i = 0; i < node.meta.length; i++) {
      sum += node.meta[i];
    }
    return sum;
  }

  let sum = 0;
  for (let i = 0; i < node.meta.length; i++) {
    let m = node.meta[i];
    if (m > 0 && m <= node.children.length) {
      sum += getScore(node.children[m-1]);
    }
  }
  return sum;
}

log(getScore(root));

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

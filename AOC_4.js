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

str = `[1518-05-29 00:00] Guard #1151 begins shift
[1518-05-12 00:02] Guard #439 begins shift
[1518-04-11 00:33] falls asleep
[1518-06-23 00:52] wakes up
[1518-10-25 00:48] falls asleep
[1518-09-09 00:55] falls asleep
[1518-10-29 00:18] falls asleep
[1518-10-24 00:43] wakes up
[1518-11-03 00:57] wakes up
[1518-04-10 00:03] falls asleep
[1518-07-17 00:46] wakes up
[1518-10-02 00:47] wakes up
[1518-04-02 00:48] wakes up
[1518-04-27 00:57] wakes up
[1518-07-19 00:46] wakes up
[1518-09-28 00:44] wakes up
[1518-11-05 00:45] wakes up
[1518-11-17 00:50] wakes up
[1518-08-03 00:15] falls asleep
[1518-09-21 00:26] falls asleep
[1518-04-13 00:00] Guard #947 begins shift
[1518-08-03 00:39] falls asleep
[1518-11-23 00:23] wakes up
[1518-08-02 00:27] wakes up
[1518-10-08 00:04] Guard #499 begins shift
[1518-07-12 23:58] Guard #3449 begins shift
[1518-09-07 00:38] wakes up
[1518-11-16 00:43] wakes up
[1518-04-29 00:23] falls asleep
[1518-10-31 00:53] wakes up
[1518-06-25 00:15] wakes up
[1518-10-20 23:50] Guard #947 begins shift
[1518-08-24 00:23] wakes up
[1518-11-11 00:57] wakes up
[1518-06-03 00:01] Guard #947 begins shift
[1518-09-29 00:43] wakes up
[1518-08-24 00:43] wakes up
[1518-07-16 00:10] falls asleep
[1518-06-08 00:21] wakes up
[1518-08-17 00:49] falls asleep
[1518-08-02 00:25] falls asleep
[1518-09-28 00:53] wakes up
[1518-10-19 00:03] Guard #337 begins shift
[1518-04-15 00:53] falls asleep
[1518-09-25 00:52] falls asleep
[1518-07-17 00:39] falls asleep
[1518-11-17 00:04] Guard #2341 begins shift
[1518-06-06 00:08] falls asleep
[1518-08-05 00:09] falls asleep
[1518-04-30 23:56] Guard #809 begins shift
[1518-08-19 00:53] wakes up
[1518-06-07 00:00] Guard #2341 begins shift
[1518-04-15 23:50] Guard #3019 begins shift
[1518-09-02 00:55] wakes up
[1518-11-19 00:59] wakes up
[1518-05-03 00:29] falls asleep
[1518-11-17 23:49] Guard #337 begins shift
[1518-07-02 00:39] wakes up
[1518-05-26 00:53] falls asleep
[1518-06-03 00:20] falls asleep
[1518-07-14 00:08] falls asleep
[1518-05-25 00:03] Guard #1481 begins shift
[1518-03-19 00:24] falls asleep
[1518-06-13 00:41] falls asleep
[1518-07-16 00:49] wakes up
[1518-06-01 00:40] wakes up
[1518-06-24 00:34] wakes up
[1518-04-15 00:00] Guard #499 begins shift
[1518-08-24 23:56] Guard #3019 begins shift
[1518-04-04 00:03] falls asleep
[1518-11-05 00:00] Guard #3119 begins shift
[1518-05-23 00:54] wakes up
[1518-09-19 00:57] wakes up
[1518-09-10 00:56] wakes up
[1518-05-27 00:04] Guard #3067 begins shift
[1518-07-18 00:00] falls asleep
[1518-08-16 00:36] wakes up
[1518-11-12 23:57] Guard #1481 begins shift
[1518-07-02 23:46] Guard #499 begins shift
[1518-08-17 00:14] falls asleep
[1518-07-09 23:57] Guard #2791 begins shift
[1518-04-11 23:59] Guard #3067 begins shift
[1518-09-08 00:20] falls asleep
[1518-11-10 00:41] falls asleep
[1518-06-10 00:29] wakes up
[1518-04-28 00:55] wakes up
[1518-05-22 23:58] Guard #3019 begins shift
[1518-07-06 23:57] Guard #1973 begins shift
[1518-09-25 00:00] Guard #1481 begins shift
[1518-10-22 23:47] Guard #1973 begins shift
[1518-10-12 00:42] wakes up
[1518-06-18 00:41] falls asleep
[1518-10-03 00:22] wakes up
[1518-10-22 00:50] falls asleep
[1518-09-24 00:00] Guard #337 begins shift
[1518-06-30 23:58] Guard #2243 begins shift
[1518-07-01 23:57] Guard #1951 begins shift
[1518-06-27 00:57] wakes up
[1518-06-24 00:56] wakes up
[1518-09-21 00:56] wakes up
[1518-10-06 00:36] wakes up
[1518-04-28 00:16] wakes up
[1518-07-19 23:57] Guard #3067 begins shift
[1518-08-27 00:14] falls asleep
[1518-08-27 00:15] wakes up
[1518-04-10 23:57] Guard #809 begins shift
[1518-10-02 00:04] Guard #2243 begins shift
[1518-09-15 00:47] falls asleep
[1518-04-29 00:01] Guard #439 begins shift
[1518-04-17 00:16] falls asleep
[1518-11-23 00:16] falls asleep
[1518-09-29 00:03] Guard #3449 begins shift
[1518-10-09 00:03] falls asleep
[1518-09-18 00:00] Guard #1951 begins shift
[1518-05-31 00:54] wakes up
[1518-11-07 00:31] wakes up
[1518-09-02 00:44] falls asleep
[1518-07-03 00:55] wakes up
[1518-09-11 00:35] wakes up
[1518-08-05 00:53] wakes up
[1518-06-13 00:55] wakes up
[1518-11-02 00:02] Guard #3119 begins shift
[1518-06-17 00:50] falls asleep
[1518-08-03 00:36] wakes up
[1518-05-02 00:53] falls asleep
[1518-06-25 00:48] wakes up
[1518-11-10 23:58] Guard #3019 begins shift
[1518-08-23 00:36] wakes up
[1518-10-26 00:53] wakes up
[1518-05-02 00:46] wakes up
[1518-07-29 00:45] wakes up
[1518-03-19 00:02] Guard #787 begins shift
[1518-07-16 00:03] Guard #947 begins shift
[1518-10-28 00:02] Guard #1951 begins shift
[1518-10-30 00:04] Guard #947 begins shift
[1518-08-06 00:56] wakes up
[1518-08-05 00:03] Guard #2791 begins shift
[1518-04-04 00:42] falls asleep
[1518-07-06 00:12] wakes up
[1518-06-24 00:46] falls asleep
[1518-05-03 00:59] wakes up
[1518-11-07 00:18] falls asleep
[1518-08-14 00:56] falls asleep
[1518-03-28 00:02] Guard #499 begins shift
[1518-08-07 00:57] wakes up
[1518-07-05 00:53] wakes up
[1518-05-31 00:38] falls asleep
[1518-07-04 00:17] falls asleep
[1518-10-12 00:58] wakes up
[1518-10-08 00:44] falls asleep
[1518-05-22 00:55] wakes up
[1518-07-10 23:57] Guard #947 begins shift
[1518-04-08 00:33] wakes up
[1518-08-08 00:44] falls asleep
[1518-05-19 00:57] wakes up
[1518-04-05 00:01] Guard #499 begins shift
[1518-07-04 00:59] wakes up
[1518-09-27 00:34] falls asleep
[1518-11-01 00:21] wakes up
[1518-11-23 00:32] falls asleep
[1518-10-31 00:36] wakes up
[1518-04-29 00:57] wakes up
[1518-07-10 00:55] wakes up
[1518-10-11 00:09] falls asleep
[1518-10-26 00:28] falls asleep
[1518-10-27 00:36] falls asleep
[1518-10-13 00:36] falls asleep
[1518-05-21 00:35] falls asleep
[1518-07-24 00:07] falls asleep
[1518-03-20 00:00] Guard #499 begins shift
[1518-04-01 00:08] falls asleep
[1518-05-13 00:48] wakes up
[1518-08-18 00:16] falls asleep
[1518-04-08 00:19] falls asleep
[1518-11-11 00:48] wakes up
[1518-09-22 00:16] falls asleep
[1518-04-28 00:27] falls asleep
[1518-07-24 00:36] wakes up
[1518-07-31 00:23] falls asleep
[1518-03-27 00:48] falls asleep
[1518-06-26 00:43] wakes up
[1518-07-13 00:18] falls asleep
[1518-11-11 23:58] Guard #2243 begins shift
[1518-09-15 00:25] falls asleep
[1518-10-09 00:20] falls asleep
[1518-09-30 00:00] Guard #2341 begins shift
[1518-10-29 00:59] wakes up
[1518-08-08 00:14] falls asleep
[1518-05-04 23:56] Guard #1151 begins shift
[1518-05-16 00:19] falls asleep
[1518-09-14 00:59] wakes up
[1518-11-21 00:53] wakes up
[1518-09-19 00:40] wakes up
[1518-08-22 00:30] falls asleep
[1518-10-18 00:29] wakes up
[1518-11-14 00:25] falls asleep
[1518-06-02 00:36] falls asleep
[1518-11-04 00:03] Guard #3449 begins shift
[1518-08-21 00:00] Guard #2089 begins shift
[1518-04-19 00:17] wakes up
[1518-07-28 00:30] falls asleep
[1518-06-09 00:30] falls asleep
[1518-10-09 23:59] Guard #1367 begins shift
[1518-06-21 23:59] Guard #631 begins shift
[1518-10-31 00:51] falls asleep
[1518-10-29 00:04] Guard #89 begins shift
[1518-09-08 00:58] wakes up
[1518-03-31 00:01] Guard #3449 begins shift
[1518-11-20 23:49] Guard #947 begins shift
[1518-09-15 00:50] wakes up
[1518-09-01 00:48] wakes up
[1518-11-14 23:56] Guard #3119 begins shift
[1518-04-17 00:45] wakes up
[1518-08-26 00:02] falls asleep
[1518-03-25 00:00] Guard #2791 begins shift
[1518-06-21 00:00] Guard #3019 begins shift
[1518-08-07 00:10] falls asleep
[1518-09-26 00:24] falls asleep
[1518-10-08 00:24] wakes up
[1518-08-15 23:59] Guard #947 begins shift
[1518-07-31 00:01] Guard #89 begins shift
[1518-04-22 00:26] wakes up
[1518-08-17 00:03] Guard #337 begins shift
[1518-06-04 00:31] falls asleep
[1518-10-08 00:27] falls asleep
[1518-06-02 00:19] falls asleep
[1518-08-01 00:47] wakes up
[1518-05-04 00:00] Guard #1973 begins shift
[1518-10-12 00:53] falls asleep
[1518-09-14 00:22] wakes up
[1518-06-02 00:56] wakes up
[1518-07-25 00:54] falls asleep
[1518-07-03 23:50] Guard #2617 begins shift
[1518-05-13 00:00] Guard #1951 begins shift
[1518-11-01 00:05] falls asleep
[1518-05-03 00:49] falls asleep
[1518-09-18 00:48] falls asleep
[1518-07-25 00:59] wakes up
[1518-11-19 00:28] falls asleep
[1518-04-25 00:21] wakes up
[1518-08-24 00:41] falls asleep
[1518-08-20 00:54] wakes up
[1518-11-15 23:57] Guard #3019 begins shift
[1518-05-15 00:00] falls asleep
[1518-04-09 00:56] wakes up
[1518-10-25 00:58] wakes up
[1518-03-18 00:01] Guard #89 begins shift
[1518-08-05 00:10] wakes up
[1518-09-02 00:40] wakes up
[1518-07-05 00:35] falls asleep
[1518-08-06 00:25] falls asleep
[1518-11-07 23:50] Guard #499 begins shift
[1518-04-24 00:10] falls asleep
[1518-10-30 00:57] falls asleep
[1518-07-09 00:23] falls asleep
[1518-06-26 00:05] falls asleep
[1518-08-04 00:57] wakes up
[1518-05-06 00:01] falls asleep
[1518-10-12 00:00] Guard #3449 begins shift
[1518-06-06 00:47] wakes up
[1518-09-15 00:42] wakes up
[1518-06-14 00:11] wakes up
[1518-05-20 00:33] wakes up
[1518-07-29 00:03] falls asleep
[1518-07-22 00:04] Guard #3449 begins shift
[1518-08-31 00:37] wakes up
[1518-04-06 00:06] falls asleep
[1518-09-27 00:56] wakes up
[1518-07-09 00:11] wakes up
[1518-07-09 00:06] falls asleep
[1518-03-22 00:26] wakes up
[1518-10-16 00:24] falls asleep
[1518-04-13 00:57] wakes up
[1518-03-31 00:42] wakes up
[1518-04-02 00:52] falls asleep
[1518-07-19 00:17] falls asleep
[1518-09-03 00:33] falls asleep
[1518-09-12 00:35] falls asleep
[1518-06-18 00:55] wakes up
[1518-05-15 00:54] wakes up
[1518-05-01 00:33] wakes up
[1518-06-22 00:42] falls asleep
[1518-09-01 00:55] wakes up
[1518-10-17 23:58] Guard #439 begins shift
[1518-04-11 00:46] wakes up
[1518-03-20 00:08] falls asleep
[1518-09-04 00:34] falls asleep
[1518-04-11 00:20] wakes up
[1518-04-18 00:41] wakes up
[1518-09-19 00:49] falls asleep
[1518-06-15 00:39] falls asleep
[1518-06-22 00:48] wakes up
[1518-03-26 23:59] Guard #2617 begins shift
[1518-08-29 00:44] wakes up
[1518-06-01 00:04] Guard #3449 begins shift
[1518-06-17 00:03] Guard #89 begins shift
[1518-07-07 00:35] wakes up
[1518-07-06 00:05] falls asleep
[1518-03-26 00:47] wakes up
[1518-09-20 00:09] falls asleep
[1518-08-29 00:39] falls asleep
[1518-09-27 00:52] falls asleep
[1518-04-09 00:15] falls asleep
[1518-11-08 00:27] wakes up
[1518-09-15 00:18] wakes up
[1518-06-04 00:25] wakes up
[1518-11-22 00:07] falls asleep
[1518-11-11 00:38] falls asleep
[1518-04-15 00:36] falls asleep
[1518-04-03 23:50] Guard #809 begins shift
[1518-07-18 00:42] falls asleep
[1518-03-29 23:58] Guard #337 begins shift
[1518-04-07 00:54] falls asleep
[1518-06-28 23:53] Guard #89 begins shift
[1518-08-04 00:29] falls asleep
[1518-05-08 00:47] falls asleep
[1518-11-02 00:23] falls asleep
[1518-05-02 00:15] falls asleep
[1518-05-27 23:58] Guard #373 begins shift
[1518-09-29 00:19] falls asleep
[1518-08-25 00:45] wakes up
[1518-09-23 00:39] wakes up
[1518-09-14 00:15] falls asleep
[1518-04-24 23:50] Guard #2243 begins shift
[1518-07-01 00:39] wakes up
[1518-04-16 00:51] wakes up
[1518-07-30 00:28] falls asleep
[1518-09-12 23:58] Guard #1367 begins shift
[1518-07-08 00:37] falls asleep
[1518-06-23 00:13] falls asleep
[1518-10-22 00:38] falls asleep
[1518-09-14 00:52] falls asleep
[1518-06-02 00:24] wakes up
[1518-07-07 00:54] wakes up
[1518-06-27 00:32] wakes up
[1518-03-20 00:54] wakes up
[1518-08-27 23:56] Guard #3449 begins shift
[1518-08-22 00:45] wakes up
[1518-07-22 00:40] wakes up
[1518-09-03 00:28] wakes up
[1518-09-01 00:35] falls asleep
[1518-07-06 00:22] falls asleep
[1518-08-08 00:00] Guard #89 begins shift
[1518-07-17 00:50] falls asleep
[1518-10-04 00:56] wakes up
[1518-05-10 00:19] falls asleep
[1518-07-14 00:02] Guard #89 begins shift
[1518-10-24 23:58] Guard #2791 begins shift
[1518-04-14 00:58] wakes up
[1518-06-08 00:47] wakes up
[1518-03-27 00:38] wakes up
[1518-11-22 00:03] Guard #2243 begins shift
[1518-03-31 00:22] falls asleep
[1518-11-13 23:58] Guard #337 begins shift
[1518-04-18 00:22] falls asleep
[1518-04-10 00:58] wakes up
[1518-11-02 00:53] wakes up
[1518-10-30 00:40] wakes up
[1518-07-05 23:50] Guard #3119 begins shift
[1518-08-12 00:36] wakes up
[1518-04-18 23:52] Guard #2617 begins shift
[1518-09-17 00:04] Guard #2089 begins shift
[1518-05-31 00:03] Guard #2617 begins shift
[1518-10-18 00:10] falls asleep
[1518-04-05 00:43] falls asleep
[1518-10-11 00:32] wakes up
[1518-04-10 00:45] falls asleep
[1518-05-04 00:20] wakes up
[1518-06-11 00:25] falls asleep
[1518-08-13 00:58] wakes up
[1518-10-01 00:06] falls asleep
[1518-07-30 00:48] wakes up
[1518-07-12 00:54] wakes up
[1518-04-28 00:01] Guard #787 begins shift
[1518-11-16 00:31] falls asleep
[1518-08-08 00:28] wakes up
[1518-11-19 00:57] falls asleep
[1518-06-07 00:36] wakes up
[1518-03-28 00:45] wakes up
[1518-05-13 00:46] falls asleep
[1518-09-22 00:18] wakes up
[1518-04-29 23:57] Guard #1151 begins shift
[1518-08-15 00:57] wakes up
[1518-06-25 00:29] falls asleep
[1518-09-02 23:59] Guard #1973 begins shift
[1518-10-28 00:26] falls asleep
[1518-04-19 00:05] falls asleep
[1518-04-25 00:49] wakes up
[1518-10-08 23:48] Guard #1951 begins shift
[1518-07-18 00:01] wakes up
[1518-09-30 00:45] wakes up
[1518-09-15 00:30] wakes up
[1518-08-13 00:42] wakes up
[1518-05-16 00:03] Guard #499 begins shift
[1518-08-08 23:58] Guard #2617 begins shift
[1518-05-25 00:26] falls asleep
[1518-05-17 00:26] falls asleep
[1518-04-23 00:41] wakes up
[1518-10-23 23:53] Guard #1367 begins shift
[1518-07-25 23:57] Guard #337 begins shift
[1518-09-27 23:57] Guard #809 begins shift
[1518-11-11 00:54] falls asleep
[1518-09-07 23:59] Guard #499 begins shift
[1518-05-16 23:53] Guard #1973 begins shift
[1518-10-14 00:58] wakes up
[1518-05-17 00:00] falls asleep
[1518-09-09 23:56] Guard #3119 begins shift
[1518-04-28 00:30] wakes up
[1518-03-30 00:17] falls asleep
[1518-08-21 00:23] wakes up
[1518-04-06 00:55] wakes up
[1518-05-08 00:59] wakes up
[1518-07-11 00:16] wakes up
[1518-06-09 00:04] Guard #2341 begins shift
[1518-10-24 00:46] falls asleep
[1518-07-18 00:44] wakes up
[1518-09-05 23:57] Guard #631 begins shift
[1518-04-13 00:37] wakes up
[1518-03-18 00:59] wakes up
[1518-07-23 00:40] falls asleep
[1518-07-18 00:58] wakes up
[1518-11-03 00:33] falls asleep
[1518-04-22 00:10] falls asleep
[1518-07-05 00:01] Guard #89 begins shift
[1518-07-15 00:18] falls asleep
[1518-04-16 00:00] falls asleep
[1518-10-15 00:36] falls asleep
[1518-09-09 00:57] wakes up
[1518-04-26 00:00] Guard #787 begins shift
[1518-10-21 23:57] Guard #3449 begins shift
[1518-06-19 00:50] wakes up
[1518-03-18 00:35] falls asleep
[1518-10-26 00:04] Guard #787 begins shift
[1518-10-09 00:09] wakes up
[1518-04-28 00:40] falls asleep
[1518-11-03 00:03] Guard #2341 begins shift
[1518-08-03 00:53] falls asleep
[1518-10-29 00:47] wakes up
[1518-09-30 00:15] falls asleep
[1518-05-21 00:53] wakes up
[1518-05-03 00:05] falls asleep
[1518-06-05 00:59] wakes up
[1518-08-04 00:04] Guard #1367 begins shift
[1518-04-15 00:57] wakes up
[1518-05-02 00:54] wakes up
[1518-11-06 00:47] wakes up
[1518-05-18 00:49] wakes up
[1518-03-29 00:03] Guard #2341 begins shift
[1518-09-27 00:00] Guard #1973 begins shift
[1518-06-20 00:58] wakes up
[1518-06-23 00:39] wakes up
[1518-07-25 00:41] wakes up
[1518-03-26 00:03] Guard #337 begins shift
[1518-10-02 00:10] falls asleep
[1518-08-01 00:20] falls asleep
[1518-06-11 00:51] falls asleep
[1518-06-23 00:00] Guard #1951 begins shift
[1518-09-27 00:45] wakes up
[1518-09-05 00:53] falls asleep
[1518-11-20 00:42] wakes up
[1518-10-31 23:48] Guard #2617 begins shift
[1518-10-07 00:50] falls asleep
[1518-09-05 00:55] wakes up
[1518-08-29 00:53] wakes up
[1518-09-16 00:59] wakes up
[1518-07-14 00:19] wakes up
[1518-09-22 00:58] wakes up
[1518-06-23 00:43] falls asleep
[1518-07-15 00:15] wakes up
[1518-07-08 00:02] Guard #89 begins shift
[1518-07-11 00:48] wakes up
[1518-09-25 00:59] wakes up
[1518-05-23 00:36] falls asleep
[1518-03-22 00:04] Guard #2341 begins shift
[1518-09-06 00:41] wakes up
[1518-06-25 00:02] Guard #947 begins shift
[1518-05-16 00:54] wakes up
[1518-06-23 23:58] Guard #2791 begins shift
[1518-05-07 00:45] falls asleep
[1518-07-14 23:50] Guard #1973 begins shift
[1518-04-01 00:28] wakes up
[1518-10-11 00:41] wakes up
[1518-06-19 00:00] Guard #3449 begins shift
[1518-07-24 23:49] Guard #89 begins shift
[1518-05-30 00:58] wakes up
[1518-10-25 00:43] wakes up
[1518-05-04 00:07] falls asleep
[1518-10-05 00:00] Guard #809 begins shift
[1518-08-01 00:04] Guard #89 begins shift
[1518-07-30 00:00] Guard #89 begins shift
[1518-07-17 00:00] Guard #499 begins shift
[1518-07-06 00:38] wakes up
[1518-06-26 00:51] wakes up
[1518-09-28 00:27] falls asleep
[1518-06-09 00:31] wakes up
[1518-10-22 00:43] wakes up
[1518-10-31 00:41] falls asleep
[1518-06-14 00:04] falls asleep
[1518-07-19 00:38] wakes up
[1518-05-22 00:38] falls asleep
[1518-11-10 00:29] wakes up
[1518-10-23 00:05] falls asleep
[1518-06-16 00:38] wakes up
[1518-04-24 00:47] wakes up
[1518-07-23 00:03] Guard #631 begins shift
[1518-06-08 00:40] falls asleep
[1518-05-08 00:53] wakes up
[1518-09-04 00:38] wakes up
[1518-08-29 00:50] falls asleep
[1518-11-10 00:15] falls asleep
[1518-11-23 00:54] wakes up
[1518-11-05 00:36] falls asleep
[1518-10-04 00:02] Guard #2341 begins shift
[1518-04-06 00:00] Guard #1367 begins shift
[1518-07-17 23:46] Guard #2089 begins shift
[1518-06-15 00:44] wakes up
[1518-04-10 00:17] wakes up
[1518-08-31 00:32] falls asleep
[1518-05-03 00:30] wakes up
[1518-09-11 00:23] falls asleep
[1518-06-12 00:54] wakes up
[1518-11-08 23:50] Guard #1481 begins shift
[1518-08-31 00:59] wakes up
[1518-09-25 00:40] falls asleep
[1518-09-23 00:11] wakes up
[1518-06-06 00:57] wakes up
[1518-05-03 00:18] wakes up
[1518-09-22 00:24] falls asleep
[1518-09-06 00:50] falls asleep
[1518-05-01 00:46] falls asleep
[1518-05-07 00:46] wakes up
[1518-10-21 00:51] wakes up
[1518-05-08 00:34] wakes up
[1518-08-25 23:53] Guard #337 begins shift
[1518-08-04 00:19] wakes up
[1518-10-25 00:53] wakes up
[1518-09-26 00:53] wakes up
[1518-05-17 23:57] Guard #2089 begins shift
[1518-08-06 00:01] Guard #631 begins shift
[1518-07-04 00:43] wakes up
[1518-06-22 00:57] falls asleep
[1518-05-17 00:01] wakes up
[1518-05-14 00:19] wakes up
[1518-05-25 23:56] Guard #89 begins shift
[1518-08-11 00:44] wakes up
[1518-11-03 00:50] wakes up
[1518-06-10 00:03] Guard #631 begins shift
[1518-06-11 00:42] wakes up
[1518-07-09 00:03] Guard #3119 begins shift
[1518-04-02 00:34] falls asleep
[1518-08-20 00:00] Guard #3449 begins shift
[1518-06-13 00:00] Guard #3019 begins shift
[1518-07-17 00:57] wakes up
[1518-03-23 00:37] wakes up
[1518-07-08 00:50] wakes up
[1518-09-04 00:30] wakes up
[1518-05-25 00:35] wakes up
[1518-07-28 00:21] falls asleep
[1518-09-04 00:56] falls asleep
[1518-06-19 00:11] falls asleep
[1518-07-03 00:00] falls asleep
[1518-06-17 23:56] Guard #2341 begins shift
[1518-04-28 00:14] falls asleep
[1518-11-04 00:57] wakes up
[1518-11-04 00:11] falls asleep
[1518-09-15 00:41] falls asleep
[1518-07-23 23:59] Guard #1481 begins shift
[1518-11-06 23:58] Guard #3119 begins shift
[1518-10-31 00:22] falls asleep
[1518-04-04 00:59] wakes up
[1518-08-31 00:50] falls asleep
[1518-11-23 00:03] Guard #1481 begins shift
[1518-09-08 23:56] Guard #1973 begins shift
[1518-04-13 00:55] falls asleep
[1518-09-21 00:01] Guard #1973 begins shift
[1518-05-02 23:46] Guard #631 begins shift
[1518-09-11 00:00] Guard #2617 begins shift
[1518-09-22 23:49] Guard #2617 begins shift
[1518-09-01 23:58] Guard #2617 begins shift
[1518-11-10 00:52] wakes up
[1518-11-21 00:03] falls asleep
[1518-06-09 00:46] wakes up
[1518-11-18 00:37] wakes up
[1518-03-30 00:30] wakes up
[1518-08-09 00:34] wakes up
[1518-04-02 00:00] Guard #2791 begins shift
[1518-05-01 00:06] falls asleep
[1518-03-19 00:58] wakes up
[1518-08-19 00:30] falls asleep
[1518-06-07 00:54] falls asleep
[1518-11-01 00:58] wakes up
[1518-08-28 00:22] wakes up
[1518-09-16 00:09] falls asleep
[1518-03-21 00:44] wakes up
[1518-05-08 00:57] falls asleep
[1518-07-27 23:56] Guard #809 begins shift
[1518-05-19 00:53] falls asleep
[1518-10-12 00:37] falls asleep
[1518-09-24 00:51] wakes up
[1518-11-22 00:09] wakes up
[1518-09-13 00:23] wakes up
[1518-09-05 00:02] Guard #2341 begins shift
[1518-08-08 00:53] wakes up
[1518-07-22 00:12] falls asleep
[1518-11-16 00:59] wakes up
[1518-05-21 00:02] Guard #89 begins shift
[1518-03-23 00:45] falls asleep
[1518-04-04 00:55] falls asleep
[1518-10-25 00:57] falls asleep
[1518-07-31 00:52] wakes up
[1518-04-02 23:49] Guard #947 begins shift
[1518-04-18 00:17] wakes up
[1518-10-08 00:08] falls asleep
[1518-05-06 00:23] falls asleep
[1518-11-09 00:04] falls asleep
[1518-09-01 00:52] falls asleep
[1518-08-14 00:00] Guard #499 begins shift
[1518-07-11 00:20] falls asleep
[1518-03-26 00:40] falls asleep
[1518-06-01 23:58] Guard #337 begins shift
[1518-07-26 00:07] falls asleep
[1518-04-13 00:25] falls asleep
[1518-09-26 00:03] Guard #1973 begins shift
[1518-06-07 00:56] wakes up
[1518-06-21 00:22] falls asleep
[1518-11-12 00:55] wakes up
[1518-08-21 23:56] Guard #3449 begins shift
[1518-04-07 00:03] Guard #809 begins shift
[1518-10-01 00:43] wakes up
[1518-03-31 00:39] falls asleep
[1518-07-25 00:30] falls asleep
[1518-07-29 00:16] falls asleep
[1518-07-28 00:23] wakes up
[1518-07-27 00:00] Guard #2617 begins shift
[1518-06-04 00:55] wakes up
[1518-03-24 00:59] wakes up
[1518-10-29 00:56] falls asleep
[1518-06-10 00:07] falls asleep
[1518-08-29 00:01] Guard #3449 begins shift
[1518-09-09 00:37] falls asleep
[1518-03-23 23:58] Guard #787 begins shift
[1518-03-21 00:01] Guard #2089 begins shift
[1518-03-24 00:56] falls asleep
[1518-07-07 00:40] falls asleep
[1518-10-24 00:03] falls asleep
[1518-05-01 00:50] wakes up
[1518-11-14 00:52] wakes up
[1518-05-19 00:22] falls asleep
[1518-05-24 00:03] Guard #373 begins shift
[1518-10-22 00:55] wakes up
[1518-06-12 00:00] falls asleep
[1518-10-30 00:59] wakes up
[1518-08-30 00:02] Guard #2617 begins shift
[1518-10-24 00:23] wakes up
[1518-03-27 00:26] falls asleep
[1518-07-26 00:50] wakes up
[1518-08-06 00:45] falls asleep
[1518-06-22 00:59] wakes up
[1518-09-17 00:18] falls asleep
[1518-09-02 00:37] falls asleep
[1518-11-21 00:31] falls asleep
[1518-09-23 00:05] falls asleep
[1518-10-24 00:47] wakes up
[1518-06-06 00:45] falls asleep
[1518-05-09 00:54] wakes up
[1518-07-13 00:53] wakes up
[1518-06-15 23:50] Guard #3449 begins shift
[1518-08-03 00:46] wakes up
[1518-06-16 00:01] falls asleep
[1518-07-25 00:20] wakes up
[1518-09-11 00:56] wakes up
[1518-10-04 00:47] falls asleep
[1518-09-19 00:01] Guard #1481 begins shift
[1518-11-08 00:46] wakes up
[1518-06-09 00:36] falls asleep
[1518-08-24 00:01] falls asleep
[1518-08-21 00:56] wakes up
[1518-11-13 00:07] falls asleep
[1518-07-14 00:51] wakes up
[1518-10-15 00:41] wakes up
[1518-07-04 00:02] falls asleep
[1518-06-06 00:39] wakes up
[1518-06-20 00:06] falls asleep
[1518-06-08 00:15] falls asleep
[1518-07-15 00:37] wakes up
[1518-06-29 00:42] wakes up
[1518-04-04 00:51] wakes up
[1518-03-24 00:41] wakes up
[1518-09-21 23:56] Guard #1481 begins shift
[1518-11-18 00:01] falls asleep
[1518-07-19 00:44] falls asleep
[1518-08-14 00:58] wakes up
[1518-07-11 00:10] falls asleep
[1518-08-19 00:04] Guard #2341 begins shift
[1518-08-13 00:56] falls asleep
[1518-08-11 00:00] Guard #3019 begins shift
[1518-06-13 23:46] Guard #499 begins shift
[1518-04-17 00:04] Guard #3449 begins shift
[1518-11-20 00:17] falls asleep
[1518-05-13 23:59] Guard #1367 begins shift
[1518-09-20 00:42] wakes up
[1518-11-20 00:55] wakes up
[1518-10-09 00:44] wakes up
[1518-05-13 00:38] wakes up
[1518-06-30 00:54] wakes up
[1518-11-13 00:23] wakes up
[1518-03-24 00:06] falls asleep
[1518-05-13 00:12] falls asleep
[1518-05-09 00:35] falls asleep
[1518-03-26 00:52] falls asleep
[1518-06-25 00:07] falls asleep
[1518-11-03 00:55] falls asleep
[1518-06-15 00:01] Guard #3449 begins shift
[1518-05-18 00:44] falls asleep
[1518-04-19 00:38] wakes up
[1518-11-07 00:26] falls asleep
[1518-09-18 00:45] wakes up
[1518-05-14 00:16] falls asleep
[1518-11-12 00:44] falls asleep
[1518-09-19 00:38] falls asleep
[1518-08-03 00:56] wakes up
[1518-04-27 00:44] falls asleep
[1518-04-22 00:00] Guard #947 begins shift
[1518-08-03 00:03] Guard #2243 begins shift
[1518-10-30 00:22] falls asleep
[1518-03-25 00:58] wakes up
[1518-08-28 00:18] falls asleep
[1518-05-10 00:43] wakes up
[1518-07-07 00:27] falls asleep
[1518-06-26 00:18] wakes up
[1518-03-21 00:58] wakes up
[1518-07-10 00:48] falls asleep
[1518-10-31 00:44] wakes up
[1518-04-23 00:19] falls asleep
[1518-09-20 00:04] Guard #499 begins shift
[1518-10-08 00:41] wakes up
[1518-08-05 00:45] falls asleep
[1518-04-25 00:35] falls asleep
[1518-09-17 00:57] wakes up
[1518-10-19 00:09] falls asleep
[1518-09-06 23:50] Guard #2791 begins shift
[1518-11-20 00:47] falls asleep
[1518-07-18 23:58] Guard #499 begins shift
[1518-08-21 00:12] falls asleep
[1518-09-13 00:39] wakes up
[1518-11-07 00:23] wakes up
[1518-08-23 23:47] Guard #1481 begins shift
[1518-10-31 00:00] Guard #89 begins shift
[1518-07-29 00:13] wakes up
[1518-04-20 23:46] Guard #1481 begins shift
[1518-03-22 00:18] falls asleep
[1518-11-06 00:03] Guard #337 begins shift
[1518-07-27 00:08] falls asleep
[1518-05-12 00:35] falls asleep
[1518-05-18 00:20] falls asleep
[1518-04-14 00:41] falls asleep
[1518-08-06 00:33] wakes up
[1518-04-07 00:42] wakes up
[1518-09-18 00:58] wakes up
[1518-03-27 00:35] falls asleep
[1518-08-30 00:22] falls asleep
[1518-07-18 00:56] falls asleep
[1518-05-01 23:56] Guard #2791 begins shift
[1518-06-27 23:46] Guard #1973 begins shift
[1518-06-26 00:49] falls asleep
[1518-06-21 00:41] wakes up
[1518-05-06 00:03] wakes up
[1518-07-04 00:14] wakes up
[1518-04-07 23:56] Guard #1951 begins shift
[1518-07-27 00:54] wakes up
[1518-06-26 00:37] falls asleep
[1518-06-30 00:52] falls asleep
[1518-10-27 00:50] wakes up
[1518-10-23 00:50] wakes up
[1518-06-30 00:29] wakes up
[1518-05-07 00:51] falls asleep
[1518-10-24 00:35] falls asleep
[1518-09-03 00:12] falls asleep
[1518-08-10 00:32] falls asleep
[1518-08-07 00:33] falls asleep
[1518-10-08 00:22] falls asleep
[1518-08-16 00:16] falls asleep
[1518-03-25 00:26] falls asleep
[1518-05-22 00:04] Guard #3449 begins shift
[1518-08-26 23:58] Guard #787 begins shift
[1518-05-26 00:55] wakes up
[1518-09-15 00:13] falls asleep
[1518-09-06 00:38] falls asleep
[1518-04-07 00:37] falls asleep
[1518-06-28 00:59] wakes up
[1518-05-07 23:47] Guard #1367 begins shift
[1518-03-21 00:54] falls asleep
[1518-05-09 00:49] wakes up
[1518-08-01 23:57] Guard #1481 begins shift
[1518-05-08 00:02] falls asleep
[1518-08-02 00:57] wakes up
[1518-04-21 00:05] falls asleep
[1518-09-14 00:01] Guard #1951 begins shift
[1518-04-05 00:56] wakes up
[1518-06-27 00:49] falls asleep
[1518-07-15 00:01] falls asleep
[1518-08-31 23:59] Guard #809 begins shift
[1518-08-09 23:56] Guard #809 begins shift
[1518-04-11 00:19] falls asleep
[1518-11-14 00:49] falls asleep
[1518-04-19 23:57] Guard #3067 begins shift
[1518-03-28 00:12] falls asleep
[1518-10-27 00:02] Guard #631 begins shift
[1518-07-14 00:25] falls asleep
[1518-04-09 00:04] Guard #2617 begins shift
[1518-10-05 00:44] wakes up
[1518-08-13 00:03] Guard #439 begins shift
[1518-08-23 00:13] falls asleep
[1518-10-08 00:09] wakes up
[1518-08-26 00:54] wakes up
[1518-09-18 00:38] falls asleep
[1518-07-11 23:59] Guard #499 begins shift
[1518-10-25 00:07] falls asleep
[1518-06-10 00:53] wakes up
[1518-07-02 00:20] falls asleep
[1518-11-16 00:47] falls asleep
[1518-11-15 00:27] falls asleep
[1518-08-25 00:20] falls asleep
[1518-05-30 00:37] falls asleep
[1518-09-10 00:26] falls asleep
[1518-08-17 00:16] wakes up
[1518-10-15 00:44] falls asleep
[1518-10-05 00:38] falls asleep
[1518-03-26 00:53] wakes up
[1518-11-15 00:58] wakes up
[1518-10-13 23:56] Guard #947 begins shift
[1518-10-14 23:58] Guard #3449 begins shift
[1518-05-10 23:59] Guard #631 begins shift
[1518-08-12 00:11] falls asleep
[1518-03-31 00:25] wakes up
[1518-06-05 00:15] falls asleep
[1518-09-07 00:00] falls asleep
[1518-05-11 00:48] wakes up
[1518-09-03 00:53] wakes up
[1518-05-19 00:00] Guard #439 begins shift
[1518-04-13 23:59] Guard #499 begins shift
[1518-08-22 23:56] Guard #1481 begins shift
[1518-10-14 00:06] falls asleep
[1518-04-23 23:56] Guard #947 begins shift
[1518-04-15 00:44] wakes up
[1518-09-12 00:50] wakes up
[1518-08-13 00:30] falls asleep
[1518-07-28 23:52] Guard #809 begins shift
[1518-11-08 00:05] falls asleep
[1518-10-13 00:50] wakes up
[1518-10-03 00:01] Guard #2791 begins shift
[1518-04-26 00:16] falls asleep
[1518-05-20 00:22] falls asleep
[1518-04-18 00:03] falls asleep
[1518-10-01 00:00] Guard #787 begins shift
[1518-09-25 00:42] wakes up
[1518-06-07 00:26] falls asleep
[1518-09-04 00:00] Guard #2341 begins shift
[1518-07-10 00:33] wakes up
[1518-10-18 00:49] falls asleep
[1518-06-28 00:04] falls asleep
[1518-11-21 00:18] wakes up
[1518-07-23 00:57] wakes up
[1518-08-20 00:35] falls asleep
[1518-06-19 00:25] wakes up
[1518-04-21 00:14] wakes up
[1518-06-26 23:59] Guard #337 begins shift
[1518-06-08 00:01] Guard #499 begins shift
[1518-07-12 00:33] falls asleep
[1518-09-09 00:41] wakes up
[1518-04-17 23:49] Guard #89 begins shift
[1518-06-11 23:53] Guard #2089 begins shift
[1518-04-26 23:58] Guard #3019 begins shift
[1518-08-10 00:52] wakes up
[1518-11-19 00:47] wakes up
[1518-06-27 00:19] falls asleep
[1518-09-24 00:27] falls asleep
[1518-07-09 00:36] wakes up
[1518-08-15 00:00] Guard #337 begins shift
[1518-05-18 00:32] wakes up
[1518-07-25 00:01] falls asleep
[1518-06-05 00:00] Guard #337 begins shift
[1518-10-15 23:58] Guard #439 begins shift
[1518-09-04 00:57] wakes up
[1518-04-10 00:37] wakes up
[1518-07-04 00:48] falls asleep
[1518-09-13 00:20] falls asleep
[1518-11-01 00:34] falls asleep
[1518-06-29 23:54] Guard #337 begins shift
[1518-08-07 00:26] wakes up
[1518-05-08 23:56] Guard #2089 begins shift
[1518-04-02 00:59] wakes up
[1518-06-11 00:03] Guard #1481 begins shift
[1518-10-19 00:50] wakes up
[1518-06-06 00:51] falls asleep
[1518-11-06 00:38] falls asleep
[1518-03-29 00:42] falls asleep
[1518-08-12 00:00] Guard #1973 begins shift
[1518-08-31 00:02] Guard #439 begins shift
[1518-08-09 00:09] falls asleep
[1518-04-03 00:44] wakes up
[1518-05-07 00:00] Guard #631 begins shift
[1518-03-27 00:49] wakes up
[1518-10-10 00:59] wakes up
[1518-06-04 00:21] falls asleep
[1518-03-23 00:51] wakes up
[1518-08-18 00:52] wakes up
[1518-11-14 00:40] wakes up
[1518-06-25 23:50] Guard #631 begins shift
[1518-10-05 00:20] wakes up
[1518-05-11 00:32] falls asleep
[1518-06-19 00:42] falls asleep
[1518-09-12 00:01] Guard #2617 begins shift
[1518-08-30 00:24] wakes up
[1518-10-15 00:47] wakes up
[1518-05-17 00:55] wakes up
[1518-04-07 00:56] wakes up
[1518-10-16 00:43] wakes up
[1518-08-17 23:57] Guard #337 begins shift
[1518-08-07 00:00] Guard #2243 begins shift
[1518-06-11 00:58] wakes up
[1518-05-12 00:58] wakes up
[1518-10-05 00:09] falls asleep
[1518-05-07 00:56] wakes up
[1518-10-08 00:56] wakes up
[1518-03-21 00:32] falls asleep
[1518-11-20 00:03] Guard #1973 begins shift
[1518-05-05 23:53] Guard #787 begins shift
[1518-08-11 00:41] falls asleep
[1518-05-30 00:02] Guard #631 begins shift
[1518-10-10 00:55] falls asleep
[1518-06-03 00:40] wakes up
[1518-03-29 00:46] wakes up
[1518-11-10 00:03] Guard #787 begins shift
[1518-08-21 00:44] falls asleep
[1518-06-10 00:34] falls asleep
[1518-06-20 00:03] Guard #809 begins shift
[1518-07-21 00:04] Guard #373 begins shift
[1518-05-06 00:47] wakes up
[1518-04-10 00:35] falls asleep
[1518-04-05 00:37] wakes up
[1518-06-19 00:32] wakes up
[1518-04-04 00:22] wakes up
[1518-06-30 00:04] falls asleep
[1518-04-25 00:05] falls asleep
[1518-09-15 23:57] Guard #2243 begins shift
[1518-07-10 00:10] falls asleep
[1518-10-21 00:02] falls asleep
[1518-10-20 00:01] Guard #1151 begins shift
[1518-03-27 00:31] wakes up
[1518-04-22 23:59] Guard #1367 begins shift
[1518-11-09 00:37] wakes up
[1518-10-11 00:35] falls asleep
[1518-10-28 00:42] wakes up
[1518-11-21 00:04] wakes up
[1518-08-15 00:13] falls asleep
[1518-10-13 00:04] Guard #1973 begins shift
[1518-04-09 00:47] falls asleep
[1518-11-17 00:37] falls asleep
[1518-03-31 23:58] Guard #499 begins shift
[1518-05-10 00:03] Guard #3449 begins shift
[1518-11-21 00:07] falls asleep
[1518-09-04 00:18] falls asleep
[1518-09-28 00:51] falls asleep
[1518-05-19 23:58] Guard #2089 begins shift
[1518-04-09 23:51] Guard #809 begins shift
[1518-07-28 00:53] wakes up
[1518-10-06 00:16] falls asleep
[1518-03-23 00:25] falls asleep
[1518-07-01 00:29] falls asleep
[1518-04-05 00:10] falls asleep
[1518-08-02 00:43] falls asleep
[1518-06-24 00:14] falls asleep
[1518-04-09 00:26] wakes up
[1518-06-29 00:05] falls asleep
[1518-06-01 00:35] falls asleep
[1518-06-17 00:57] wakes up
[1518-09-13 00:30] falls asleep
[1518-09-15 00:00] Guard #337 begins shift
[1518-05-19 00:39] wakes up
[1518-05-09 00:52] falls asleep
[1518-10-17 00:04] Guard #1151 begins shift
[1518-10-06 23:57] Guard #809 begins shift
[1518-08-04 00:15] falls asleep
[1518-11-19 00:00] Guard #2791 begins shift
[1518-04-03 00:05] falls asleep
[1518-08-17 00:52] wakes up
[1518-04-19 00:21] falls asleep
[1518-10-18 00:51] wakes up
[1518-10-11 00:02] Guard #1951 begins shift
[1518-06-06 00:02] Guard #2791 begins shift
[1518-10-07 00:52] wakes up
[1518-11-08 00:35] falls asleep
[1518-09-23 00:14] falls asleep
[1518-03-23 00:04] Guard #1481 begins shift
[1518-06-19 00:29] falls asleep
[1518-05-14 23:47] Guard #947 begins shift
[1518-09-06 00:57] wakes up
[1518-10-03 00:14] falls asleep
[1518-06-04 00:00] Guard #787 begins shift
[1518-10-05 23:58] Guard #787 begins shift
[1518-09-11 00:39] falls asleep
[1518-04-26 00:56] wakes up`;



let arr = str.split('\n').map(a => a.split(/[\]\:]/));
let guardArr = {};

arr.sort((a, b) => {
  return a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : (a[1] > b[1] ? 1 : (a[1] < b[1] ? -1 : 0)));
});

let curGuard = '0';
let startedSleep = null;
let timeAsleep = 0;
let maxTimeAsleep = 0;
let maxGuard = '0';
for (let i = 0; i < arr.length; i++) {
  if (arr[i][2].includes("begins shift")) {
    if (startedSleep !== null) {
      log("fail");
      timeAsleep += 60 - startedSleep;
    }
    if (timeAsleep > maxTimeAsleep) {
      maxGuard = curGuard;
      maxTimeAsleep = timeAsleep;
    }
    startedSleep = null;
    timeAsleep = 0;
    let gnum = arr[i][2].split(/[\ \#]/)[3];
    curGuard = gnum;
    if (!guardArr[curGuard]) {
      guardArr[curGuard] = {};
    }
  }
  if (arr[i][2].includes("falls asleep")) {
    startedSleep = parseInt(arr[i][1]);
  }
  if (arr[i][2].includes("wakes up")) {
    cur = parseInt(arr[i][1]);
    for (let i = startedSleep; i < cur; i++) {
      guardArr[curGuard][i] = (guardArr[curGuard][i] || 0) + 1;
    }
    timeAsleep += cur - startedSleep;
    startedSleep = null;
  }
}
let mgs = 0;
let mg = null;
for (let i in guardArr) {
  let sum = 0;
  for (let j in guardArr[i]) {
    sum = Math.max(sum, guardArr[i][j]);
  }
  if (sum > mgs) {
    mgs = sum;
    mg = i;
  }
}
log(mg);
log(guardArr[mg]);
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

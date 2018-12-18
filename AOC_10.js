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

let str = `position=< 54347, -32361> velocity=<-5,  3>
position=<-21463, -32354> velocity=< 2,  3>
position=< 54347,  32630> velocity=<-5, -3>
position=< 21839,  32628> velocity=<-2, -3>
position=<-21490, -21528> velocity=< 2,  2>
position=< 54359,  43457> velocity=<-5, -4>
position=<-21470, -10698> velocity=< 2,  1>
position=<-43100, -21528> velocity=< 4,  2>
position=< 21842, -21524> velocity=<-2,  2>
position=< 11011, -32358> velocity=<-1,  3>
position=<-10651, -54021> velocity=< 1,  5>
position=<-10651, -32355> velocity=< 1,  3>
position=< 43533, -21523> velocity=<-4,  2>
position=< 32700, -43185> velocity=<-3,  4>
position=< 54367,  43459> velocity=<-5, -4>
position=< 32697,  43463> velocity=<-3, -4>
position=< 11043,  43463> velocity=<-1, -4>
position=< 11051, -21531> velocity=<-1,  2>
position=<-21445,  21794> velocity=< 2, -2>
position=< 43544,  54288> velocity=<-4, -5>
position=< 43528, -21531> velocity=<-4,  2>
position=<-10651,  43463> velocity=< 1, -4>
position=<-53930,  54294> velocity=< 5, -5>
position=< 21882, -43187> velocity=<-2,  4>
position=< 32665,  43460> velocity=<-3, -4>
position=<-10646, -43191> velocity=< 1,  4>
position=< 32709, -21528> velocity=<-3,  2>
position=< 11046,  21792> velocity=<-1, -2>
position=<-53991,  43457> velocity=< 5, -4>
position=<-53940, -10697> velocity=< 5,  1>
position=< 43545,  21801> velocity=<-4, -2>
position=< 11043, -32361> velocity=<-1,  3>
position=< 43513,  43463> velocity=<-4, -4>
position=<-10627,  21794> velocity=< 1, -2>
position=< 32706,  10965> velocity=<-3, -1>
position=<-21497,  21792> velocity=< 2, -2>
position=< 54329,  54289> velocity=<-5, -5>
position=< 32693,  10961> velocity=<-3, -1>
position=< 43501, -54025> velocity=<-4,  5>
position=< 54372,  21795> velocity=<-5, -2>
position=< 11037,  43463> velocity=<-1, -4>
position=< 43496, -32357> velocity=<-4,  3>
position=<-43147, -21529> velocity=< 4,  2>
position=<-21442, -21531> velocity=< 2,  2>
position=< 11056,  10961> velocity=<-1, -1>
position=< 21826,  43455> velocity=<-2, -4>
position=< 43539, -32359> velocity=<-4,  3>
position=<-32313, -54025> velocity=< 3,  5>
position=< 43490,  54294> velocity=<-4, -5>
position=< 21839,  10970> velocity=<-2, -1>
position=< 21853,  54294> velocity=<-2, -5>
position=< 10996,  10961> velocity=<-1, -1>
position=<-43125, -54025> velocity=< 4,  5>
position=<-21477, -21529> velocity=< 2,  2>
position=<-10667,  43463> velocity=< 1, -4>
position=<-53951,  54289> velocity=< 5, -5>
position=<-32273, -43187> velocity=< 3,  4>
position=<-21462, -32355> velocity=< 2,  3>
position=<-53954,  54286> velocity=< 5, -5>
position=< 43496,  10970> velocity=<-4, -1>
position=<-32289,  54291> velocity=< 3, -5>
position=< 21834,  54285> velocity=<-2, -5>
position=<-43120, -54017> velocity=< 4,  5>
position=< 21834, -21527> velocity=<-2,  2>
position=<-43099, -43185> velocity=< 4,  4>
position=< 11032, -32355> velocity=<-1,  3>
position=< 54377, -10697> velocity=<-5,  1>
position=< 54351, -10696> velocity=<-5,  1>
position=< 43544, -43193> velocity=<-4,  4>
position=<-53987,  54294> velocity=< 5, -5>
position=<-43140, -10697> velocity=< 4,  1>
position=< 32659,  21801> velocity=<-3, -2>
position=<-53935,  21792> velocity=< 5, -2>
position=<-21493,  54288> velocity=< 2, -5>
position=< 43504,  32628> velocity=<-4, -3>
position=< 21854, -21524> velocity=<-2,  2>
position=< 21839, -43193> velocity=<-2,  4>
position=<-32271, -10692> velocity=< 3,  1>
position=<-32313, -10696> velocity=< 3,  1>
position=<-32288, -54016> velocity=< 3,  5>
position=< 21826, -10699> velocity=<-2,  1>
position=< 21842, -54025> velocity=<-2,  5>
position=<-32316, -43188> velocity=< 3,  4>
position=< 32689, -43191> velocity=<-3,  4>
position=<-43160, -54025> velocity=< 4,  5>
position=<-43139,  43455> velocity=< 4, -4>
position=< 32714,  43458> velocity=<-3, -4>
position=< 43501,  54293> velocity=<-4, -5>
position=<-21446,  10965> velocity=< 2, -1>
position=< 43522, -21532> velocity=<-4,  2>
position=< 32677, -43190> velocity=<-3,  4>
position=< 11051,  43462> velocity=<-1, -4>
position=<-32321,  32628> velocity=< 3, -3>
position=<-53932, -54025> velocity=< 5,  5>
position=<-10611,  21798> velocity=< 1, -2>
position=<-32276,  54287> velocity=< 3, -5>
position=< 21839, -54019> velocity=<-2,  5>
position=<-53975, -54018> velocity=< 5,  5>
position=<-53978, -21532> velocity=< 5,  2>
position=<-53959, -43192> velocity=< 5,  4>
position=<-21458, -10699> velocity=< 2,  1>
position=<-43158,  21792> velocity=< 4, -2>
position=<-53983, -32361> velocity=< 5,  3>
position=<-43120,  10961> velocity=< 4, -1>
position=< 54367,  10961> velocity=<-5, -1>
position=<-10615, -43194> velocity=< 1,  4>
position=< 43496, -10698> velocity=<-4,  1>
position=<-10665, -32354> velocity=< 1,  3>
position=<-21470,  54288> velocity=< 2, -5>
position=< 11043, -54025> velocity=<-1,  5>
position=< 43504,  43458> velocity=<-4, -4>
position=<-53931,  32623> velocity=< 5, -3>
position=<-32271,  32627> velocity=< 3, -3>
position=< 11035,  43462> velocity=<-1, -4>
position=< 10999, -54025> velocity=<-1,  5>
position=< 32662,  10963> velocity=<-3, -1>
position=<-32272,  54289> velocity=< 3, -5>
position=<-32289,  54286> velocity=< 3, -5>
position=< 11043, -54023> velocity=<-1,  5>
position=< 21831,  32630> velocity=<-2, -3>
position=<-21498,  43454> velocity=< 2, -4>
position=<-21449,  43454> velocity=< 2, -4>
position=<-10631, -43189> velocity=< 1,  4>
position=< 11051,  54289> velocity=<-1, -5>
position=< 11011, -32360> velocity=<-1,  3>
position=<-21482,  32626> velocity=< 2, -3>
position=<-32289,  21796> velocity=< 3, -2>
position=< 10995,  43457> velocity=<-1, -4>
position=<-53982, -21528> velocity=< 5,  2>
position=<-10662, -21525> velocity=< 1,  2>
position=<-53954, -43188> velocity=< 5,  4>
position=< 21834,  21801> velocity=<-2, -2>
position=< 11027,  54292> velocity=<-1, -5>
position=< 21874,  43455> velocity=<-2, -4>
position=<-21488, -43190> velocity=< 2,  4>
position=<-10647,  54285> velocity=< 1, -5>
position=<-53955, -54025> velocity=< 5,  5>
position=<-43123,  43459> velocity=< 4, -4>
position=< 10995,  32628> velocity=<-1, -3>
position=<-21485,  43457> velocity=< 2, -4>
position=<-32313, -32354> velocity=< 3,  3>
position=< 32657, -43190> velocity=<-3,  4>
position=< 10995, -10697> velocity=<-1,  1>
position=< 11044,  54289> velocity=<-1, -5>
position=<-53941, -10701> velocity=< 5,  1>
position=<-53935,  21792> velocity=< 5, -2>
position=< 43508, -54021> velocity=<-4,  5>
position=<-43157, -10701> velocity=< 4,  1>
position=<-21458,  32631> velocity=< 2, -3>
position=< 21834,  43462> velocity=<-2, -4>
position=<-10611, -21527> velocity=< 1,  2>
position=< 54347, -43193> velocity=<-5,  4>
position=<-32293, -21532> velocity=< 3,  2>
position=<-10666, -32359> velocity=< 1,  3>
position=< 43520,  54286> velocity=<-4, -5>
position=< 54319, -32361> velocity=<-5,  3>
position=<-32326,  10965> velocity=< 3, -1>
position=<-53955, -21527> velocity=< 5,  2>
position=<-53939,  54289> velocity=< 5, -5>
position=<-10640, -32363> velocity=< 1,  3>
position=<-53987,  43463> velocity=< 5, -4>
position=<-53978,  54289> velocity=< 5, -5>
position=< 32708, -54025> velocity=<-3,  5>
position=< 11056,  32623> velocity=<-1, -3>
position=<-43147,  43459> velocity=< 4, -4>
position=<-32308, -32362> velocity=< 3,  3>
position=<-53935, -43194> velocity=< 5,  4>
position=< 11012, -10697> velocity=<-1,  1>
position=<-53930, -21532> velocity=< 5,  2>
position=< 10995, -54018> velocity=<-1,  5>
position=<-43157,  10970> velocity=< 4, -1>
position=<-21470, -10698> velocity=< 2,  1>
position=< 21862, -10693> velocity=<-2,  1>
position=<-32316, -10699> velocity=< 3,  1>
position=< 32707, -10697> velocity=<-3,  1>
position=<-43107, -21529> velocity=< 4,  2>
position=<-32324, -10700> velocity=< 3,  1>
position=<-10639,  54290> velocity=< 1, -5>
position=<-32289, -21528> velocity=< 3,  2>
position=<-21449, -32363> velocity=< 2,  3>
position=<-32321, -54016> velocity=< 3,  5>
position=< 54340,  32626> velocity=<-5, -3>
position=<-21466,  43458> velocity=< 2, -4>
position=<-10648,  54285> velocity=< 1, -5>
position=< 54327, -43190> velocity=<-5,  4>
position=<-53958, -43185> velocity=< 5,  4>
position=< 32678,  43456> velocity=<-3, -4>
position=< 11007,  10965> velocity=<-1, -1>
position=<-32300,  10961> velocity=< 3, -1>
position=<-43125,  43459> velocity=< 4, -4>
position=<-53975,  32630> velocity=< 5, -3>
position=< 32716, -43185> velocity=<-3,  4>
position=< 32662, -10693> velocity=<-3,  1>
position=<-10667,  54285> velocity=< 1, -5>
position=< 54347, -32362> velocity=<-5,  3>
position=< 32676,  54289> velocity=<-3, -5>
position=< 11023,  10967> velocity=<-1, -1>
position=<-21482,  32631> velocity=< 2, -3>
position=< 21876, -10701> velocity=<-2,  1>
position=< 32683, -21523> velocity=<-3,  2>
position=< 32681, -21525> velocity=<-3,  2>
position=< 11011, -32359> velocity=<-1,  3>
position=<-32294,  10961> velocity=< 3, -1>
position=< 32716, -10697> velocity=<-3,  1>
position=< 21866, -10694> velocity=<-2,  1>
position=<-32312, -43194> velocity=< 3,  4>
position=< 21871, -32354> velocity=<-2,  3>
position=< 21876,  21796> velocity=<-2, -2>
position=<-43141, -21532> velocity=< 4,  2>
position=<-43158, -10697> velocity=< 4,  1>
position=< 43496, -21525> velocity=<-4,  2>
position=<-10651,  43455> velocity=< 1, -4>
position=<-21466,  21799> velocity=< 2, -2>
position=< 43488, -10697> velocity=<-4,  1>
position=<-53973,  54289> velocity=< 5, -5>
position=<-53986, -32358> velocity=< 5,  3>
position=<-21494,  43454> velocity=< 2, -4>
position=<-21442,  21796> velocity=< 2, -2>
position=< 21830,  54289> velocity=<-2, -5>
position=<-43112,  32631> velocity=< 4, -3>
position=< 43545, -43194> velocity=<-4,  4>
position=< 32682,  21801> velocity=<-3, -2>
position=< 21875,  32627> velocity=<-2, -3>
position=< 43501,  32629> velocity=<-4, -3>
position=<-10639,  21798> velocity=< 1, -2>
position=< 21860,  10970> velocity=<-2, -1>
position=<-43152, -32358> velocity=< 4,  3>
position=< 11027, -43190> velocity=<-1,  4>
position=< 11011,  10962> velocity=<-1, -1>
position=< 32715, -21532> velocity=<-3,  2>
position=<-53975,  43456> velocity=< 5, -4>
position=<-10639,  10965> velocity=< 1, -1>
position=<-21466,  54289> velocity=< 2, -5>
position=<-21470, -43188> velocity=< 2,  4>
position=<-32304, -32354> velocity=< 3,  3>
position=<-10634, -43194> velocity=< 1,  4>
position=< 11043, -32355> velocity=<-1,  3>
position=<-53951, -43192> velocity=< 5,  4>
position=< 32657, -21526> velocity=<-3,  2>
position=< 32713, -43185> velocity=<-3,  4>
position=< 11035, -21523> velocity=<-1,  2>
position=< 21854,  54293> velocity=<-2, -5>
position=<-53957,  43454> velocity=< 5, -4>
position=< 32713,  54292> velocity=<-3, -5>
position=< 32694, -32358> velocity=<-3,  3>
position=< 11043,  21796> velocity=<-1, -2>
position=< 11000, -32357> velocity=<-1,  3>
position=< 43520, -21525> velocity=<-4,  2>
position=<-43160, -43188> velocity=< 4,  4>
position=< 11043,  10967> velocity=<-1, -1>
position=<-43117,  32632> velocity=< 4, -3>
position=< 11051,  43460> velocity=<-1, -4>
position=<-53963,  43461> velocity=< 5, -4>
position=<-53988,  10965> velocity=< 5, -1>
position=< 43546,  43454> velocity=<-4, -4>
position=< 32697,  10961> velocity=<-3, -1>
position=< 54338,  54285> velocity=<-5, -5>
position=< 43525,  43461> velocity=<-4, -4>
position=< 43536,  10961> velocity=<-4, -1>
position=<-10639,  43455> velocity=< 1, -4>
position=<-21458, -10698> velocity=< 2,  1>
position=< 32714,  54285> velocity=<-3, -5>
position=<-32325, -32359> velocity=< 3,  3>
position=<-43155,  54290> velocity=< 4, -5>
position=< 21842,  10967> velocity=<-2, -1>
position=<-21493, -32360> velocity=< 2,  3>
position=<-43149, -21528> velocity=< 4,  2>
position=< 10995,  32629> velocity=<-1, -3>
position=<-43158, -21532> velocity=< 4,  2>
position=<-21493,  32624> velocity=< 2, -3>
position=<-21441, -21532> velocity=< 2,  2>
position=< 54351,  21800> velocity=<-5, -2>
position=<-10639, -10694> velocity=< 1,  1>
position=<-21485,  43458> velocity=< 2, -4>
position=<-10609,  32623> velocity=< 1, -3>
position=< 32689, -43192> velocity=<-3,  4>
position=< 11055, -32354> velocity=<-1,  3>
position=<-10651,  43455> velocity=< 1, -4>
position=< 21874,  32630> velocity=<-2, -3>
position=<-21450, -10698> velocity=< 2,  1>
position=< 43536, -21529> velocity=<-4,  2>
position=<-43147, -21527> velocity=< 4,  2>
position=<-43120,  32628> velocity=< 4, -3>
position=< 32665, -54017> velocity=<-3,  5>
position=<-53946, -21523> velocity=< 5,  2>
position=< 54363,  10970> velocity=<-5, -1>
position=<-43110, -32363> velocity=< 4,  3>
position=< 32689, -21526> velocity=<-3,  2>
position=<-53938, -54024> velocity=< 5,  5>
position=<-53943, -54017> velocity=< 5,  5>
position=<-10656,  43458> velocity=< 1, -4>
position=< 54343,  43462> velocity=<-5, -4>
position=<-10627, -32354> velocity=< 1,  3>
position=< 54369, -10697> velocity=<-5,  1>
position=< 11011,  54287> velocity=<-1, -5>
position=<-10659, -43192> velocity=< 1,  4>
position=< 11039, -21523> velocity=<-1,  2>
position=< 21826,  43457> velocity=<-2, -4>
position=<-32308,  32624> velocity=< 3, -3>
position=<-53935, -32361> velocity=< 5,  3>
position=< 11011,  32630> velocity=<-1, -3>
position=<-43134,  21801> velocity=< 4, -2>
position=<-43131, -21532> velocity=< 4,  2>
position=<-32289, -54019> velocity=< 3,  5>
position=< 21883, -54021> velocity=<-2,  5>
position=<-43148, -21528> velocity=< 4,  2>
position=<-32289, -32362> velocity=< 3,  3>
position=<-43108,  32623> velocity=< 4, -3>
position=< 21868,  32632> velocity=<-2, -3>
position=<-10619,  54287> velocity=< 1, -5>
position=<-21493,  54288> velocity=< 2, -5>
position=< 54319,  32631> velocity=<-5, -3>
position=< 54346,  54294> velocity=<-5, -5>
position=< 11032,  54292> velocity=<-1, -5>
position=<-21458,  21798> velocity=< 2, -2>
position=< 32657,  43463> velocity=<-3, -4>
position=< 11051, -43186> velocity=<-1,  4>
position=<-32281, -43188> velocity=< 3,  4>
position=<-53943,  21793> velocity=< 5, -2>
position=<-10611,  43456> velocity=< 1, -4>
position=< 32676, -43190> velocity=<-3,  4>
position=<-43136,  10969> velocity=< 4, -1>
position=< 11008,  32630> velocity=<-1, -3>
position=< 54332, -21525> velocity=<-5,  2>
position=<-21494, -32363> velocity=< 2,  3>
position=<-10639, -21524> velocity=< 1,  2>
position=< 43499, -10697> velocity=<-4,  1>
position=<-43128, -32360> velocity=< 4,  3>
position=< 43525, -10692> velocity=<-4,  1>
position=< 11032,  54286> velocity=<-1, -5>
position=< 21834, -54024> velocity=<-2,  5>
position=<-53951,  10964> velocity=< 5, -1>
position=<-21497, -10692> velocity=< 2,  1>
position=<-32273, -10695> velocity=< 3,  1>
position=<-10627,  43454> velocity=< 1, -4>
position=< 54378,  10970> velocity=<-5, -1>
position=<-10633,  54294> velocity=< 1, -5>
position=<-10639, -32363> velocity=< 1,  3>
position=<-53959,  54287> velocity=< 5, -5>
position=< 11048,  10964> velocity=<-1, -1>
position=<-10649,  10961> velocity=< 1, -1>
position=< 43524,  43462> velocity=<-4, -4>
position=< 10995,  21801> velocity=<-1, -2>
position=< 43523,  32623> velocity=<-4, -3>
position=<-53932, -32354> velocity=< 5,  3>
position=< 11008,  54285> velocity=<-1, -5>
position=<-32301,  32627> velocity=< 3, -3>
position=< 11003, -54021> velocity=<-1,  5>
position=< 21858, -32362> velocity=<-2,  3>
position=<-43128, -32357> velocity=< 4,  3>
position=< 43504, -21532> velocity=<-4,  2>
position=<-53972,  54289> velocity=< 5, -5>
position=<-43104,  32627> velocity=< 4, -3>
position=< 54324,  10966> velocity=<-5, -1>
position=<-21442,  21794> velocity=< 2, -2>`;

let arr = str.split('\n').map(s => s.split(/[\,\<\>]/).map(a => a.trim()).filter((e, i) => (i === 1 || i === 2 || i === 4 || i === 5)).map(b => parseInt(b)));

function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}

function printarr(cnt) {
  let minx = 100000;
  let maxx = -100000;
  let miny = 100000;
  let maxy = -100000;
  for (let i = 0; i < arr.length; i++) {
    minx = Math.min(arr[i][0], minx);
    maxx = Math.max(arr[i][0], maxx);
    miny = Math.min(arr[i][1], miny);
    maxy = Math.max(arr[i][1], maxy);
  }
  maxx++;
  maxy++;

  if (minx >= 0 && miny >= 0 && maxx < 500 && maxy < 500) {
    let a1 = new Array(maxy);
    for (let i = 0; i < maxx; i++) {
      a1[i] = new Array(maxx).fill(' ');
    }
    //log(a1);
    for (let i = 0; i < arr.length; i++) {
      
      a1[arr[i][0]][arr[i][1]] = '#';
    }
    for (let i = 0; i < maxy; i++) {
      let str = '';
      for (let j = 0; j < maxx; j++) {
        str += a1[j][i];
      }
      console.log(str);
    }
    log(cnt);
    sleep(100);
    return true;
  }
  return false;
}

for (let j = 0; j < 100000; j++) {
  for (let i = 0; i < arr.length; i++) {
    arr[i][0] += arr[i][2];
    arr[i][1] += arr[i][3];
  }
  printarr(j+1);
}

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

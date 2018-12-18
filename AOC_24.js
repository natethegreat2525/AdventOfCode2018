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

let log = console.log;

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

function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

let str = `Immune System:
504 units each with 1697 hit points (weak to fire; immune to slashing) with an attack that does 28 fire damage at initiative 4
7779 units each with 6919 hit points (weak to bludgeoning) with an attack that does 7 cold damage at initiative 2
7193 units each with 13214 hit points (weak to cold, fire) with an attack that does 12 slashing damage at initiative 14
1898 units each with 3721 hit points (weak to bludgeoning) with an attack that does 16 cold damage at initiative 20
843 units each with 3657 hit points (immune to slashing) with an attack that does 41 cold damage at initiative 17
8433 units each with 3737 hit points (immune to radiation; weak to bludgeoning) with an attack that does 3 bludgeoning damage at initiative 8
416 units each with 3760 hit points (immune to fire, radiation) with an attack that does 64 radiation damage at initiative 3
5654 units each with 1858 hit points (weak to fire) with an attack that does 2 cold damage at initiative 6
2050 units each with 8329 hit points (immune to radiation, cold) with an attack that does 36 radiation damage at initiative 12
4130 units each with 3560 hit points with an attack that does 8 bludgeoning damage at initiative 13

Infection:
442 units each with 35928 hit points with an attack that does 149 bludgeoning damage at initiative 11
61 units each with 42443 hit points (immune to radiation) with an attack that does 1289 slashing damage at initiative 7
833 units each with 6874 hit points (weak to slashing) with an attack that does 14 bludgeoning damage at initiative 15
1832 units each with 61645 hit points with an attack that does 49 fire damage at initiative 9
487 units each with 26212 hit points (weak to fire) with an attack that does 107 bludgeoning damage at initiative 16
2537 units each with 18290 hit points (immune to cold, slashing, fire) with an attack that does 11 fire damage at initiative 19
141 units each with 14369 hit points (immune to bludgeoning) with an attack that does 178 radiation damage at initiative 5
3570 units each with 34371 hit points with an attack that does 18 radiation damage at initiative 10
5513 units each with 60180 hit points (weak to radiation, fire) with an attack that does 16 slashing damage at initiative 1
2378 units each with 20731 hit points (weak to bludgeoning) with an attack that does 17 radiation damage at initiative 18`;


let arr = str.split('\n').map(a => a.split(' ').filter(b => {
  return !isNaN(parseInt(b));
}).map(c => parseInt(c)));

let is = arr.slice(1, 11);
let inf = arr.slice(13, 23);

let boost = 30;


let wkMpIs = [
  "f", "b", "cf", "b", "", "b", "", "f", "", ""
]

let wkMpInf = [
  "", "", "s", "", "f", "", "", "", "rf", "b"
]

let imMpIs = [
  "s", "", "", "", "s", "r", "fr", "", "rc", ""
]

let imMpInf = [
  "", "r", "", "", "", "csf", "b", "", "", ""
]

let dmgIs = [
  "f", "c", "s", "c", "c", "b", "r", "c", "r", "b"
]

let dmgInf = [
  "b", "s", "b", "f", "b", "f", "r", "r", "s", "r"
]

for (let i in is) {
  is[i] = {
    typ: "is",
    num: is[i][0],
    hp: is[i][1],
    dmg: is[i][2] + boost,
    init: is[i][3],
    wkMp: wkMpIs[i],
    imMp: imMpIs[i],
    dmgMp: dmgIs[i]
  }
}

for (let i in inf) {
  inf[i] = {
    typ: "inf",
    num: inf[i][0],
    hp: inf[i][1],
    dmg: inf[i][2],
    init: inf[i][3],
    wkMp: wkMpInf[i],
    imMp: imMpInf[i],
    dmgMp: dmgInf[i]
  }
}
/*
is = [
  {
    num: 17,
    hp: 5390,
    dmg: 4507+boost,
    init: 2,
    wkMp: 'rb',
    imMp: '',
    dmgMp: 'f'
  },
  {
    num: 989,
    hp: 1274,
    dmg: 25+boost,
    init: 3,
    wkMp: 'bs',
    imMp: 'f',
    dmgMp: 's'
  }
];
inf = [
  {
    num: 801,
    hp: 4706,
    dmg: 116,
    init: 1,
    wkMp: 'r',
    imMp: '',
    dmgMp: 'b'
  },
  {
    num: 4485,
    hp: 2961,
    dmg: 12,
    init: 4,
    wkMp: 'fc',
    imMp: 'r',
    dmgMp: 's'
  }
];
*/
//units, hp, attack, initiative

is.sort((b, a) => {
  return a.num * a.dmg + a.init / 30 - b.num * b.dmg - b.init / 30;
});

inf.sort((b, a) => {
  return a.num * a.dmg + a.init / 30 - b.num * b.dmg - b.init / 30;
});

log(is);
log();  
log(inf);

function estDmg(a, b) {
  if (b.imMp.includes(a.dmgMp)) {
    return 0;
  }
  if (b.wkMp.includes(a.dmgMp)) {
    return 2 * a.num * a.dmg;
  }
  return a.num * a.dmg;
}

function getAttack(a, taken, others) {
  //lg ef power, highest init
  let maxDmg = 0;
  let maxOtherDmg = 0;
  let maxOtherInit = 0;
  let maxJ = -1;
  if (a.num === 0) {
    a.targ = -1;
    return -1;
  }
  for (let j in others) {
    if (taken[j] || others[j].num === 0) {
      continue;
    }
    let dm = estDmg(a, others[j]);
    if (dm === 0) {
      continue;
    }
    let otherDmg = others[j].num * others[j].dmg;
    let otherInit = others[j].init;
    if (dm > maxDmg) {
      maxDmg = dm;
      maxOtherDmg = otherDmg;
      maxOtherInit = otherInit;
      maxJ = j;
    } else if (dm === maxDmg) {
      if (otherDmg > maxOtherDmg) {
        maxJ = j;
        maxOtherDmg = otherDmg;
        maxOtherInit = otherInit;
      } else if (otherDmg === maxOtherDmg) {
        if (otherInit > maxOtherInit) {
          maxJ = j;
          maxOtherInit = otherInit;
        }
      }
    }
  }
  taken[maxJ] = true;
  a.targ = maxJ;
  return maxJ;
}

function doAttack(a, b) {
  let dmg = a.num * a.dmg;
  if (b.imMp.includes(a.dmgMp)) {
    return;
  }

  if (b.wkMp.includes(a.dmgMp)) {
    dmg *= 2;
  }

  let numKilled = Math.floor(dmg / b.hp);
  //log("Damage done: ", dmg);
  let oldnum = b.num;
  b.num -= numKilled;
  if (b.num < 0) {
    b.num = 0;
  }
  //log(a, b);
  //log("Num killed", oldnum - b.num);

}

let cnt = 0;
while (true) {
  cnt++;
  is.sort((b, a) => {
    return a.num * a.dmg + a.init / 30 - b.num * b.dmg - b.init / 30;
  });
  
  inf.sort((b, a) => {
    return a.num * a.dmg + a.init / 30 - b.num * b.dmg - b.init / 30;
  });

  //target choosing
  let isPtr = 0;
  let infPtr = 0;
  let takenInf = {};
  let takenIs = {};
  let infTarg = {};
  let isTarg = {};
  while (isPtr < is.length || infPtr < inf.length) {
    let doNextInf = () => {
      let v = getAttack(inf[infPtr], takenIs, is);
      infTarg[infPtr] = v;
      infPtr++;
    }
    let doNextIs = () => {
      let v = getAttack(is[isPtr], takenInf, inf);
      isTarg[isPtr] = v;
      isPtr++;
    }
    if (isPtr < is.length && infPtr < inf.length) {
      let isefd = is[isPtr].num * is[isPtr].dmg;
      let infefd = inf[infPtr].num * inf[infPtr].dmg;
      if (isefd > infefd || (isefd == infefd && is[isPtr].init > inf[infPtr].init)) {
        doNextIs();
      } else {
        doNextInf();
      }
    } else if (isPtr == is.length) {
      doNextInf();
    } else {
      doNextIs();
    }
  }
  /*log("is targets")
  for (let i in isTarg) {
    log(is[i].hp, "targets", inf[isTarg[i]].hp)
  }
  log("inf targets")
  for (let i in infTarg) {
    log(inf[i].hp, "targets", is[infTarg[i]].hp)
  }*/
  //log("targeting");
  //log(isTarg);
  //log(infTarg);
  //attacking

  isPtr = 0;
  infPtr = 0;
  let isN = is.slice(0);
  let infN = inf.slice(0);
  isN.sort((b, a) => {
    return a.init - b.init;
  });
  infN.sort((b, a) => {
    return a.init - b.init;
  });

  while (isPtr < is.length || infPtr < inf.length) {
    let doNextInf = () => {
      if (infN[infPtr].targ == -1) {
        infPtr++;
        return;
      }
      doAttack(infN[infPtr], is[infN[infPtr].targ]);
      infPtr++;
    }
    let doNextIs = () => {
      if (isN[isPtr].targ == -1) {
        isPtr++;
        return;
      }
      doAttack(isN[isPtr], inf[isN[isPtr].targ]);
      isPtr++;
    }
    if (isPtr < is.length && infPtr < inf.length) {
      if (isN[isPtr].init > infN[infPtr].init) {
        doNextIs();
      } else {
        doNextInf();
      }
    } else if (isPtr == is.length) {
      doNextInf();
    } else {
      doNextIs();
    }
  }
  //log("nextround");
  //log();

  let sumInf = 0;
  let sumIs = 0;
  for (let i in inf) {
    sumInf += inf[i].num;
    sumIs += is[i].num;
  }
  if (sumInf == 0) {
    log(sumIs);
    log("immune wins");
    break;
  } else if (sumIs == 0) {
    log(sumInf);
    log("infection wins");
    break;
  }
  /*log(sumInf);
  log(sumIs);
  log("asdf");*/
}

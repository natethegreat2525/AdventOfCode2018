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

let maxVal = 0;
let pt = null;
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
      if (maxVal > s.score - n.weight) {
        maxVal = s.score - n.weight;
        pt = n.b;
      }
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

let str = `^NESSESSWWN(E|WWWNWSWNWWWNNWNNNNESEEESWSW(NWSNES|)SSENENENEENNEENWNNNENENWWNWNNNENNNNNNWSWNNENENEESWS(W|EEEEENWNNNWWS(SE(SWEN|)N|WWWWWNNESEENWNEES(S|EENNW(NNENESEENWNNEENESSW(SSSWSSWNNW(SSSEESWSSENENNNEESEENESEEEESSENNEESSSESWWN(WSSWNNWSWWNNE(S|ENWWWWSSE(SWSEEEESWSSEEN(EN(W|ENEEEEENESSSWWSSEEN(EEENNESSENEENNWNWWWNWW(SSE(N|SWSE|EEESE)|WNNESENNNESSSENNNESSSS(W|EENNNENEESSSWSW(NNENSWSS|)S(SESSW(SSWSESSSSWNNNWNWSSWNWNN(WSSSESWSSESENEE(SESEENEENESSSESEEEENENWNWNWWSS(E(S(ENSW|)W|N)|WNNNWWWSW(NNENENWNENNEEESEENEENWWNNNEESS(WNSE|)ENESENESSWSWSSSWSEESENNNW(S|NENEESENNNNWNNWNNNENWNWNEENWWWWWSSWNWSWNNNWSWWNWSWNNWNNENNENNWWWNEEEEEENESSWSWW(NEWS|)SEESENNEEEESSWWSW(NNEEWWSS|)SS(SSENNNEESWSEENESENNNWSWN(NNNNNEESWSEENNNWWNEENE(SSSSSSSW(NWSWNSENES|)SSSSE(NNN|SSS(SSSWSESS(NNWNENSWSESS|)|W))|NNWWWWNNWSWNWNNESEENNESSENEE(NNWSWNWWWWWWWWWWWWSESSESSWNWNWWSWWNWWWWSSENEESWSWWSEESWWWNNWSSSEEEESEENWNNESEEEENWWWNN(WSWENE|)ESEN(ESEEESEEENWWNEE(ESSSWWS(ESSENNEENN(NWSSNNES|)ES(SSWSSW(WW|NN)|EEN(E|W))|WWN(E|WSS(WN(NNEWSS|)WSWNWSW(SSSSSE(ENN(WSNE|)E|SWSSWSEE(NN|SE(N|SS(ENESESWSEESESES(ENESEEENNE(NNWSWSW(SEWN|)NWWW(SEEWWN|)N(EEEENENW(ESWSWWEENENW|)|W(S|NNW(W|SS)))|SSS(ESSESW|WWW))|WSSSWS(ESNW|)WWWW(NNEEE(SWWEEN|)ENNWN(E|NWW(SSE(S(E|WW(N|W))|N)|NN))|SSW(N|SSS)))|WNWWWN(EE|WNNE(S|NWNENWNNEE(S(SSS|W)|NWWN(WSWSESSSWNNWNWNNN(EE(SWSNEN|)E|WNWSWWWSSSSENENN(WSNE|)ESSE(SESESSSSSWSES(WSSWNNNWWSSSWNW(SSES(W|SE(SWEN|)ENN(WSNE|)NNN)|NENNENWNWNNESENN(NESESWSS(W|ES(WSEWNE|)ENN(W|N))|WWWSWWSSSESSSE(SWWNNNWWNWNENE(SS|NNEENENNWSWSWWWWWNEENNNWWSESWWWWSWSS(ESEEN(ESENES(ENSW|)SWSSSSS(SEENE(S|NWW(S|N))|WWNWWS(ESNW|)W(NNEENW(NEEE(SWSES|NWWW)|W)|W))|WN(ENWESW|)W)|WWWNENNE(ENEEENNNEEENESS(SENNEENENNESENNEESE(SSWS(E|WN(WWSWS(EE(E|N)|WSESWW(NN|WS(SWNNSSEN|)E))|N(E|N)))|NENNE(SSSWENNN|)NEEES(ENEEN(WWWWWWWWS(WSESWWNWSWWS(E|WNWSSWS(SENENSWSWN|)WWNNNWWNNWN(EEEESS(WNWSNESE|)SS(ENNEEENE(S|N(WWSWNWS(NESENEWSWNWS|)|EE(SWEN|)E))|S)|WWSSSWWWNWWWWNWSSWNNN(WWSESSSESEEENW(NEESE(N|EEESESSSWWNWSSWWWNNN(WSSWNNWSWSWSWSESENEN(N|ESSWSEENEESWSWWSWNWWSESSSSSENNEEES(ENN(EE|WWWWNEENESENNENNN(WWWNSEEE|)ESENEN(ESENNNENNN(EESSSWNN(SSENNNSSSWNN|)|NW(N(N|E)|S(W|SS)))|W))|WSW(N|SSWNWSWWWSS(EEN(EEE|W)|SWSESWWWWNENE(NENWNNWNNWWWNWSSSSWNNNWNWNNENWNNWNNNNWNWWWWSSWWSWNWWWNNNESES(EEENWNW(NW(NWWWWNNESEEENNWW(SEWN|)WN(EEEESEEESWWWSEESEESES(ENESESENNEEENEEEEESSESENEE(ENWWNENWN(E|WWNEN(ESNW|)WWWWWSEEESWWWWS(WNWNN(EESWENWW|)WSSSS(ENSW|)WW(WWWNW(W|NNESENEN(ESE(SSWW(NEWS|)W|N)|WWWWWW))|S)|EEEEEESWSE(WNENWWEESWSE|)))|SWSWSWSSSEE(NWNSES|)(EE|SWSWSESWWNNN(WSSSS(WNNWS(S|WWW(W|NEENWNEENE(SSWENN|)NNWSWWWS(EE|W(SESNWN|)NWNENESEENNENESS(W|ENN(ES(E|SSWSSEN(SWNNENSWSSEN|))|NWWW(NEEEWWWS|)WS(WW(NEWS|)S(WS|EES)|E))))|S))|ESSEEEE(SWWWSNEEEN|)NNW(SWWNE|NENWN))|E)))|WWNW(WNWESE|)S)|WWWSWWN(WSSSWSEENNEESWSSSWSSEEENW(W|NEN(ESE(NEEWWS|)SWSESWWWWSSENEESENESSESEESESSSENESENNEESEE(SSSSSENN(N|ESSSWWWNWNNE(NNWSW(NN|SWWSWNWWSSWNWWNNNWNENN(NWNWW(N|WWSEEESS(ENSW|)SWSESESSWWSEESWSSWWNENWWNNE(NE(NWNNWSWSS(ENSW|)WNWSWSWWNWNEE(NNWWNNNESSENNESSSS(S|ENNNENNE(NWNWWWNWSSEES(E(N|S)|WWWWSSSSWWSWWSWNNNEE(SWEN|)NESENNNNWWWSEESWWSWNNNNEEEEESENNNNNWSSSWNWSWWNNE(NEE(SWEN|)NNWWS(WNNENWNN(EEEESEEEN(WW|EESWS(SSWSW(WNNN(WWNW(W|SSEESS)|ES(ENSW|)S)|SSES(ESENNWN(W|EE(SSSESNWNNN|)N(E|WW))|W))|E))|WSSWSSWSSSSENNE(N(NN|W)|SSSWWWWSSWNW(NNE(NESENNNNNENNN(ESNW|)WWSESWSWNNW(NEWS|)SSSSS(S|ENE(NWES|)S)|S)|SSEEESENE(SSWSSWNNWWSESWSW(NNNNEE|SESENNEESSW(N|SSSENNEN(NNNN|EESEEEE(ESESWSWSEEEN(NEN(W|ESSWSEENE(NWNENWW(EESWSEWNENWW|)|ESSSEEEESWWWSEEEENNENENENN(WWW(NEWS|)SS(ENEWSW|)W(S(E|WWW)|N)|ESENN(WNSE|)ESSESWWWSEEESWSSWSWWWNW(SWSEESSSSSESSESWSWWSEESSEESWWSWWNWSSWSEENEESSEEEESEEENWWNNWWN(ENNW(S|NEEESESEESESWWNWSW(NWN(E|N)|SEESSEENWNEENNNNESSSE(SSW(WSEESWWSEESESWWWWSESSSWSESSEESESENNNNEEENWNN(EEESSSESENNN(ESENEESEENWNENESSSSSWNWWSESEEESENNEENNEENWNNNNESSES(SEENESEENWNNWWW(S(S|EE)|WNENESENNWWWSWNWWWNENEENNEESWSS(WW|ENESENENEESSW(N|WSESWSESENENWNEEEENENNENNNWNWWWNEENEE(NWWWSWWNENNESENNNN(EE(SWSSSENN(SSWNNNSSSENN|)|N)|WWNWWSESS(EENWESWW|)SSWSSSESWSEEESE(N|S(ENSW|)SWNWW(SESWSEENE(WSWWNEWSEENE|)|N(E|WWWS(EE|WSWNNNE(S|NWNNWNNESEEE(SSW(SESW|NWS)|NNWW(SEWN|)NEEE(NWWWWSSWNWNENN(WSWSSWSEESWSSE(SSSWWNENWNNNWWWSWWNWNENNENNNENWWSWWWNWSWNN(WSSSSESWSESSENNNNESENE(ENWWWWW(EEEEESNWWWWW|)|SSWWSESSW(N|W(SSEESSWNWWSESW(WNSE|)SSENESESSWNWWWWSEEES(SENESESWW(SE(SWSNEN|)EEENEN(EE(SSW(N|SW(WSESWSEE(SWWSNEEN|)NNE(N|S)|N))|E)|NNNENNESENN(WWWSSWNWW(SSE(N|SWSES(ENNNSSSW|)S)|N(W(W|S)|ENNEENESS(WWSNEE|)ENNNNWSWWWS(W(SS|N(WW|N))|E)))|EEENNN))|W)|WWWWSESW(SEEWWN|)WW(NENSWS|)W)|WWNWNE)))|EEESENENNESEEE(SEEESWWSS(ENEWSW|)SWS(WSESWWW(NENNNE(S|NN(ESS|NWW))|S)|E)|NWNENWN(W(SS(S|W)|N)|E)))|N)|EES(EENN(WSNE|)EEENN(EE|WSW(N|W))|W))|S))))))))|S(SEN(N|EESSSENESESWSSSWWSWNNW(NNNE(SEESW(SEWN|)W|N(N|W))|WSESWSSENESEEENEN(WWSWENEE|)EESENNNNWSSWWNNE(S|NNESENNE(NNWSWSWNW(S|WWN(E|N))|SE(N|SSENNESESSENNN(ESESWSEEEESEEESWSSEE(N(NNNWWNENWNWNNWWSESSES(WWNNW(SS|N(WSNE|)NNNEES(W|EENNN(ESSSE(NNNNNNNWW(SSE(SWEN|)N|N)|SSW(SESS|WNE))|WS(WNWNWWSW(SE(E(N|E)|S)|NWNWSW(SEEWWN|)WW(NNEE(SWEN|)N(WWNEWSEE|)ESENENEE(NNEWSS|)SWSSWN|W))|S))))|S)|W)|SSWWSEESWSWNWNNN(NNWSSSSWSWNNENWWNWSSSE(N|SWSSEEESENE(ESWSSSSSENENWNNESE(NNN(WSNE|)N|SSSSSWSESSSWWWWSESEEE(NWWEES|)SWSWWWN(WSSSWWWWWSSSSESEESENNENWWW(SEWN|)WNNEEES(EESSENNNNEEE(SSSWSESSWNW(SWNWSSSWSESWSWSWNWWNWNEENN(NWWWN(NWNENWWSSWNNWNWNWSSESWWSSWNWSWWNWSSESENEEEESWWWSSEEEESEEENWNW(W(NNNN(WSNE|)E(SEEESSEES(ENSW|)WSSSW(NNNWNWWNEE(WWSEESNWWNEE|)|WWWSEESWWWSWNWWNWNEN(WWSWSSSEE(NWNSES|)EESESWSESWWNNNWSWWN(E|WNWSSESSSWWNWWSESSSESENENWWNEEENNEE(NWWEES|)SEESWSWNW(N|SSEEEEESS(WWN(E|WSWNWW(NN|S(E|W(WWWNWSWNNENNWNWNENNWWNNWSSWSWNNWWWSESSWWN(E|NWWNWWSSE(SWWWWSWNWNENEEE(SWWEEN|)NNNNNNWWNNWSWNWSWWNENEEEEESSEENWNNNESSEEENNNESESSESSESSESENENNESSSS(ESENNWNNESEEENNWSWNWWNENNESENESS(WW|ESES(ENENWWNWNNWNENEEE(S|EENENNNNWNNNNENNWNEESESSEENNW(NNW(S|WWNEENWWWWNEEENENWWWS(WWNWNWWNNEES(EEES(ENENNESSEEENENNENENE(NNNNESEENE(SSWENN|)(NWW(WWWWWSEESSSWSWSWNWWWSEESESWSWNNWWWNENNEEN(WW(N|WSWS(WSSWNNN(WSSWWSS(EE(NWES|)ESENE(ESWENW|)NN|WWWNWNNW(NEENEN(WWSNEE|)E(SSS(ENESNWSW|)SW(SEWN|)N(WSNE|)N|N)|W(W|SSSWWSWSWWSEESWSWWSEESSENEENENESEEENWNENWWWWS(EESNWW|)WNW(NEEN(W|EN(NN|ESS(W|ENESE(SSSSSWSSEESSWSWSESWWWSSSEEEESWSESENNENWNNNW(SSWNWSWN(SENESEWNWSWN|)|NEESSES(W|SE(NNNNW(NWNENNWNNWW(NEN(NWSNES|)ESESSES(SSSE|EN)|S(W|ESS(SSWENN|)E))|S)|SESWS(E|WN(WSS(EE|WWWNWSS(E|WSESWWWSWNWWNENESEENNW(WWNNESEEE(S|NN(ESNW|)WW(SEWN|)WWWNNEES(W|ENNWWWNWWNNENWWSSSSSSSSSWWSEESENES(SWW(WNWWWWS(ESSWNSENNW|)WNNWWNNWWWWNWWWSEESSSESEEEE(ENWWWWNWNEEESW(ENWWWSNEEESW|)|SWWS(EE|WWN(E|WNWNWSSWWSSWNWWWWWSWSWNNNE(S|EENNENEENWNWSWNNNESENESEENE(NWW(S|WWNENESEENNNWNWWSS(E(ESNW|)N|WSWWWSES(ENSW|)WSSSWNWNENWNWSWNWWWNWWSSSEN(ESSENNESSSESSWNWSSSESWSESWWWWWWNWSSESSENEEEEN(WWWW|ESENNNE(NWNEEENE(N(WN(WSW(NN(NNWSNESS|)E|S(WW|E))|E)|E)|S)|SSSESWSSSSESENNEEESESWWW(NEWS|)SEESEEN(EEENWNWSWNNNW(WWWWW(S|NENESEEEEESSEENNEESENN(ESSSESS(WS(E|SWWSSSWSSSS(WNWSWNNNWWWNNEEN(ESS(ENE(SSWSEWNENN|)ENN(WSWNWESENE|)NENNN(W(S(W|S)|N)|ES(SS|E))|WW)|WWWNWSWWSWWSEEEEE(NWWEES|)SSSEEE(NWWEES|)SWWWWNNNWSSSWWNENWN(E|WSWNWWWWSWSWS(WNWNNNNEENESS(SWW(NE|SE)|ENESENNESE(SWEN|)NNNEN(ESS(EENW|SWN)|NWWNWNENEE(SSWNSENN|)NWWWSWW(NEWS|)WWSWSSEEEE(NNWSW(N|W)|ESSWS(EENNEWSSWW|)W(SEWN|)WWWSWNNN(NNNWSSWNNWNWNNWNENESSSENESS(ENN(ESSNNW|)NNNNWWNNENWNNNESEEESWSSEEESSS(WNNWW(SEWN|)W(NNNWESSS|)W|ENE(S|NNNW(SS|WNW(SWEN|)NEE(NWWNNNWWSWNWSWWNNE(S|NWNWNWSWNWWSESWSESEENE(NWWSNEES|)SSSWSEE(NEEESEEN(N|W)|SSSSSWSES(ESSENN|WWSWWWNEENWNWNEESE(S|NNWWWNWWSESWSWNWWSWWNENEENE(S|NNENWNNWNENNNWSSWSSWSESE(SWS(SWNWWWNNENWNWWSESSSWWWWWWNNNWWSESSSEESEESWSESESENNENNN(WW(WW|SS(ENSW|)S)|ESE(ENWESW|)SSSW(NN|SEESEENN(W(S|W)|E(N|SESWSSEEEEN(ESE(SWWSSWNNWWWSSENESSSSSESENESEESENESSWSSSWNWWWNWNEEN(ESS(ENSW|)W|WWWSWWSSWNNNWSWNNNWNEENESSWSEENE(S(SWEN|)E|NWNN(ESNW|)WWWNNWWNNNWWSWWNN(E(EE(EESESS(WNSE|)ENNESSSWSE(WNENNNSSSWSE|)|NN)|S)|WN(E|WN(NWSWNWSWW(SSSSENNNESSSENNNESSE(ESSSWWSESENESSWSWNWWWNNE(SEWN|)NN(EENWESWW|)WWS(W(N|SESSW(N|SEESSSSWNNW(NEWS|)SSSSEESESWS(WWNENW|EEENWNENNNWSSWN(NNENEN(ESENNENEESSSE(ESWWSESE(N|ESE(SSS(WWWWWWWNENNESSEENE(SENSWN|)NWW(S|NWWWW(NEN(WW|EE(SWEN|)NN(WSNE|)N)|SS(ENSW|)SS))|EENN(WSNE|)ENNESESEEESS(WNWWS(E|WN(WSNE|)N)|EEN(ESENE(SEWN|)NWWNEN(W|E(S|NNNNW(WWNWW(SEWN|)NWN(WSW(SEEWWN|)N|NNESE(S(W|E(N|ES(SEEWWN|)WW))|NN))|SSS)))|W)))|N))|NNNNN(ESSEWNNW|)WWNN(E(S|N)|WWSESSEE(WWNNWNSESSEE|)))|WW(NEWS|)S)|WW))))|E)|N)|NENNE(NWNN(ESNW|)NW(NNNENENWW(S|NNEENWWNEEENWNENENESEEESWSWWSESEEN(NEESSW(SEEESWSWWSS(WSWNNENWNWSWWSSS(ESSEEN(WNNNWS|ESESWWWW(EEEENWESWWWW|))|WN(WSWSNENE|)NNN(WW|ENN(WS|NNNEE|ES(EEESEE|S))))|EEN(W|ESSE(NENWN(NNNESE(SSWNSENN|)NNNNESSESEES(W(WWNSEE|)SSE(SWSSSEE(NWNSES|)SENE(E|SSSEES(WWWNWW(W|N(EE|N))|SS))|N)|ENNWWNWNNNWWNEENWWWWSWSWSWNNWS(SSEEEEE(SWWWSE(SWEN|)EE|N(W(NENSWS|)W|EE))|WNNNEENENWNNENWWNEEEENNWWS(E|WNWWS(WSSWWWNNEE(SWEN|)NENWWWNENNNWWWWNENWW(SSSESSENNES(ENSW|)SSWWW(SESWSESWSSSSENNNEE(SSSW(SSWW(NEWS|)SSSSE(SWEN|)NENWNEE(S|NNEENEE(ENWWWNEEEN(ESSSNNNW|)(WWWWSSS(NNNEEEWWWSSS|)|NN)|SWSS(SENN|WWNE)))|NN)|NNW(NNE(EE|S)|S))|NN)|NNNNNNEEESSENNNNNWWSWNNENEEEESSEENESEENNW(S|WWNW(WWWNWNWWSS(E(N|E)|W(S(E|SSSSEEEN(SWWWNNSSEEEN|))|NNNNENWNNESESSS(ENNESENNWWN(WNNNWW(SESWENWN|)N|EEENN(WSNE|)(N|EESWSESESWWSW(NNEWSS|)SWWSEEENENEESESESWWW(SEEEEEENNWW(SEWN|)NENEN(WWSW(S|NW(S|WNNWNNESEN(SWNWSSNNESEN|)))|EESWS(W|ESSENN(NNN|ESSESESSSEEEE(NNWSWWNENNW(W|S)|SSWSESS(ENNSSW|)WWWSEESSS(EE(NWES|)S|WSSWWSSSWNNWNNNNNNWNNNNNNWWSWNNWSSWNW(SWWWSESWWWSWW(SESSWWWWS(ESENEEESESWSW(NNWSWW|SESES(WWNSEE|)EEENENEESSENNEENE(NWWNNEE(SWEN|)NWWWWNWWNENWW(NNESENESSEEE(NN(WWSEWNEE|)N|SWS(WNWESE|)E)|SSSSWNWW(SESEESES(ENESE(NNNWSWNW(NEWS|)S|E)|WSWNW(NEWS|)S(SE|WN))|NN(WSSNNE|)NEESSWN(SENNWWEESSWN|)))|SSWWSEESWSWNWSSW(SSWWSS(ENESENNESSENENNESENNWN(N(NN|EEESW(SSESSENEENNNNN(WSSSSWN(NNNWNN|W)|E(N|SESSEENWNEESSSSSWNNWSWNW(NN|SSESE(SWSSSSSENEEEEENESEEN(ESSSSSWWNNE(S|NWWSWWN(E|WSWSWSEENEEESSWNWSWSESSWNWNNWWNNN(ENEWSW|)WWNWWNNENE(SSWENN|)NWNENWNWSWSESSWSWSSE(N|SESSWNWWWS(EESEESS(WWWN(N|EE)|EES(SEENWNEE(SSE(N|EEES(EEEES(WW|EEE(NNWSWNWNEEEENEESE(SWW(WSEEWWNE|)N|NEEENEENNNWWNENEES(ENESEN(EESSW(N|SSENENN(N|ESESSSENNNESSSSWWSESWSWSEENESESEE(NWNWNN(WSNE|)NEE(SS(WNSE|)S|NE(SENESEESESEES(ENNWWNNENE(NWWSW(S(WWNEWSEE|)S|N)|SS(W|E(E|S)))|WWS(WNNW(SWEN|)N|E))|NNWSWSWNNENNW(S|NWN(EESE(NNN(WWSEWNEE|)EN(W|E(E|S))|E)|WSS(W|E)))))|SWSWNWNWSWSWNWSWWW(SEEEESEES(EE(SWWEEN|)NWN(NWSWENES|)EEE(SWEN|)N|WW)|WWWNNNNESSEES(EENNE(SEEWWN|)NNNNN(E(N(W|N)|SSS)|WWSWSEE(N|SSWS(WNN(E|W(NNWW(WS(WNSE|)ES(ENSW|)WSSSSS|NEEENWWWNEN(EESWENWW|)W)|SS))|S)))|WW)))))|NWNWN(ENSW|)WSS(WWWSWWSSWW(SSES(ENN(E(EESWWS|NN)|W)|WWNNWWN(WSSEESWWS(WWWSSWWNWNNESE(S|NNEEE(SWWEEN|)NNNE(NWES|)E)|E)|EE))|NNNNEEE(SWWSS|E|NNNW))|E))|W))|S))|WWWS(E|WWWNEE)))|NWWNNNWW(N|SSSENN))|W))|WNNNEE(NNWNENNN(WN(ENSW|)WSWSWSWNWSS(EEEE(N(ENWESW|)W|SWS(SSS|EE))|WNWSW(NNEEWWSS|)SW(N|S|WW))|ESS(S|E))|S(W|E))))))|WNENNENWWSWS(SWWSWWNNW(WSESWENWNE|)NNEEEE(NWNNNESES(EE(SWWSNEEN|)NWNEN(ESSEEWWNNW|)WW(S|WWWSSSS(NNNNEEWWSSSS|))|W)|SSWNW(SS|W))|E))|N))))|W))|WSWS(S|W(W|N)))|W)|NNWW(NENSWS|)WWWW)))|WNNE(NWNEWSES|)EEE)|NNN(NNWWEESS|)ES(EENWESWW|)S)|NNE(EEEEN(WNNSSE|)EESWS(ESSSSESE(NNN(EE(SWSSE(E|N)|E)|W(S|NNN))|SSSW(NNWNSESS|)SEE(NESNWS|)SSWNWSS(NNESENSWNWSS|))|WW)|S)))))))|W(WWW|NE(N|E)))))|W)))|SS)))|E))))|W)|SSS(ENSW|)W)))|N)|W))|SSSSS)|EES(WW|E)))|E)))))|N)|WNNN(N|W(SSSWENNN|)W|E))))))|E)|N))))))|E(SWEN|)E))))|W)|ESENESENE(WSWNWSNESENE|)))))|EEEEEN(ESENSWNW|)WW(NEEWWS|)W)))|EEEEENENNN(WSWNWW(SWSSEEN(N|E(S|E)|W)|NE(NWES|)E)|ESSEESES(EENENESEEENNNNW(N(EESSSEESSS(ENNN(NWWNENN(WSNE|)E|E)|WNW(NEWS|)SWWWWW)|NN)|WSESW(SEWN|)WWWNWN(WWW(SES(E(SE(N|S|E)|N)|W)|W)|E(EESW|NNWS)))|WWW(NEWS|)W))))|EENNNW(SS|WNNESEESSSS(NNNNWWEESSSS|)))|WWWW(NWWS(WWNW(S|W(W|NEEE(N(WW|ESEEEE(SWEN|)NN(WSNE|)E(N|S|E))|S)))|E)|SS)))|S)|W)))|N)))|SSSWNW(SSSWSW(S(WNSE|)EENEENWNEEENW(ESWWWSNEEENW|)|N)|W))))))|SSESEEE(NWWNWESEES|)E(SWWW(SSENSWNN|)W|E))|ENNNWNW(SSEWNN|)NENWNE)))|S)))|N)))))|N))))|SS(SWNSEN|)E))))|E)|E))|EEN(NNN(EENSWW|)W(SSS|NN)|ES(SWW|EN)))|S)|EE)|SSWSWSEE(SESSSSWNWSWSWSSSESEEESESWWNWSSSWNNNWW(N(NNW(S|NENWNEENNE(S|EENWNWWS(E|WWW(WW|SS(ENESNWSW|)S(W|SS)))))|E)|SESSWSSWSESW(WNNNENN(WWS(SW(SSENSWNN|)WNNE(S|NN)|E)|E)|SEENE(S|NENN(EESES(WWNSEE|)ENNWNEE(NW(WWWSEWNEEE|)NNNENNWNEE(NNNWWSS(ENSW|)W(WSSWW(N(ENW|WS)|SEEE(E|NN|S))|NNNNNESEESWW(EENWWNSEESWW|))|EE(ENSW|)SSSWS(EENSWW|)W(WS|NNENW))|E)|WWS(E|S)))))|N))|W(S|W))|W)|E))|S))|SW(N|SESWWNWWSSS(SSEE(ESNW|)NWNENWN(SESWSEWNENWN|)|WW))))|W(N|WWWWWNNN(ESSEWNNW|)WNN(ESNW|)(WWWSESE(SSE(SWWNNWNWSSSE(S(W|EESENEEEEES(NWWWWWEEEEES|))|N)|N)|N)|NN)))|N))|N))))|ENENEESS(W(W|N)|ENEENNWW(SEWN|)WWNEEENEENNWSWNWWWSWS(EEENWESWWW|)WSS(ENSW|)(S|WNW(SWEN|)NENNE(ENENWN(WSWSEWNENE|)EEENESENE(NWW(WWSNEE|)N|SENESSSSSW(NNNWSWNWWS(WNSE|)E|SEENNEENWNW(NNNENEESESWSS(WNWNEN|ENE(NNNNNWS(S|WWNNE(N(ESENSWNW|)W|S))|SSSWW(NEWS|)SSESE(NNWESS|)SWSSWS(EENNSSWW|)WWNENNN(ESSNNW|)NW(NEWS|)SWSWNWW(SESSS(W(WW|NN)|ENE(N(ENSW|)W|S))|W)))|S)))|S))))))|EESWSEEN(SWWNENSWSEEN|)))|N)|WWW)|S)|E)|ESSS(ENNNENN(SSWSSSNNNENN|)|W))|NNNENW)|N(WWWWSSW(ENNEEEWWWSSW|)|N))|WW)|EE))|NW(N|WWW)))|EE))|W))))))|W)))))|W)|W(NEWS|)S)|WSWNWWW(NEEEEE|SESSE(S(WWNNSSEE|)S|N(EE|N))))|N)|NNNEEENNNENEENNNE(NWNEN(ESSSNNNW|)WNNWSWNNWWNN(EES(W|EE(SWEN|)N(W|E(S|E)))|WSWNWWWWNNESENNWWN(WSWSWNW(SSSENEE(SWSWSSWSWWWN(WSSSW(NNN|SEESWSESSSWSSENEEEENNNNNESESENESSSEESES(ENNNE(ENNNNNN(WSWWSEESWWSES(ENSW|)WWW(SEESNWWN|)NENWNENNWSWNNWWNN(NEEEESSENESS(ENESNWSW|)SWNWWNWN(WSNE|)E|WSSSSWN(N|WWSSSW(NNNWSNESSS|)SSSSEENWNEN(NN(EEENE(NWES|)SS(ENSW|)W|N)|W)))|EESSSSSWNNNN(SSSSENSWNNNN|))|SSS)|WWWN(WSW(SEESNWWN|)NNN(ESNW|)W(N|SSS)|E)))|EEN(ENWNSESW|)W)|N)|NE(NWNW(NEWS|)S|E))|EENEESSSS(WNNNSSSE|)ENNENWNNWNEE(NWWEES|)SSE(N|S)))|SSSSWWSWSEEESWSWSSENEE(SWSSWNWWNW(S|WNN(WSSNNE|)EE(NE|SW))|N(NN(NWWEES|)E|W))))))|WWSES(W|EE))|NEESENENWW(W|N)))))|W)|NWN(WSWNSENE|)EN(W|EE)))))|NNWSWN))|E))|E)|S))|SSS(ENEESW|WS(S|E))))|S)|E)|S))|ESE(ESWSES(EEEE|WSWNNN)|N)))|S))|NWNWWNWSWW(SEWN|)NNW(WWN(NWSNES|)EEEEN(ESEEE(NNWW(SEWN|)N(WSNE|)E|SW(SEES|WWWS))|W)|S))|WNENNNE(WSSSWSNENNNE|)))|E))|S)|S)|W)|S))))|W)|ESE(SWEN|)NN(ESE(ESNW|)N|W)))|W)|EEESENEEES(WW|E(SWEN|)N))))|E)|EESWS(EE|W(W|S)))|WW))|WWW)|SS)))|NNE(S|NWNNWS))))|EEE(NWNNNW(NEWS|)SSS|ES(ENEWSW|)SSS))|NN))|EE))))))))|N)|E)))|NNWWNEN(E(EEESNWWW|)S|WWWSESS(S|EE)))|N)|SWSS(EN|WNWS)))|WW)|WNWN(E|WWSS(WN(NNEEWWSS|)W|E(E|S|N)))))|W(W|S)))|NN(WSW(W|N)|N))|E(EENEWSWW|)S)|N)|W)))|W))|W)|N))|NN)|W)|W)|S)))))$`;

//str = `^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$`;
//str = `^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$`;
let arr = str.substr(1, str.length-2).split('');


let lastPos = {x: 0, y: 0};
let stack = [lastPos];
let curPos = {x: 0, y: 0}
let map = {};

minx = 0;
maxx = 0;
miny = 0;
maxy = 0;

for (let i = 0; i < arr.length; i++) {
  let a = arr[i];
  switch (a) {
    case '(':
      stack.push(clone(curPos))
    break;
    case '|':
      curPos = clone(stack[stack.length-1]);
    break;
    case ')':
      curPos = clone(stack.pop());
    break;
    case 'N':
    curPos.y--;
    break;
    case 'S':
    curPos.y++;
    break;
    case 'E':
    curPos.x++;
    break;
    case 'W':
    curPos.x--;
  }
  if ('NSEW'.includes(a)) {
    addPath(map, JSON.stringify(lastPos), JSON.stringify(curPos), 1, false);
    minx = Math.min(curPos.x, minx);
    miny = Math.min(curPos.y, miny);
    maxx = Math.max(curPos.x, maxx);
    maxy = Math.max(curPos.y, maxy);
  }
  lastPos = clone(curPos);
}

let numPaths = 0;
for (let i = minx; i <= maxx; i++) {
  log(i);
  for (let j = miny; j <= maxy; j++) {
    let path = findPath(map, JSON.stringify({x: 0, y: 0}), JSON.stringify({x: i, y: j}));
    if (path.path.length > 1000) {
      numPaths++;
    }
  }
}
log(numPaths);

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

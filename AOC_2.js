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

let str = `bpacnmelhhzpygfsjoxtvkwuor
biacnmelnizqygfsjoctvkwudr
bpaccmllhizyygfsjoxtvkwudr
rpacnmelhizqsufsjoxtvkwudr
bfacnmelhizqygfsjoxtvwwudp
bpacnmelhizqynfsjodtvkyudr
bpafnmelhizqpgfsjjxtvkwudr
bpackmelhizcygfsjoxtvkwudo
bmacnmilhizqygfsjoltvkwudr
bpafnmelhizuygfsjoxtvkwsdr
boacnmylhizqygfsjoxtvxwudr
bpbcjmelhizqygfsjoxtgkwudr
bpacnmglhizqygfsjixtlkwudr
bpacnmclhizqygfsjoxtvkwtqr
bpacnmelhczqygtsjoptvkwudr
bpacnmelhizqywfsaoxtvkbudr
apacnmelhizqygcsjoxtvkwhdr
bpacnmelrizqygfsbpxtvkwudr
tpkcnmelpizqygfsjoxtvkwudr
bpacnmelhizqlgfsjobtmkwudr
npacnmelhizqygffjoxtvkwudf
bpacnmeehqzqygqsjoxtvkwudr
bpecnmelhizqigfsjvxtvkwudr
bpacnmelhizqysfsjoxtvkdfdr
bpacnfelhkzqygfsjoxtvkwfdr
bpacnbelvizqygfsjoxthkwudr
bpacnoelhizqygfejoxtvkwudn
bpacnmelhizqygfzpkxtvkwudr
bpahnmelhizqyufsjoxmvkwudr
bpacnmelhizqygfsnoxtvkwmmr
bpacnmelhizqygfsjoatvkludf
bpacnmylhizqygfsjlxtvksudr
bpacnmekhpzqygysjoxtvkwudr
bpacnselhizqogfswoxtvkwudr
bpacnmelhizqprfsjoxwvkwudr
bpatnmelhinqygfsjoctvkwudr
bpacnqelhqzqygfsxoxtvkwudr
bpabnmelhiyqygfsjoxtykwudr
bpacnivlhizqygfsjoxtviwudr
bpkcnmylhizqygfsjoxtvkwcdr
bpafnmflhizqygtsjoxtvkwudr
bpachmelhizqygfsjixtvkwudg
bpacymelhizqygfsjoxtykwuar
bpacnkelhizqdgfsjoxtskwudr
bpacnmezhizqggbsjoxtvkwudr
bpacnmqlhizqygrsjoxzvkwudr
bpaczmelhizqyhfsjoxfvkwudr
bdacnmelhyzqygusjoxtvkwudr
bpacbmelhizqywfsjostvkwudr
bpacnmelhihzygfstoxtvkwudr
bpactmelhizqygfsjcxtvkwydr
bkacnmethizqytfsjoxtvkwudr
bpacnmalhizqydfskoxtvkwudr
spacnmelbizqygfsjoxdvkwudr
lpalnmelhizoygfsjoxtvkwudr
bpacjmeghizqygfsjoxtviwudr
bpacnmeqhizxygfsjoxgvkwudr
bpacnmelhizqygosjoxtvkkuhr
bpacnmelhiznbxfsjoxtvkwudr
bgacnmelhizqygfsjbxivkwudr
bpacnmelhizqygfjjowtvswudr
bpacnmelhizqygfsjovtgkmudr
bpacnmelcmzqygfspoxtvkwudr
bpvcnmelhizqyvfcjoxtvkwudr
bpacnmeahizqjgfsjoxtvkwukr
bpacnoelwizqygfsjoxtvkaudr
xpacnmelhizqygfsjoxdvkwedr
mpacnmelqizqygfsjoxtvkwudx
bppcnmelhizqygfsjfxtvkhudr
bpacnmclhizqyhfsjaxtvkwudr
opacsmelhizqygfsjmxtvkwudr
bpafnmelhizqjgfsjoxtvkrudr
bpdcnmilhizqygfsjoxtvkludr
bpainmelhizqygfsjtntvkwudr
bradnmelhizqygfsjextvkwudr
bpacnmelhizqygfmsoxtvkwudg
bpacneelhizqygvrjoxtvkwudr
bpacnpelhizqygfsjoxyvkwudf
bpacnmelhizqygfsqoqtvkwodr
bpacnmelhizjyghsjoxcvkwudr
bpacnmelmibqygfsjoxtvnwudr
jpacnmelaizqygfwjoxtvkwudr
zpachmelhizqygfsjsxtvkwudr
bpacnmelfizqykfsjomtvkwudr
bpacnmllwizqygfsjoxtvkwusr
bpaynmelhizqygfsjoxtvowcdr
jpacnmqlhizqygfsjoxtvknudr
bpacxmelhizqyffsjoxtvkwugr
apawnmelhizqygfsjtxtvkwudr
mpacnmelhitqigfsjoxtvkwudr
bpacnmelhhzqygfsjoxtvkyzdr
gpacnmelhizqynfsjoxtvkwudm
bnacnkelhizqygfsjoxtpkwudr
bpacnmelfizqygfsumxtvkwudr
bpacnmelhisqygfsjohtvowudr
bpacnmelhimqygxsjoxtvkwudn
bpscnmeliizqygfsjoxtvkwunr
qpacnmelhizqycfsjoxtvkwndr
bpacnmelhijqygfsjohtvkyudr
bpacnmelhizqykfsjkxtvknudr
bpacnqilhizqygfsjoxtvkoudr
bpacnmelhizqzgmsjoxtvkwurr
bpdcnmelhizqygfsjoutukwudr
bpecnmeghizqygfsjoxgvkwudr
bpicnmelhizqygfrjoxtvlwudr
bpacnmelhizfygfsroxtvkwodr
buacnmelhizqygjsjoxtvkvudr
bpacnmelhixqykfsjoxtvrwudr
bpacnmelhizqygvejcxtvkwudr
bpacnmjlhizqylfsjoxtvkwuor
qpacnmelhizqygfsjoxfdkwudr
bpfcnmemhizqygfsjoxtvknudr
bpacnmelhizqoffsjqxtvkwudr
hpacnielhiqqygfsjoxtvkwudr
gpacnmelhizqygfsewxtvkwudr
bpacnmellizqylxsjoxtvkwudr
bpacnmenhizqymfsjoxtvkmudr
bpacnfelhizqygcsjoltvkwudr
bpacnmelhqqqygfsjoxtvkuudr
bplgnmelhiqqygfsjoxtvkwudr
bpacnzelhizqygfgjoxtvnwudr
bpacnmelhizqygfsjoktvknunr
bpacnmdlhioqygfnjoxtvkwudr
epacnmelwizqyjfsjoxtvkwudr
bpacxmelhazfygfsjoxtvkwudr
bpacnmejhezqygfsjoxtskwudr
bpacnqelhihqyzfsjoxtvkwudr
bpacnbelhizqyrfsjoxtvkmudr
bpacnmelhizqygfsjoxtylwzdr
bpacnmelwizqygfsjodtvkhudr
bpacnnelhizqygfsjoxtwkwadr
bpacimelhizqygfsnoxtvkwuor
bpacnmelhizqyaasjoxtlkwudr
bpacnmelhizqyeffjoxtvkwuds
bpacnmenhizqygxscoxtvkwudr
bpacnmelhidqygfsjowtskwudr
bpacnmeliizqygfsjoxhvkwucr
bpacimelhizqygfsjoxtvktuwr
bpainmelhhzqygfsjzxtvkwudr
bpacamelhizqygfsjogtvkwbdr
bpccnmelgizqygfsjoxtykwudr
bpacnmelhizwegfsjoxtvkwadr
bpackmelhbzqygqsjoxtvkwudr
bpacymeihizqyffsjoxtvkwudr
bpacnielhczqygfsjoxtvkwudk
bpacnmejhizqygffjoxjvkwudr
ppacnmelhizqygfsjoxtigwudr
bpjcnmolhizqygfsjoxtvkwndr
bpacnmelcizqygrsjoxtakwudr
cpawnmelhizqygfsjoxmvkwudr
bwacnmelhizqygesjoxtakwudr
bpacnmelhizqygfsjexsvkwddr
bpaunmelhiuqygfsjoxtvkwtdr
bpacnmellimqygfsjextvkwudr
bpacnmerhizqygfsaoxvvkwudr
bpacnmglhizqygfsjixtukwudr
ppacnmelhizqygfsjoxtvkdudp
bpacnmedhizqygukjoxtvkwudr
bpccnmelhizqngfsjoxtvkwadr
bgacnmeldizqygfscoxtvkwudr
bpacngelhizsygfsjoxtvkwkdr
bpacnpelhizqygfsjoxctkwudr
bpacnmylhizqygfcjoxtvkwmdr
npacnmelhizqygfsjoxtwkwuds
bpaxnmelhizqydfsjoxyvkwudr
bpacnhelhizjygfsjoxtvkmudr
bpacnkelhczqygfnjoxtvkwudr
bfacnmelhizrygfsjoxtvkwodr
bpycnmelhizqygfofoxtvkwudr
qpacpselhizqygfsjoxtvkwudr
bpvcnmelhezqygfsjoxttkwudr
bpacnmwlhizqygfijoxtmkwudr
bsacnmelhikqygfsjoxttkwudr
bpccnxelhizqyafsjoxtvkwudr
bpacnmelhizqygfswhxtvewudr
vpacnmzlhizqygfsvoxtvkwudr
bpacnmelhihqygfsjoxtvkqurr
bpacnmelhixqygazjoxtvkwudr
bpavnmelhizqygfsjozpvkwudr
bpacnmclhizuygfsjoxmvkwudr
bpacnmelhizryufsjoxtkkwudr
bpacnmelhtzqygfsjobtvkwufr
bpacnmelhizqmlfsjoxtvkwudq
bpaaneelhizqygfsjlxtvkwudr
bpacnmelhxzqygfsjoxthkwuhr
bpacnmeshizqygfcjoxtvkwude
bpacnzqlhizqygfsxoxtvkwudr
bgaanmelhizqycfsjoxtvkwudr
bpacnmexhizqygfsroxtvkwudn
bpmmnmelhizqygfajoxtvkwudr
bpacnmelhizqylfsjoxtckwhdr
bpicnmelhizqyrfsjoxtvkwudi
zpacnmelhizvycfsjoxtvkwudr
bpamnmkllizqygfsjoxtvkwudr
bpacnmelhrzqyrfsjoxgvkwudr
bpadnmelhczqygfsjoxtlkwudr
bpacrmelhizqygrsjoxtvkiudr
lpacnmelhizqygfsjoxtgkwxdr
fpacnmalhiuqygfsjoxtvkwudr
bpacnmelhizqygfsjixtvfwcdr
bpccnmelhxzqygfkjoxtvkwudr
bpacnmepaizqygfsjoctvkwudr
tpacnmelhivqygfsxoxtvkwudr
kpacnfelhitqygfsjoxtvkwudr
baacnzelhizqygfsjoxtvkwudx
bcycnmeghizqygfsjoxtvkwudr
wpacotelhizqygfsjoxtvkwudr
bpacnmsshizqygrsjoxtvkwudr
blacnmelhizqygfsjoxtykwvdr
bkacnmelhizqygfsjoxuvkludr
bpacnmelhizaugfsjoxtvhwudr
fpavnmelhizqygfsgoxtvkwudr
bpachmelnizqygfsjextvkwudr
bpacnmelhizqpgfsjoxtvkwldu
bpacnmelhizqygfsloftvywudr
bpacntelhvzqygfejoxtvkwudr
bpacnmeldizqygfsjmxtvkdudr
byacnmelhizqygfsjsxtvkwudh
bpacnmellizqygssxoxtvkwudr
bpacnmelhizqygfsjootvknuir
bpacnmelhitqjgfsjoxivkwudr
bpacnmelhazaygfsjoxtvfwudr
bpacnzenhizqygfsjzxtvkwudr
bpacnmelhizqypfsdoxtvkwuar
bpannmelhizqygnsjoxtvkwndr
bracnmeldizsygfsjoxtvkwudr
bpacnmelhizwygfsjugtvkwudr
bpatnmelhizqygfsjoytvkwulr
upacnmelhizqygfsjurtvkwudr
bpaenmezhizqygfsjostvkwudr
bpacnmelhizpygfsjodhvkwudr
bpacnmelhizqygfsjogtvkguwr
bpacnmelhisqygfsjoxtpkuudr
bxacnmelhizqygfsjdxtvkfudr
bpacnmelhizqygfsjohqvkwudu
bzacnmtlhizqygfsjoxsvkwudr
bpacnmplhixrygfsjoxtvkwudr
bpacnmelhizqhgfsjomtvkwudg
bpacnmezhizqygfsjxxtykwudr
bpacnmwlhizqygfujoxtzkwudr
tpacnmelhizqygfsjoxkvpwudr
bpawsmenhizqygfsjoxtvkwudr
bpacnmelhizqtgfsjoxttkwuqr
bpkcbmelhizqygfsjoxtvkwucr
bpacfmekhizqygfsjoxtvkwuds
bpacnmethizqynfajoxtvkwudr
bpocnmclhizqygfsjoxtvkwukr
zpacnmwlhizqygfsjoxzvkwudr
bpacpoelhqzqygfsjoxtvkwudr
bpacnlelhizqyzfsjoxtvkwukr`;

let arr = str.split('\n');
let threecnt = 0;
let twocnt = 0;
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < 26; j++) {
    let char = String.fromCharCode(97+j);
    let count = (arr[i].match(new RegExp('[' + char + ']', 'g')) || []).length;
    if (count === 3) {
      threecnt++;
      j = 30;
    }
  }
}
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < 26; j++) {
    let char = String.fromCharCode(97+j);
    let count = (arr[i].match(new RegExp('[' + char + ']', 'g')) || []).length;
    if (count === 2) {
      twocnt++;
      j = 30;
    }
  }
}
log(threecnt * twocnt);

for (let i = 0; i < arr.length; i++) {
  for (let j = i+1; j < arr.length; j++) {
    for(let k = 0; k < arr[i].length; k++) {
      if (arr[i].substr(0, k) + arr[i].substr(k+1, arr[i].length) === arr[j].substr(0, k) + arr[j].substr(k+1, arr[j].length)) {
        log(arr[i].substr(0, k) + arr[j].substr(k+1, arr[j].length));
      }
    }
  }
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

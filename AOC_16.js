let log = console.log;


let str = `Before: [1, 2, 3, 2]
3 1 3 0
After:  [1, 2, 3, 2]

Before: [1, 1, 1, 3]
5 1 3 0
After:  [3, 1, 1, 3]

Before: [2, 3, 0, 2]
0 1 0 2
After:  [2, 3, 6, 2]

Before: [1, 2, 2, 3]
11 0 3 3
After:  [1, 2, 2, 0]

Before: [0, 0, 3, 3]
9 0 0 1
After:  [0, 0, 3, 3]

Before: [1, 0, 1, 2]
10 1 2 0
After:  [1, 0, 1, 2]

Before: [0, 2, 0, 2]
13 1 1 1
After:  [0, 1, 0, 2]

Before: [3, 1, 1, 1]
6 1 0 1
After:  [3, 3, 1, 1]

Before: [2, 3, 2, 0]
4 1 2 2
After:  [2, 3, 1, 0]

Before: [1, 2, 0, 2]
3 1 3 2
After:  [1, 2, 1, 2]

Before: [0, 1, 3, 3]
2 1 0 2
After:  [0, 1, 1, 3]

Before: [0, 3, 1, 3]
6 2 1 2
After:  [0, 3, 3, 3]

Before: [3, 1, 1, 1]
6 1 0 2
After:  [3, 1, 3, 1]

Before: [0, 2, 3, 2]
3 1 3 0
After:  [1, 2, 3, 2]

Before: [0, 0, 1, 3]
7 2 1 0
After:  [1, 0, 1, 3]

Before: [3, 1, 2, 3]
15 2 3 1
After:  [3, 3, 2, 3]

Before: [3, 2, 3, 2]
3 1 3 3
After:  [3, 2, 3, 1]

Before: [0, 2, 1, 2]
3 1 3 0
After:  [1, 2, 1, 2]

Before: [1, 0, 1, 1]
1 1 0 1
After:  [1, 1, 1, 1]

Before: [3, 2, 2, 2]
3 1 3 1
After:  [3, 1, 2, 2]

Before: [2, 3, 2, 3]
8 2 2 3
After:  [2, 3, 2, 4]

Before: [2, 1, 0, 2]
8 0 1 0
After:  [3, 1, 0, 2]

Before: [1, 1, 2, 3]
5 0 3 1
After:  [1, 3, 2, 3]

Before: [1, 0, 3, 1]
1 1 0 0
After:  [1, 0, 3, 1]

Before: [0, 1, 3, 1]
14 3 2 1
After:  [0, 3, 3, 1]

Before: [3, 3, 1, 1]
0 1 0 1
After:  [3, 9, 1, 1]

Before: [2, 3, 0, 3]
15 0 3 2
After:  [2, 3, 3, 3]

Before: [2, 2, 3, 3]
15 1 3 2
After:  [2, 2, 3, 3]

Before: [1, 1, 3, 2]
12 0 2 3
After:  [1, 1, 3, 3]

Before: [2, 1, 1, 3]
15 0 3 3
After:  [2, 1, 1, 3]

Before: [0, 2, 3, 2]
9 0 0 2
After:  [0, 2, 0, 2]

Before: [3, 2, 1, 0]
6 2 0 0
After:  [3, 2, 1, 0]

Before: [3, 3, 3, 2]
13 1 0 0
After:  [1, 3, 3, 2]

Before: [3, 2, 2, 3]
8 2 2 3
After:  [3, 2, 2, 4]

Before: [1, 0, 2, 3]
1 1 0 2
After:  [1, 0, 1, 3]

Before: [1, 0, 2, 0]
8 2 2 2
After:  [1, 0, 4, 0]

Before: [1, 3, 3, 2]
12 0 2 1
After:  [1, 3, 3, 2]

Before: [0, 1, 2, 2]
2 1 0 2
After:  [0, 1, 1, 2]

Before: [3, 0, 2, 3]
0 3 0 0
After:  [9, 0, 2, 3]

Before: [2, 0, 3, 1]
7 3 1 3
After:  [2, 0, 3, 1]

Before: [1, 2, 1, 3]
10 1 0 0
After:  [1, 2, 1, 3]

Before: [2, 3, 3, 0]
4 1 0 2
After:  [2, 3, 1, 0]

Before: [0, 1, 1, 2]
2 1 0 3
After:  [0, 1, 1, 1]

Before: [1, 0, 0, 2]
7 0 1 1
After:  [1, 1, 0, 2]

Before: [2, 3, 2, 2]
4 1 2 1
After:  [2, 1, 2, 2]

Before: [1, 2, 1, 0]
13 1 1 2
After:  [1, 2, 1, 0]

Before: [1, 0, 2, 2]
1 1 0 2
After:  [1, 0, 1, 2]

Before: [2, 2, 1, 3]
11 0 3 2
After:  [2, 2, 0, 3]

Before: [0, 1, 3, 1]
2 1 0 0
After:  [1, 1, 3, 1]

Before: [0, 1, 2, 2]
2 1 0 1
After:  [0, 1, 2, 2]

Before: [2, 3, 1, 1]
6 2 1 1
After:  [2, 3, 1, 1]

Before: [1, 2, 1, 0]
10 1 0 1
After:  [1, 1, 1, 0]

Before: [3, 1, 0, 3]
5 1 3 3
After:  [3, 1, 0, 3]

Before: [2, 1, 3, 1]
12 1 2 0
After:  [3, 1, 3, 1]

Before: [0, 0, 2, 3]
10 0 1 0
After:  [1, 0, 2, 3]

Before: [0, 1, 2, 0]
2 1 0 1
After:  [0, 1, 2, 0]

Before: [0, 1, 0, 3]
5 1 3 1
After:  [0, 3, 0, 3]

Before: [0, 1, 1, 1]
2 1 0 0
After:  [1, 1, 1, 1]

Before: [2, 0, 2, 1]
7 3 1 2
After:  [2, 0, 1, 1]

Before: [1, 0, 1, 0]
7 2 1 1
After:  [1, 1, 1, 0]

Before: [3, 2, 3, 3]
15 1 3 1
After:  [3, 3, 3, 3]

Before: [1, 2, 0, 3]
10 1 0 0
After:  [1, 2, 0, 3]

Before: [1, 2, 0, 0]
13 1 1 3
After:  [1, 2, 0, 1]

Before: [2, 3, 2, 3]
0 1 0 2
After:  [2, 3, 6, 3]

Before: [3, 3, 3, 1]
13 1 0 1
After:  [3, 1, 3, 1]

Before: [1, 2, 3, 1]
14 3 2 2
After:  [1, 2, 3, 1]

Before: [0, 0, 1, 3]
8 0 3 1
After:  [0, 3, 1, 3]

Before: [0, 2, 2, 3]
0 3 1 2
After:  [0, 2, 6, 3]

Before: [1, 1, 3, 3]
5 0 3 2
After:  [1, 1, 3, 3]

Before: [0, 1, 1, 0]
2 1 0 2
After:  [0, 1, 1, 0]

Before: [1, 0, 3, 0]
1 1 0 0
After:  [1, 0, 3, 0]

Before: [0, 1, 2, 0]
2 1 0 0
After:  [1, 1, 2, 0]

Before: [1, 1, 3, 2]
14 3 1 1
After:  [1, 3, 3, 2]

Before: [1, 3, 2, 2]
6 0 1 1
After:  [1, 3, 2, 2]

Before: [1, 0, 0, 2]
1 1 0 1
After:  [1, 1, 0, 2]

Before: [2, 3, 3, 0]
4 1 0 3
After:  [2, 3, 3, 1]

Before: [1, 0, 2, 1]
10 1 3 2
After:  [1, 0, 1, 1]

Before: [2, 1, 1, 1]
0 3 0 3
After:  [2, 1, 1, 2]

Before: [1, 0, 0, 1]
7 0 1 3
After:  [1, 0, 0, 1]

Before: [2, 0, 0, 1]
7 3 1 3
After:  [2, 0, 0, 1]

Before: [2, 3, 3, 2]
13 1 2 0
After:  [1, 3, 3, 2]

Before: [2, 2, 0, 1]
13 1 0 3
After:  [2, 2, 0, 1]

Before: [2, 3, 1, 3]
5 2 3 3
After:  [2, 3, 1, 3]

Before: [3, 2, 3, 2]
3 1 3 2
After:  [3, 2, 1, 2]

Before: [1, 3, 3, 1]
12 0 2 2
After:  [1, 3, 3, 1]

Before: [1, 0, 1, 3]
7 2 1 0
After:  [1, 0, 1, 3]

Before: [1, 3, 2, 0]
6 0 1 1
After:  [1, 3, 2, 0]

Before: [2, 0, 3, 1]
14 3 2 3
After:  [2, 0, 3, 3]

Before: [0, 1, 3, 1]
8 0 1 1
After:  [0, 1, 3, 1]

Before: [1, 1, 2, 3]
15 2 3 2
After:  [1, 1, 3, 3]

Before: [1, 2, 2, 2]
3 1 3 3
After:  [1, 2, 2, 1]

Before: [0, 1, 0, 2]
2 1 0 1
After:  [0, 1, 0, 2]

Before: [1, 2, 3, 3]
5 0 3 2
After:  [1, 2, 3, 3]

Before: [0, 0, 2, 0]
8 2 2 1
After:  [0, 4, 2, 0]

Before: [2, 3, 3, 1]
0 0 2 1
After:  [2, 6, 3, 1]

Before: [1, 0, 3, 2]
12 0 2 1
After:  [1, 3, 3, 2]

Before: [3, 1, 0, 3]
5 1 3 0
After:  [3, 1, 0, 3]

Before: [0, 0, 3, 1]
10 0 1 1
After:  [0, 1, 3, 1]

Before: [3, 3, 0, 2]
13 1 0 2
After:  [3, 3, 1, 2]

Before: [1, 1, 0, 3]
5 0 3 1
After:  [1, 3, 0, 3]

Before: [3, 3, 3, 1]
14 3 2 0
After:  [3, 3, 3, 1]

Before: [1, 3, 2, 3]
5 0 3 0
After:  [3, 3, 2, 3]

Before: [1, 0, 0, 3]
7 0 1 2
After:  [1, 0, 1, 3]

Before: [2, 2, 3, 1]
14 3 2 3
After:  [2, 2, 3, 3]

Before: [0, 1, 3, 1]
12 1 2 0
After:  [3, 1, 3, 1]

Before: [0, 1, 2, 3]
9 0 0 3
After:  [0, 1, 2, 0]

Before: [1, 3, 2, 3]
5 0 3 3
After:  [1, 3, 2, 3]

Before: [0, 2, 2, 3]
8 1 2 2
After:  [0, 2, 4, 3]

Before: [2, 3, 3, 0]
0 2 0 3
After:  [2, 3, 3, 6]

Before: [2, 3, 3, 1]
14 3 2 3
After:  [2, 3, 3, 3]

Before: [3, 1, 2, 2]
8 2 2 0
After:  [4, 1, 2, 2]

Before: [2, 3, 3, 3]
11 0 3 2
After:  [2, 3, 0, 3]

Before: [2, 2, 3, 2]
13 1 0 3
After:  [2, 2, 3, 1]

Before: [3, 0, 3, 3]
0 3 0 0
After:  [9, 0, 3, 3]

Before: [2, 3, 2, 3]
4 1 2 2
After:  [2, 3, 1, 3]

Before: [0, 0, 1, 1]
7 2 1 0
After:  [1, 0, 1, 1]

Before: [1, 0, 3, 0]
1 1 0 2
After:  [1, 0, 1, 0]

Before: [0, 1, 2, 3]
8 2 2 1
After:  [0, 4, 2, 3]

Before: [0, 1, 3, 0]
2 1 0 3
After:  [0, 1, 3, 1]

Before: [3, 3, 3, 1]
13 1 0 2
After:  [3, 3, 1, 1]

Before: [0, 1, 3, 0]
2 1 0 2
After:  [0, 1, 1, 0]

Before: [0, 0, 3, 1]
7 3 1 3
After:  [0, 0, 3, 1]

Before: [1, 0, 3, 0]
1 1 0 3
After:  [1, 0, 3, 1]

Before: [0, 3, 1, 2]
6 2 1 2
After:  [0, 3, 3, 2]

Before: [2, 1, 1, 3]
5 2 3 3
After:  [2, 1, 1, 3]

Before: [2, 0, 0, 3]
11 0 3 3
After:  [2, 0, 0, 0]

Before: [1, 0, 2, 1]
1 1 0 3
After:  [1, 0, 2, 1]

Before: [1, 3, 2, 3]
4 1 2 0
After:  [1, 3, 2, 3]

Before: [0, 2, 1, 2]
3 1 3 3
After:  [0, 2, 1, 1]

Before: [0, 0, 0, 0]
9 0 0 3
After:  [0, 0, 0, 0]

Before: [1, 0, 3, 3]
1 1 0 1
After:  [1, 1, 3, 3]

Before: [1, 1, 3, 1]
12 0 2 3
After:  [1, 1, 3, 3]

Before: [2, 3, 0, 0]
4 1 0 2
After:  [2, 3, 1, 0]

Before: [0, 1, 2, 3]
9 0 0 0
After:  [0, 1, 2, 3]

Before: [1, 0, 0, 3]
1 1 0 3
After:  [1, 0, 0, 1]

Before: [2, 2, 2, 0]
13 1 0 3
After:  [2, 2, 2, 1]

Before: [3, 3, 3, 3]
13 1 0 2
After:  [3, 3, 1, 3]

Before: [1, 2, 1, 3]
15 1 3 3
After:  [1, 2, 1, 3]

Before: [1, 3, 2, 1]
4 1 2 2
After:  [1, 3, 1, 1]

Before: [3, 3, 3, 3]
13 1 0 1
After:  [3, 1, 3, 3]

Before: [1, 0, 1, 1]
7 2 1 0
After:  [1, 0, 1, 1]

Before: [2, 1, 0, 3]
5 1 3 2
After:  [2, 1, 3, 3]

Before: [1, 0, 1, 2]
7 0 1 2
After:  [1, 0, 1, 2]

Before: [2, 1, 3, 2]
8 1 3 3
After:  [2, 1, 3, 3]

Before: [1, 2, 2, 3]
15 1 3 0
After:  [3, 2, 2, 3]

Before: [1, 0, 2, 3]
11 0 3 3
After:  [1, 0, 2, 0]

Before: [1, 3, 2, 2]
4 1 2 0
After:  [1, 3, 2, 2]

Before: [2, 2, 2, 3]
15 0 3 2
After:  [2, 2, 3, 3]

Before: [3, 1, 3, 1]
12 1 2 2
After:  [3, 1, 3, 1]

Before: [1, 0, 2, 1]
1 1 0 2
After:  [1, 0, 1, 1]

Before: [0, 3, 2, 0]
0 2 1 2
After:  [0, 3, 6, 0]

Before: [0, 2, 3, 2]
13 1 1 0
After:  [1, 2, 3, 2]

Before: [2, 3, 3, 2]
4 1 0 2
After:  [2, 3, 1, 2]

Before: [3, 3, 2, 1]
4 1 2 1
After:  [3, 1, 2, 1]

Before: [1, 3, 1, 2]
8 2 3 3
After:  [1, 3, 1, 3]

Before: [1, 3, 1, 1]
6 0 1 0
After:  [3, 3, 1, 1]

Before: [0, 3, 2, 1]
14 3 2 2
After:  [0, 3, 3, 1]

Before: [1, 0, 0, 3]
1 1 0 0
After:  [1, 0, 0, 3]

Before: [0, 0, 1, 1]
10 0 1 2
After:  [0, 0, 1, 1]

Before: [1, 1, 2, 2]
8 2 2 0
After:  [4, 1, 2, 2]

Before: [1, 2, 3, 2]
3 1 3 1
After:  [1, 1, 3, 2]

Before: [1, 2, 1, 2]
10 1 0 1
After:  [1, 1, 1, 2]

Before: [2, 3, 2, 0]
4 1 0 1
After:  [2, 1, 2, 0]

Before: [1, 0, 1, 0]
1 1 0 1
After:  [1, 1, 1, 0]

Before: [2, 0, 1, 2]
10 1 2 1
After:  [2, 1, 1, 2]

Before: [3, 3, 3, 0]
13 1 0 2
After:  [3, 3, 1, 0]

Before: [2, 0, 3, 3]
11 0 3 3
After:  [2, 0, 3, 0]

Before: [0, 1, 2, 3]
5 1 3 3
After:  [0, 1, 2, 3]

Before: [1, 0, 2, 3]
1 1 0 0
After:  [1, 0, 2, 3]

Before: [0, 0, 3, 3]
10 0 1 0
After:  [1, 0, 3, 3]

Before: [1, 0, 2, 2]
1 1 0 0
After:  [1, 0, 2, 2]

Before: [1, 0, 0, 2]
1 1 0 2
After:  [1, 0, 1, 2]

Before: [2, 3, 1, 1]
6 2 1 2
After:  [2, 3, 3, 1]

Before: [2, 2, 3, 1]
14 3 2 2
After:  [2, 2, 3, 1]

Before: [3, 3, 1, 3]
6 2 1 3
After:  [3, 3, 1, 3]

Before: [0, 1, 1, 2]
2 1 0 0
After:  [1, 1, 1, 2]

Before: [2, 0, 3, 3]
0 2 2 3
After:  [2, 0, 3, 9]

Before: [0, 1, 0, 0]
9 0 0 1
After:  [0, 0, 0, 0]

Before: [0, 1, 2, 1]
2 1 0 3
After:  [0, 1, 2, 1]

Before: [2, 2, 0, 3]
15 0 3 3
After:  [2, 2, 0, 3]

Before: [0, 3, 2, 1]
14 3 2 3
After:  [0, 3, 2, 3]

Before: [1, 2, 1, 3]
15 1 3 0
After:  [3, 2, 1, 3]

Before: [0, 3, 0, 2]
9 0 0 3
After:  [0, 3, 0, 0]

Before: [1, 2, 0, 1]
13 1 1 1
After:  [1, 1, 0, 1]

Before: [2, 3, 3, 1]
14 3 2 1
After:  [2, 3, 3, 1]

Before: [0, 2, 1, 3]
15 1 3 3
After:  [0, 2, 1, 3]

Before: [1, 0, 2, 1]
7 3 1 2
After:  [1, 0, 1, 1]

Before: [0, 2, 3, 2]
3 1 3 3
After:  [0, 2, 3, 1]

Before: [3, 3, 1, 3]
13 1 0 3
After:  [3, 3, 1, 1]

Before: [3, 2, 2, 2]
3 1 3 3
After:  [3, 2, 2, 1]

Before: [0, 1, 1, 1]
9 0 0 1
After:  [0, 0, 1, 1]

Before: [0, 1, 2, 3]
9 0 0 1
After:  [0, 0, 2, 3]

Before: [0, 1, 3, 2]
9 0 0 0
After:  [0, 1, 3, 2]

Before: [1, 1, 3, 3]
11 0 3 2
After:  [1, 1, 0, 3]

Before: [1, 1, 1, 3]
5 0 3 1
After:  [1, 3, 1, 3]

Before: [3, 1, 1, 2]
14 3 1 1
After:  [3, 3, 1, 2]

Before: [0, 3, 1, 0]
0 1 1 2
After:  [0, 3, 9, 0]

Before: [0, 1, 1, 1]
2 1 0 1
After:  [0, 1, 1, 1]

Before: [2, 2, 2, 1]
8 2 2 3
After:  [2, 2, 2, 4]

Before: [1, 2, 3, 0]
12 0 2 0
After:  [3, 2, 3, 0]

Before: [3, 3, 2, 1]
4 1 2 2
After:  [3, 3, 1, 1]

Before: [2, 2, 2, 1]
14 3 2 0
After:  [3, 2, 2, 1]

Before: [1, 1, 2, 1]
8 2 1 2
After:  [1, 1, 3, 1]

Before: [0, 3, 2, 2]
4 1 2 1
After:  [0, 1, 2, 2]

Before: [1, 0, 0, 0]
1 1 0 0
After:  [1, 0, 0, 0]

Before: [0, 1, 3, 2]
2 1 0 1
After:  [0, 1, 3, 2]

Before: [3, 3, 2, 0]
0 0 1 1
After:  [3, 9, 2, 0]

Before: [2, 3, 3, 3]
15 0 3 2
After:  [2, 3, 3, 3]

Before: [1, 0, 0, 2]
1 1 0 0
After:  [1, 0, 0, 2]

Before: [0, 3, 2, 3]
4 1 2 3
After:  [0, 3, 2, 1]

Before: [0, 1, 1, 2]
2 1 0 2
After:  [0, 1, 1, 2]

Before: [1, 2, 1, 2]
3 1 3 0
After:  [1, 2, 1, 2]

Before: [2, 2, 0, 3]
15 0 3 2
After:  [2, 2, 3, 3]

Before: [1, 3, 3, 0]
6 0 1 3
After:  [1, 3, 3, 3]

Before: [3, 2, 2, 3]
15 2 3 2
After:  [3, 2, 3, 3]

Before: [2, 2, 0, 2]
3 1 3 0
After:  [1, 2, 0, 2]

Before: [0, 1, 3, 1]
12 1 2 1
After:  [0, 3, 3, 1]

Before: [2, 0, 3, 3]
15 0 3 1
After:  [2, 3, 3, 3]

Before: [1, 1, 0, 2]
14 3 1 0
After:  [3, 1, 0, 2]

Before: [3, 3, 1, 2]
0 1 1 0
After:  [9, 3, 1, 2]

Before: [3, 1, 0, 0]
6 1 0 1
After:  [3, 3, 0, 0]

Before: [2, 2, 3, 1]
13 1 1 0
After:  [1, 2, 3, 1]

Before: [1, 0, 3, 2]
7 0 1 1
After:  [1, 1, 3, 2]

Before: [0, 1, 2, 1]
8 2 2 0
After:  [4, 1, 2, 1]

Before: [1, 0, 3, 1]
7 0 1 2
After:  [1, 0, 1, 1]

Before: [0, 3, 1, 1]
6 2 1 0
After:  [3, 3, 1, 1]

Before: [1, 0, 3, 3]
12 0 2 1
After:  [1, 3, 3, 3]

Before: [1, 3, 3, 3]
12 0 2 2
After:  [1, 3, 3, 3]

Before: [2, 1, 3, 1]
12 1 2 3
After:  [2, 1, 3, 3]

Before: [0, 2, 3, 2]
3 1 3 1
After:  [0, 1, 3, 2]

Before: [3, 2, 0, 1]
0 0 0 3
After:  [3, 2, 0, 9]

Before: [2, 0, 1, 3]
15 0 3 2
After:  [2, 0, 3, 3]

Before: [3, 1, 1, 2]
6 2 0 3
After:  [3, 1, 1, 3]

Before: [0, 0, 3, 1]
7 3 1 2
After:  [0, 0, 1, 1]

Before: [2, 2, 3, 3]
15 1 3 0
After:  [3, 2, 3, 3]

Before: [0, 0, 1, 1]
7 2 1 3
After:  [0, 0, 1, 1]

Before: [0, 1, 3, 2]
12 1 2 2
After:  [0, 1, 3, 2]

Before: [0, 1, 3, 3]
0 2 2 2
After:  [0, 1, 9, 3]

Before: [0, 0, 2, 3]
10 0 1 3
After:  [0, 0, 2, 1]

Before: [1, 3, 1, 1]
6 0 1 3
After:  [1, 3, 1, 3]

Before: [1, 0, 1, 2]
10 1 2 1
After:  [1, 1, 1, 2]

Before: [0, 1, 0, 2]
14 3 1 0
After:  [3, 1, 0, 2]

Before: [0, 1, 3, 2]
9 0 0 2
After:  [0, 1, 0, 2]

Before: [1, 0, 1, 2]
1 1 0 0
After:  [1, 0, 1, 2]

Before: [3, 0, 2, 1]
7 3 1 0
After:  [1, 0, 2, 1]

Before: [2, 2, 1, 3]
5 2 3 2
After:  [2, 2, 3, 3]

Before: [1, 3, 0, 3]
5 0 3 2
After:  [1, 3, 3, 3]

Before: [0, 1, 3, 1]
12 1 2 2
After:  [0, 1, 3, 1]

Before: [2, 3, 2, 3]
15 2 3 1
After:  [2, 3, 2, 3]

Before: [2, 1, 1, 3]
11 0 3 2
After:  [2, 1, 0, 3]

Before: [2, 2, 0, 2]
3 1 3 3
After:  [2, 2, 0, 1]

Before: [2, 3, 2, 3]
15 0 3 2
After:  [2, 3, 3, 3]

Before: [3, 2, 1, 3]
5 2 3 1
After:  [3, 3, 1, 3]

Before: [1, 0, 1, 3]
5 2 3 2
After:  [1, 0, 3, 3]

Before: [0, 1, 3, 1]
2 1 0 2
After:  [0, 1, 1, 1]

Before: [1, 0, 3, 2]
7 0 1 3
After:  [1, 0, 3, 1]

Before: [1, 2, 2, 2]
3 1 3 1
After:  [1, 1, 2, 2]

Before: [2, 3, 0, 3]
4 1 0 0
After:  [1, 3, 0, 3]

Before: [3, 3, 1, 1]
6 2 0 2
After:  [3, 3, 3, 1]

Before: [2, 3, 3, 1]
0 0 2 3
After:  [2, 3, 3, 6]

Before: [1, 1, 2, 1]
14 3 2 0
After:  [3, 1, 2, 1]

Before: [1, 3, 1, 3]
11 0 3 0
After:  [0, 3, 1, 3]

Before: [2, 2, 0, 3]
15 0 3 1
After:  [2, 3, 0, 3]

Before: [1, 2, 2, 0]
10 1 0 1
After:  [1, 1, 2, 0]

Before: [1, 0, 1, 0]
10 1 2 1
After:  [1, 1, 1, 0]

Before: [1, 2, 0, 3]
10 1 0 2
After:  [1, 2, 1, 3]

Before: [0, 1, 1, 1]
2 1 0 3
After:  [0, 1, 1, 1]

Before: [2, 0, 1, 0]
7 2 1 2
After:  [2, 0, 1, 0]

Before: [0, 3, 1, 3]
6 2 1 1
After:  [0, 3, 1, 3]

Before: [3, 1, 3, 3]
5 1 3 1
After:  [3, 3, 3, 3]

Before: [0, 3, 3, 1]
0 1 2 2
After:  [0, 3, 9, 1]

Before: [2, 3, 2, 2]
8 3 2 0
After:  [4, 3, 2, 2]

Before: [2, 3, 1, 2]
4 1 0 3
After:  [2, 3, 1, 1]

Before: [1, 0, 3, 2]
12 0 2 0
After:  [3, 0, 3, 2]

Before: [2, 1, 2, 2]
8 2 1 0
After:  [3, 1, 2, 2]

Before: [0, 0, 0, 0]
10 0 1 3
After:  [0, 0, 0, 1]

Before: [1, 3, 0, 3]
11 0 3 2
After:  [1, 3, 0, 3]

Before: [2, 0, 3, 1]
7 3 1 1
After:  [2, 1, 3, 1]

Before: [0, 0, 3, 0]
10 0 1 2
After:  [0, 0, 1, 0]

Before: [2, 3, 1, 3]
4 1 0 0
After:  [1, 3, 1, 3]

Before: [3, 3, 2, 0]
13 1 0 3
After:  [3, 3, 2, 1]

Before: [1, 2, 2, 2]
10 1 0 1
After:  [1, 1, 2, 2]

Before: [3, 1, 3, 3]
12 1 2 1
After:  [3, 3, 3, 3]

Before: [3, 3, 2, 1]
14 3 2 0
After:  [3, 3, 2, 1]

Before: [2, 3, 2, 1]
4 1 2 1
After:  [2, 1, 2, 1]

Before: [0, 2, 2, 3]
15 2 3 3
After:  [0, 2, 2, 3]

Before: [3, 2, 3, 1]
0 2 0 1
After:  [3, 9, 3, 1]

Before: [0, 2, 0, 2]
3 1 3 3
After:  [0, 2, 0, 1]

Before: [3, 2, 3, 0]
0 2 2 3
After:  [3, 2, 3, 9]

Before: [0, 2, 1, 3]
9 0 0 1
After:  [0, 0, 1, 3]

Before: [0, 0, 0, 2]
9 0 0 1
After:  [0, 0, 0, 2]

Before: [1, 0, 3, 1]
1 1 0 1
After:  [1, 1, 3, 1]

Before: [1, 0, 1, 1]
7 3 1 3
After:  [1, 0, 1, 1]

Before: [0, 3, 3, 2]
9 0 0 0
After:  [0, 3, 3, 2]

Before: [1, 0, 1, 1]
1 1 0 2
After:  [1, 0, 1, 1]

Before: [3, 2, 1, 3]
6 2 0 0
After:  [3, 2, 1, 3]

Before: [2, 3, 2, 0]
4 1 2 0
After:  [1, 3, 2, 0]

Before: [1, 0, 2, 2]
1 1 0 1
After:  [1, 1, 2, 2]

Before: [1, 2, 1, 3]
11 0 3 1
After:  [1, 0, 1, 3]

Before: [0, 0, 2, 1]
7 3 1 2
After:  [0, 0, 1, 1]

Before: [1, 3, 1, 0]
6 2 1 1
After:  [1, 3, 1, 0]

Before: [1, 0, 1, 3]
1 1 0 0
After:  [1, 0, 1, 3]

Before: [3, 2, 2, 3]
15 2 3 0
After:  [3, 2, 2, 3]

Before: [1, 0, 1, 3]
11 0 3 1
After:  [1, 0, 1, 3]

Before: [3, 2, 1, 1]
13 1 1 2
After:  [3, 2, 1, 1]

Before: [1, 3, 0, 3]
5 0 3 1
After:  [1, 3, 0, 3]

Before: [2, 2, 2, 3]
8 0 2 1
After:  [2, 4, 2, 3]

Before: [0, 0, 3, 0]
9 0 0 3
After:  [0, 0, 3, 0]

Before: [1, 0, 2, 2]
1 1 0 3
After:  [1, 0, 2, 1]

Before: [0, 0, 3, 2]
10 0 1 3
After:  [0, 0, 3, 1]

Before: [0, 0, 0, 1]
10 1 3 1
After:  [0, 1, 0, 1]

Before: [0, 3, 3, 2]
0 3 1 2
After:  [0, 3, 6, 2]

Before: [2, 1, 3, 3]
12 1 2 1
After:  [2, 3, 3, 3]

Before: [0, 0, 2, 0]
8 0 2 1
After:  [0, 2, 2, 0]

Before: [3, 1, 1, 2]
14 3 1 3
After:  [3, 1, 1, 3]

Before: [0, 3, 2, 1]
4 1 2 2
After:  [0, 3, 1, 1]

Before: [3, 0, 1, 3]
5 2 3 0
After:  [3, 0, 1, 3]

Before: [1, 0, 3, 2]
0 3 2 2
After:  [1, 0, 6, 2]

Before: [2, 1, 3, 3]
11 0 3 3
After:  [2, 1, 3, 0]

Before: [1, 0, 0, 2]
1 1 0 3
After:  [1, 0, 0, 1]

Before: [3, 0, 1, 1]
7 3 1 0
After:  [1, 0, 1, 1]

Before: [2, 1, 2, 3]
5 1 3 3
After:  [2, 1, 2, 3]

Before: [1, 2, 0, 1]
10 1 0 3
After:  [1, 2, 0, 1]

Before: [2, 1, 0, 3]
15 0 3 0
After:  [3, 1, 0, 3]

Before: [1, 3, 3, 1]
12 0 2 3
After:  [1, 3, 3, 3]

Before: [2, 2, 3, 2]
3 1 3 1
After:  [2, 1, 3, 2]

Before: [2, 3, 3, 2]
4 1 0 1
After:  [2, 1, 3, 2]

Before: [3, 0, 1, 0]
7 2 1 1
After:  [3, 1, 1, 0]

Before: [1, 1, 0, 2]
14 3 1 2
After:  [1, 1, 3, 2]

Before: [2, 3, 1, 2]
6 2 1 3
After:  [2, 3, 1, 3]

Before: [2, 0, 0, 1]
10 1 3 2
After:  [2, 0, 1, 1]

Before: [1, 3, 1, 3]
5 0 3 0
After:  [3, 3, 1, 3]

Before: [0, 0, 1, 0]
7 2 1 2
After:  [0, 0, 1, 0]

Before: [1, 2, 1, 3]
11 0 3 2
After:  [1, 2, 0, 3]

Before: [2, 3, 0, 0]
4 1 0 3
After:  [2, 3, 0, 1]

Before: [1, 3, 1, 1]
6 2 1 0
After:  [3, 3, 1, 1]

Before: [0, 2, 2, 2]
3 1 3 2
After:  [0, 2, 1, 2]

Before: [3, 0, 3, 1]
10 1 3 3
After:  [3, 0, 3, 1]

Before: [2, 2, 1, 2]
13 1 1 1
After:  [2, 1, 1, 2]

Before: [0, 1, 3, 0]
9 0 0 3
After:  [0, 1, 3, 0]

Before: [2, 3, 0, 3]
4 1 0 3
After:  [2, 3, 0, 1]

Before: [0, 3, 2, 2]
4 1 2 2
After:  [0, 3, 1, 2]

Before: [2, 3, 3, 0]
4 1 0 0
After:  [1, 3, 3, 0]

Before: [0, 2, 3, 3]
15 1 3 1
After:  [0, 3, 3, 3]

Before: [0, 0, 2, 2]
8 0 2 3
After:  [0, 0, 2, 2]

Before: [1, 2, 2, 3]
11 0 3 0
After:  [0, 2, 2, 3]

Before: [0, 1, 0, 3]
2 1 0 3
After:  [0, 1, 0, 1]

Before: [3, 2, 3, 2]
3 1 3 0
After:  [1, 2, 3, 2]

Before: [3, 3, 1, 0]
0 0 0 2
After:  [3, 3, 9, 0]

Before: [1, 0, 0, 3]
7 0 1 1
After:  [1, 1, 0, 3]

Before: [0, 0, 0, 1]
7 3 1 1
After:  [0, 1, 0, 1]

Before: [1, 0, 0, 3]
1 1 0 1
After:  [1, 1, 0, 3]

Before: [1, 0, 2, 1]
14 3 2 2
After:  [1, 0, 3, 1]

Before: [1, 3, 2, 1]
14 3 2 2
After:  [1, 3, 3, 1]

Before: [2, 3, 3, 2]
0 2 2 3
After:  [2, 3, 3, 9]

Before: [0, 1, 2, 1]
2 1 0 2
After:  [0, 1, 1, 1]

Before: [1, 0, 3, 1]
1 1 0 3
After:  [1, 0, 3, 1]

Before: [3, 0, 3, 0]
0 2 2 2
After:  [3, 0, 9, 0]

Before: [0, 1, 2, 0]
2 1 0 3
After:  [0, 1, 2, 1]

Before: [2, 2, 3, 3]
11 0 3 0
After:  [0, 2, 3, 3]

Before: [0, 1, 0, 0]
2 1 0 1
After:  [0, 1, 0, 0]

Before: [0, 1, 0, 3]
2 1 0 0
After:  [1, 1, 0, 3]

Before: [3, 0, 2, 3]
15 2 3 2
After:  [3, 0, 3, 3]

Before: [0, 3, 1, 3]
9 0 0 1
After:  [0, 0, 1, 3]

Before: [3, 3, 2, 2]
0 2 0 3
After:  [3, 3, 2, 6]

Before: [1, 0, 2, 3]
1 1 0 3
After:  [1, 0, 2, 1]

Before: [1, 3, 3, 0]
12 0 2 2
After:  [1, 3, 3, 0]

Before: [3, 1, 3, 1]
12 1 2 3
After:  [3, 1, 3, 3]

Before: [2, 0, 1, 1]
7 3 1 0
After:  [1, 0, 1, 1]

Before: [0, 2, 0, 2]
3 1 3 1
After:  [0, 1, 0, 2]

Before: [1, 2, 1, 2]
8 0 3 3
After:  [1, 2, 1, 3]

Before: [3, 1, 1, 3]
6 1 0 2
After:  [3, 1, 3, 3]

Before: [1, 1, 3, 3]
5 0 3 1
After:  [1, 3, 3, 3]

Before: [0, 1, 3, 0]
2 1 0 1
After:  [0, 1, 3, 0]

Before: [0, 1, 2, 3]
2 1 0 2
After:  [0, 1, 1, 3]

Before: [0, 2, 0, 2]
13 1 1 3
After:  [0, 2, 0, 1]

Before: [1, 0, 1, 3]
1 1 0 2
After:  [1, 0, 1, 3]

Before: [1, 1, 0, 3]
5 0 3 3
After:  [1, 1, 0, 3]

Before: [1, 2, 3, 1]
14 3 2 1
After:  [1, 3, 3, 1]

Before: [2, 3, 2, 3]
15 2 3 2
After:  [2, 3, 3, 3]

Before: [1, 1, 2, 2]
8 2 1 1
After:  [1, 3, 2, 2]

Before: [1, 2, 1, 2]
3 1 3 2
After:  [1, 2, 1, 2]

Before: [0, 0, 1, 3]
5 2 3 2
After:  [0, 0, 3, 3]

Before: [2, 3, 0, 1]
4 1 0 2
After:  [2, 3, 1, 1]

Before: [0, 1, 3, 0]
9 0 0 2
After:  [0, 1, 0, 0]

Before: [3, 0, 0, 1]
7 3 1 0
After:  [1, 0, 0, 1]

Before: [1, 1, 3, 2]
12 1 2 1
After:  [1, 3, 3, 2]

Before: [1, 2, 3, 2]
3 1 3 3
After:  [1, 2, 3, 1]

Before: [2, 0, 1, 2]
10 1 2 3
After:  [2, 0, 1, 1]

Before: [3, 1, 3, 1]
6 1 0 2
After:  [3, 1, 3, 1]

Before: [3, 2, 2, 3]
13 1 1 2
After:  [3, 2, 1, 3]

Before: [1, 2, 0, 2]
3 1 3 3
After:  [1, 2, 0, 1]

Before: [0, 1, 0, 1]
2 1 0 3
After:  [0, 1, 0, 1]

Before: [3, 1, 1, 1]
6 1 0 3
After:  [3, 1, 1, 3]

Before: [3, 0, 3, 0]
0 2 0 3
After:  [3, 0, 3, 9]

Before: [1, 0, 1, 2]
1 1 0 2
After:  [1, 0, 1, 2]

Before: [0, 1, 2, 1]
8 2 1 1
After:  [0, 3, 2, 1]

Before: [3, 0, 2, 1]
7 3 1 2
After:  [3, 0, 1, 1]

Before: [0, 1, 1, 3]
2 1 0 1
After:  [0, 1, 1, 3]

Before: [1, 1, 2, 2]
8 1 2 2
After:  [1, 1, 3, 2]

Before: [3, 1, 3, 3]
6 1 0 0
After:  [3, 1, 3, 3]

Before: [1, 0, 3, 1]
12 0 2 3
After:  [1, 0, 3, 3]

Before: [1, 3, 3, 2]
6 0 1 1
After:  [1, 3, 3, 2]

Before: [0, 0, 3, 1]
10 1 3 1
After:  [0, 1, 3, 1]

Before: [3, 2, 3, 2]
3 1 3 1
After:  [3, 1, 3, 2]

Before: [3, 3, 1, 2]
6 2 0 2
After:  [3, 3, 3, 2]

Before: [0, 1, 0, 2]
2 1 0 2
After:  [0, 1, 1, 2]

Before: [2, 1, 2, 3]
8 0 1 1
After:  [2, 3, 2, 3]

Before: [3, 3, 1, 0]
6 2 0 3
After:  [3, 3, 1, 3]

Before: [1, 3, 3, 2]
13 1 2 1
After:  [1, 1, 3, 2]

Before: [0, 0, 2, 3]
15 2 3 0
After:  [3, 0, 2, 3]

Before: [0, 1, 1, 1]
2 1 0 2
After:  [0, 1, 1, 1]

Before: [0, 0, 0, 2]
10 0 1 2
After:  [0, 0, 1, 2]

Before: [0, 1, 1, 0]
2 1 0 1
After:  [0, 1, 1, 0]

Before: [0, 0, 2, 2]
8 3 2 2
After:  [0, 0, 4, 2]

Before: [2, 3, 1, 1]
4 1 0 3
After:  [2, 3, 1, 1]

Before: [1, 0, 0, 0]
1 1 0 3
After:  [1, 0, 0, 1]

Before: [1, 0, 3, 3]
7 0 1 2
After:  [1, 0, 1, 3]

Before: [1, 0, 3, 2]
1 1 0 1
After:  [1, 1, 3, 2]

Before: [0, 1, 1, 0]
9 0 0 0
After:  [0, 1, 1, 0]

Before: [3, 0, 3, 1]
14 3 2 2
After:  [3, 0, 3, 1]

Before: [2, 2, 2, 3]
15 1 3 1
After:  [2, 3, 2, 3]

Before: [0, 3, 3, 0]
9 0 0 0
After:  [0, 3, 3, 0]

Before: [0, 1, 3, 3]
2 1 0 3
After:  [0, 1, 3, 1]

Before: [1, 2, 2, 3]
15 2 3 2
After:  [1, 2, 3, 3]

Before: [3, 2, 2, 2]
0 3 0 2
After:  [3, 2, 6, 2]

Before: [0, 2, 3, 3]
13 1 1 3
After:  [0, 2, 3, 1]

Before: [0, 3, 2, 3]
4 1 2 1
After:  [0, 1, 2, 3]

Before: [0, 0, 3, 1]
10 0 1 3
After:  [0, 0, 3, 1]

Before: [2, 0, 2, 3]
15 0 3 2
After:  [2, 0, 3, 3]

Before: [1, 1, 3, 2]
12 1 2 3
After:  [1, 1, 3, 3]

Before: [1, 0, 2, 1]
7 0 1 3
After:  [1, 0, 2, 1]

Before: [0, 1, 3, 0]
0 2 2 3
After:  [0, 1, 3, 9]

Before: [2, 2, 2, 1]
14 3 2 2
After:  [2, 2, 3, 1]

Before: [0, 1, 0, 1]
2 1 0 0
After:  [1, 1, 0, 1]

Before: [0, 0, 2, 3]
15 2 3 1
After:  [0, 3, 2, 3]

Before: [1, 3, 0, 1]
6 0 1 2
After:  [1, 3, 3, 1]

Before: [1, 2, 2, 3]
10 1 0 3
After:  [1, 2, 2, 1]

Before: [0, 2, 3, 3]
13 1 1 2
After:  [0, 2, 1, 3]

Before: [0, 0, 0, 1]
10 1 3 0
After:  [1, 0, 0, 1]

Before: [2, 2, 3, 2]
3 1 3 0
After:  [1, 2, 3, 2]

Before: [0, 1, 2, 2]
14 3 1 1
After:  [0, 3, 2, 2]

Before: [0, 1, 3, 3]
2 1 0 1
After:  [0, 1, 3, 3]

Before: [3, 3, 3, 3]
0 2 0 0
After:  [9, 3, 3, 3]

Before: [1, 3, 2, 2]
8 0 3 1
After:  [1, 3, 2, 2]

Before: [2, 2, 0, 3]
15 1 3 2
After:  [2, 2, 3, 3]

Before: [1, 1, 2, 3]
5 0 3 0
After:  [3, 1, 2, 3]

Before: [2, 3, 3, 3]
11 0 3 3
After:  [2, 3, 3, 0]

Before: [2, 3, 2, 3]
4 1 0 1
After:  [2, 1, 2, 3]

Before: [2, 0, 0, 3]
11 0 3 1
After:  [2, 0, 0, 3]

Before: [3, 3, 1, 3]
5 2 3 1
After:  [3, 3, 1, 3]

Before: [1, 0, 3, 0]
12 0 2 2
After:  [1, 0, 3, 0]

Before: [1, 1, 3, 3]
5 1 3 2
After:  [1, 1, 3, 3]

Before: [1, 2, 0, 2]
3 1 3 1
After:  [1, 1, 0, 2]

Before: [2, 2, 3, 2]
3 1 3 2
After:  [2, 2, 1, 2]

Before: [3, 1, 2, 1]
6 1 0 1
After:  [3, 3, 2, 1]

Before: [0, 1, 3, 0]
2 1 0 0
After:  [1, 1, 3, 0]

Before: [1, 0, 1, 3]
8 1 3 2
After:  [1, 0, 3, 3]

Before: [1, 1, 2, 3]
11 0 3 2
After:  [1, 1, 0, 3]

Before: [0, 3, 2, 3]
9 0 0 0
After:  [0, 3, 2, 3]

Before: [3, 2, 2, 0]
13 1 1 0
After:  [1, 2, 2, 0]

Before: [1, 0, 0, 1]
1 1 0 1
After:  [1, 1, 0, 1]

Before: [2, 0, 0, 3]
15 0 3 0
After:  [3, 0, 0, 3]

Before: [3, 2, 0, 2]
3 1 3 3
After:  [3, 2, 0, 1]

Before: [1, 0, 1, 3]
5 2 3 1
After:  [1, 3, 1, 3]

Before: [2, 3, 3, 1]
4 1 0 1
After:  [2, 1, 3, 1]

Before: [2, 2, 1, 3]
5 2 3 1
After:  [2, 3, 1, 3]

Before: [0, 1, 0, 0]
9 0 0 2
After:  [0, 1, 0, 0]

Before: [0, 1, 0, 1]
2 1 0 2
After:  [0, 1, 1, 1]

Before: [0, 1, 0, 2]
2 1 0 3
After:  [0, 1, 0, 1]

Before: [1, 2, 2, 2]
13 1 1 1
After:  [1, 1, 2, 2]

Before: [1, 2, 1, 2]
3 1 3 3
After:  [1, 2, 1, 1]

Before: [1, 0, 2, 3]
11 0 3 1
After:  [1, 0, 2, 3]

Before: [0, 2, 0, 3]
15 1 3 0
After:  [3, 2, 0, 3]

Before: [1, 2, 3, 3]
15 1 3 2
After:  [1, 2, 3, 3]

Before: [0, 0, 1, 1]
10 1 2 2
After:  [0, 0, 1, 1]

Before: [1, 3, 1, 3]
5 2 3 3
After:  [1, 3, 1, 3]

Before: [1, 3, 1, 3]
6 0 1 2
After:  [1, 3, 3, 3]

Before: [0, 1, 2, 2]
2 1 0 0
After:  [1, 1, 2, 2]

Before: [2, 2, 2, 2]
3 1 3 0
After:  [1, 2, 2, 2]

Before: [0, 1, 3, 2]
2 1 0 3
After:  [0, 1, 3, 1]

Before: [2, 2, 3, 1]
13 1 0 1
After:  [2, 1, 3, 1]

Before: [2, 0, 2, 1]
7 3 1 0
After:  [1, 0, 2, 1]

Before: [1, 0, 3, 3]
12 0 2 0
After:  [3, 0, 3, 3]

Before: [0, 0, 3, 3]
10 0 1 3
After:  [0, 0, 3, 1]

Before: [0, 2, 0, 2]
9 0 0 0
After:  [0, 2, 0, 2]

Before: [1, 2, 0, 3]
11 0 3 0
After:  [0, 2, 0, 3]

Before: [2, 0, 0, 3]
11 0 3 0
After:  [0, 0, 0, 3]

Before: [0, 2, 0, 2]
3 1 3 0
After:  [1, 2, 0, 2]

Before: [1, 3, 1, 3]
6 0 1 1
After:  [1, 3, 1, 3]

Before: [0, 1, 3, 2]
2 1 0 2
After:  [0, 1, 1, 2]

Before: [1, 0, 3, 1]
1 1 0 2
After:  [1, 0, 1, 1]

Before: [1, 0, 2, 0]
7 0 1 1
After:  [1, 1, 2, 0]

Before: [2, 3, 1, 3]
15 0 3 3
After:  [2, 3, 1, 3]

Before: [1, 2, 0, 3]
11 0 3 1
After:  [1, 0, 0, 3]

Before: [1, 3, 0, 1]
6 0 1 0
After:  [3, 3, 0, 1]

Before: [2, 2, 1, 2]
3 1 3 2
After:  [2, 2, 1, 2]

Before: [1, 0, 3, 3]
1 1 0 2
After:  [1, 0, 1, 3]

Before: [3, 1, 0, 3]
5 1 3 2
After:  [3, 1, 3, 3]

Before: [0, 1, 2, 3]
8 2 1 1
After:  [0, 3, 2, 3]

Before: [0, 2, 2, 2]
3 1 3 1
After:  [0, 1, 2, 2]

Before: [1, 1, 2, 2]
0 0 3 1
After:  [1, 2, 2, 2]

Before: [2, 3, 1, 3]
11 0 3 1
After:  [2, 0, 1, 3]

Before: [3, 3, 2, 3]
4 1 2 0
After:  [1, 3, 2, 3]

Before: [3, 1, 3, 3]
5 1 3 2
After:  [3, 1, 3, 3]

Before: [2, 2, 1, 0]
13 1 1 1
After:  [2, 1, 1, 0]

Before: [0, 1, 3, 2]
2 1 0 0
After:  [1, 1, 3, 2]

Before: [3, 2, 0, 3]
15 1 3 0
After:  [3, 2, 0, 3]

Before: [2, 3, 0, 2]
0 1 0 0
After:  [6, 3, 0, 2]

Before: [2, 3, 0, 2]
4 1 0 1
After:  [2, 1, 0, 2]

Before: [1, 0, 1, 2]
1 1 0 3
After:  [1, 0, 1, 1]

Before: [2, 3, 3, 2]
0 3 2 1
After:  [2, 6, 3, 2]

Before: [0, 1, 3, 1]
2 1 0 3
After:  [0, 1, 3, 1]

Before: [2, 0, 0, 3]
15 0 3 3
After:  [2, 0, 0, 3]

Before: [2, 1, 3, 3]
5 1 3 3
After:  [2, 1, 3, 3]

Before: [3, 1, 3, 2]
12 1 2 3
After:  [3, 1, 3, 3]

Before: [0, 2, 1, 2]
3 1 3 1
After:  [0, 1, 1, 2]

Before: [0, 1, 0, 0]
2 1 0 3
After:  [0, 1, 0, 1]

Before: [0, 2, 3, 1]
14 3 2 0
After:  [3, 2, 3, 1]

Before: [3, 2, 2, 1]
13 1 1 1
After:  [3, 1, 2, 1]

Before: [3, 3, 1, 3]
6 2 0 3
After:  [3, 3, 1, 3]

Before: [3, 0, 3, 1]
14 3 2 3
After:  [3, 0, 3, 3]

Before: [2, 3, 2, 3]
11 0 3 0
After:  [0, 3, 2, 3]

Before: [2, 0, 1, 3]
5 2 3 2
After:  [2, 0, 3, 3]

Before: [1, 3, 1, 3]
11 0 3 1
After:  [1, 0, 1, 3]

Before: [1, 0, 1, 1]
7 3 1 1
After:  [1, 1, 1, 1]

Before: [1, 2, 2, 1]
14 3 2 0
After:  [3, 2, 2, 1]

Before: [1, 0, 2, 3]
8 1 2 1
After:  [1, 2, 2, 3]

Before: [1, 0, 1, 0]
7 2 1 0
After:  [1, 0, 1, 0]

Before: [2, 2, 1, 0]
13 1 1 2
After:  [2, 2, 1, 0]

Before: [1, 0, 1, 2]
7 2 1 2
After:  [1, 0, 1, 2]

Before: [2, 2, 2, 2]
3 1 3 2
After:  [2, 2, 1, 2]

Before: [2, 1, 0, 3]
11 0 3 1
After:  [2, 0, 0, 3]

Before: [2, 1, 2, 3]
11 0 3 1
After:  [2, 0, 2, 3]

Before: [0, 0, 1, 1]
7 3 1 1
After:  [0, 1, 1, 1]

Before: [1, 1, 0, 2]
14 3 1 1
After:  [1, 3, 0, 2]

Before: [1, 0, 1, 0]
7 0 1 3
After:  [1, 0, 1, 1]

Before: [0, 1, 2, 2]
8 3 2 1
After:  [0, 4, 2, 2]

Before: [1, 3, 0, 2]
6 0 1 0
After:  [3, 3, 0, 2]

Before: [1, 0, 1, 2]
7 0 1 0
After:  [1, 0, 1, 2]

Before: [3, 0, 3, 1]
7 3 1 2
After:  [3, 0, 1, 1]

Before: [0, 2, 0, 0]
9 0 0 0
After:  [0, 2, 0, 0]

Before: [1, 1, 2, 3]
8 1 2 2
After:  [1, 1, 3, 3]

Before: [0, 1, 2, 1]
2 1 0 1
After:  [0, 1, 2, 1]

Before: [1, 3, 3, 3]
11 0 3 1
After:  [1, 0, 3, 3]

Before: [3, 3, 1, 0]
6 2 0 0
After:  [3, 3, 1, 0]

Before: [2, 2, 0, 3]
11 0 3 3
After:  [2, 2, 0, 0]

Before: [3, 0, 1, 0]
7 2 1 0
After:  [1, 0, 1, 0]

Before: [1, 0, 3, 3]
1 1 0 0
After:  [1, 0, 3, 3]

Before: [1, 3, 3, 1]
14 3 2 3
After:  [1, 3, 3, 3]

Before: [2, 2, 0, 0]
13 1 0 1
After:  [2, 1, 0, 0]

Before: [2, 2, 2, 3]
15 2 3 0
After:  [3, 2, 2, 3]

Before: [3, 3, 0, 3]
0 0 0 3
After:  [3, 3, 0, 9]

Before: [2, 2, 1, 3]
15 1 3 0
After:  [3, 2, 1, 3]

Before: [2, 1, 3, 2]
0 2 0 3
After:  [2, 1, 3, 6]

Before: [0, 1, 1, 3]
2 1 0 2
After:  [0, 1, 1, 3]

Before: [2, 0, 1, 1]
7 2 1 0
After:  [1, 0, 1, 1]

Before: [1, 0, 2, 3]
8 1 3 2
After:  [1, 0, 3, 3]

Before: [0, 1, 0, 3]
2 1 0 1
After:  [0, 1, 0, 3]

Before: [0, 1, 2, 2]
2 1 0 3
After:  [0, 1, 2, 1]

Before: [1, 0, 1, 3]
1 1 0 3
After:  [1, 0, 1, 1]

Before: [2, 3, 1, 3]
4 1 0 3
After:  [2, 3, 1, 1]

Before: [2, 3, 2, 1]
4 1 0 3
After:  [2, 3, 2, 1]

Before: [1, 1, 1, 2]
0 0 3 0
After:  [2, 1, 1, 2]

Before: [0, 0, 0, 1]
9 0 0 0
After:  [0, 0, 0, 1]

Before: [1, 0, 3, 3]
5 0 3 1
After:  [1, 3, 3, 3]

Before: [0, 1, 1, 0]
2 1 0 3
After:  [0, 1, 1, 1]

Before: [1, 2, 1, 3]
10 1 0 3
After:  [1, 2, 1, 1]

Before: [0, 2, 0, 2]
3 1 3 2
After:  [0, 2, 1, 2]

Before: [2, 2, 1, 2]
3 1 3 3
After:  [2, 2, 1, 1]

Before: [2, 1, 3, 2]
12 1 2 3
After:  [2, 1, 3, 3]

Before: [2, 1, 2, 3]
15 2 3 3
After:  [2, 1, 2, 3]

Before: [0, 1, 2, 2]
9 0 0 2
After:  [0, 1, 0, 2]

Before: [0, 2, 2, 2]
8 0 2 0
After:  [2, 2, 2, 2]

Before: [0, 3, 2, 3]
4 1 2 0
After:  [1, 3, 2, 3]

Before: [1, 1, 3, 2]
8 0 3 0
After:  [3, 1, 3, 2]

Before: [1, 1, 3, 1]
12 1 2 1
After:  [1, 3, 3, 1]

Before: [2, 1, 1, 3]
5 1 3 3
After:  [2, 1, 1, 3]

Before: [3, 1, 1, 2]
6 1 0 1
After:  [3, 3, 1, 2]

Before: [1, 2, 2, 3]
15 2 3 0
After:  [3, 2, 2, 3]

Before: [3, 1, 3, 2]
6 1 0 1
After:  [3, 3, 3, 2]

Before: [2, 2, 0, 2]
3 1 3 1
After:  [2, 1, 0, 2]

Before: [3, 0, 1, 3]
5 2 3 3
After:  [3, 0, 1, 3]

Before: [3, 3, 1, 2]
8 2 3 2
After:  [3, 3, 3, 2]

Before: [2, 1, 2, 0]
8 3 2 2
After:  [2, 1, 2, 0]

Before: [1, 2, 3, 0]
12 0 2 2
After:  [1, 2, 3, 0]

Before: [3, 2, 0, 2]
3 1 3 1
After:  [3, 1, 0, 2]

Before: [1, 2, 1, 3]
5 0 3 2
After:  [1, 2, 3, 3]

Before: [0, 1, 0, 3]
9 0 0 0
After:  [0, 1, 0, 3]

Before: [1, 2, 3, 3]
10 1 0 2
After:  [1, 2, 1, 3]

Before: [2, 2, 1, 1]
13 1 0 3
After:  [2, 2, 1, 1]

Before: [2, 0, 2, 3]
15 2 3 0
After:  [3, 0, 2, 3]

Before: [2, 0, 0, 1]
10 1 3 1
After:  [2, 1, 0, 1]

Before: [1, 0, 2, 1]
1 1 0 1
After:  [1, 1, 2, 1]

Before: [3, 0, 1, 3]
10 1 2 3
After:  [3, 0, 1, 1]

Before: [1, 1, 3, 3]
5 1 3 1
After:  [1, 3, 3, 3]

Before: [1, 1, 2, 3]
5 0 3 3
After:  [1, 1, 2, 3]

Before: [3, 0, 1, 0]
6 2 0 3
After:  [3, 0, 1, 3]

Before: [1, 2, 0, 0]
10 1 0 3
After:  [1, 2, 0, 1]

Before: [0, 1, 0, 2]
2 1 0 0
After:  [1, 1, 0, 2]

Before: [0, 1, 2, 0]
9 0 0 1
After:  [0, 0, 2, 0]

Before: [1, 1, 0, 3]
8 2 3 1
After:  [1, 3, 0, 3]

Before: [2, 3, 1, 3]
4 1 0 1
After:  [2, 1, 1, 3]

Before: [0, 1, 3, 3]
9 0 0 3
After:  [0, 1, 3, 0]

Before: [0, 0, 1, 3]
10 0 1 0
After:  [1, 0, 1, 3]

Before: [2, 0, 1, 1]
10 1 3 3
After:  [2, 0, 1, 1]

Before: [3, 3, 0, 0]
0 0 1 1
After:  [3, 9, 0, 0]

Before: [1, 3, 2, 0]
4 1 2 0
After:  [1, 3, 2, 0]

Before: [0, 1, 1, 3]
9 0 0 0
After:  [0, 1, 1, 3]

Before: [0, 1, 2, 0]
2 1 0 2
After:  [0, 1, 1, 0]

Before: [2, 3, 3, 0]
0 2 1 1
After:  [2, 9, 3, 0]

Before: [0, 0, 1, 2]
10 1 2 3
After:  [0, 0, 1, 1]

Before: [2, 2, 0, 2]
13 1 0 3
After:  [2, 2, 0, 1]

Before: [1, 0, 1, 1]
10 1 2 0
After:  [1, 0, 1, 1]

Before: [3, 3, 2, 2]
13 1 0 1
After:  [3, 1, 2, 2]

Before: [1, 0, 2, 1]
8 0 2 1
After:  [1, 3, 2, 1]

Before: [1, 1, 2, 2]
8 2 2 2
After:  [1, 1, 4, 2]

Before: [0, 0, 1, 3]
5 2 3 3
After:  [0, 0, 1, 3]

Before: [2, 3, 1, 0]
6 2 1 3
After:  [2, 3, 1, 3]

Before: [1, 3, 1, 0]
6 2 1 3
After:  [1, 3, 1, 3]

Before: [1, 0, 2, 3]
7 0 1 2
After:  [1, 0, 1, 3]

Before: [2, 0, 3, 1]
0 3 0 0
After:  [2, 0, 3, 1]

Before: [2, 2, 3, 2]
3 1 3 3
After:  [2, 2, 3, 1]

Before: [0, 1, 0, 3]
2 1 0 2
After:  [0, 1, 1, 3]

Before: [3, 1, 1, 3]
6 1 0 1
After:  [3, 3, 1, 3]

Before: [1, 2, 2, 3]
13 1 1 1
After:  [1, 1, 2, 3]

Before: [2, 2, 1, 3]
15 0 3 2
After:  [2, 2, 3, 3]

Before: [1, 0, 0, 0]
1 1 0 1
After:  [1, 1, 0, 0]

Before: [2, 2, 0, 3]
11 0 3 0
After:  [0, 2, 0, 3]

Before: [1, 0, 3, 2]
1 1 0 0
After:  [1, 0, 3, 2]

Before: [1, 0, 3, 0]
1 1 0 1
After:  [1, 1, 3, 0]

Before: [0, 2, 2, 0]
9 0 0 3
After:  [0, 2, 2, 0]

Before: [0, 3, 3, 3]
0 3 1 0
After:  [9, 3, 3, 3]

Before: [3, 2, 1, 2]
3 1 3 2
After:  [3, 2, 1, 2]

Before: [3, 1, 2, 2]
14 3 1 3
After:  [3, 1, 2, 3]

Before: [3, 1, 3, 1]
12 1 2 1
After:  [3, 3, 3, 1]

Before: [3, 3, 3, 3]
0 3 0 0
After:  [9, 3, 3, 3]

Before: [1, 3, 3, 2]
12 0 2 2
After:  [1, 3, 3, 2]

Before: [2, 0, 1, 3]
11 0 3 1
After:  [2, 0, 1, 3]

Before: [1, 0, 1, 0]
1 1 0 2
After:  [1, 0, 1, 0]

Before: [1, 2, 0, 2]
3 1 3 0
After:  [1, 2, 0, 2]

Before: [1, 0, 1, 3]
11 0 3 2
After:  [1, 0, 0, 3]

Before: [2, 0, 2, 1]
7 3 1 3
After:  [2, 0, 2, 1]

Before: [0, 2, 3, 2]
3 1 3 2
After:  [0, 2, 1, 2]

Before: [3, 1, 2, 1]
14 3 2 3
After:  [3, 1, 2, 3]

Before: [1, 0, 2, 3]
1 1 0 1
After:  [1, 1, 2, 3]

Before: [0, 1, 3, 1]
2 1 0 1
After:  [0, 1, 3, 1]

Before: [1, 0, 2, 0]
1 1 0 3
After:  [1, 0, 2, 1]

Before: [1, 2, 0, 3]
13 1 1 3
After:  [1, 2, 0, 1]

Before: [0, 2, 2, 2]
9 0 0 3
After:  [0, 2, 2, 0]

Before: [0, 2, 0, 1]
13 1 1 3
After:  [0, 2, 0, 1]

Before: [1, 2, 2, 3]
13 1 1 0
After:  [1, 2, 2, 3]

Before: [1, 0, 1, 2]
7 0 1 3
After:  [1, 0, 1, 1]

Before: [2, 3, 2, 3]
15 2 3 3
After:  [2, 3, 2, 3]

Before: [2, 3, 0, 3]
4 1 0 1
After:  [2, 1, 0, 3]

Before: [1, 0, 0, 1]
7 0 1 0
After:  [1, 0, 0, 1]

Before: [0, 1, 3, 2]
12 1 2 3
After:  [0, 1, 3, 3]

Before: [2, 2, 1, 3]
11 0 3 1
After:  [2, 0, 1, 3]

Before: [0, 3, 2, 2]
0 2 1 3
After:  [0, 3, 2, 6]

Before: [3, 0, 3, 1]
14 3 2 1
After:  [3, 3, 3, 1]

Before: [3, 3, 2, 0]
4 1 2 0
After:  [1, 3, 2, 0]

Before: [2, 0, 3, 3]
15 0 3 3
After:  [2, 0, 3, 3]

Before: [1, 0, 2, 0]
1 1 0 0
After:  [1, 0, 2, 0]

Before: [2, 3, 1, 1]
6 2 1 0
After:  [3, 3, 1, 1]

Before: [0, 1, 0, 0]
2 1 0 0
After:  [1, 1, 0, 0]

Before: [0, 2, 1, 2]
9 0 0 2
After:  [0, 2, 0, 2]

Before: [0, 2, 2, 1]
14 3 2 3
After:  [0, 2, 2, 3]

Before: [2, 3, 2, 1]
4 1 2 0
After:  [1, 3, 2, 1]

Before: [3, 3, 0, 3]
8 2 3 1
After:  [3, 3, 0, 3]

Before: [3, 3, 3, 0]
13 1 0 0
After:  [1, 3, 3, 0]

Before: [1, 3, 0, 3]
0 3 1 0
After:  [9, 3, 0, 3]

Before: [1, 0, 1, 0]
1 1 0 3
After:  [1, 0, 1, 1]

Before: [0, 0, 1, 3]
5 2 3 1
After:  [0, 3, 1, 3]

Before: [3, 1, 3, 2]
12 1 2 1
After:  [3, 3, 3, 2]

Before: [1, 3, 2, 1]
6 0 1 3
After:  [1, 3, 2, 3]

Before: [2, 0, 2, 1]
8 0 2 1
After:  [2, 4, 2, 1]

Before: [2, 0, 2, 2]
8 1 2 2
After:  [2, 0, 2, 2]

Before: [0, 0, 1, 1]
7 3 1 2
After:  [0, 0, 1, 1]

Before: [3, 0, 2, 2]
8 1 2 1
After:  [3, 2, 2, 2]

Before: [3, 1, 3, 3]
5 1 3 3
After:  [3, 1, 3, 3]

Before: [0, 1, 0, 2]
9 0 0 0
After:  [0, 1, 0, 2]

Before: [3, 1, 2, 2]
6 1 0 0
After:  [3, 1, 2, 2]

Before: [3, 0, 1, 0]
6 2 0 0
After:  [3, 0, 1, 0]

Before: [0, 1, 1, 1]
9 0 0 2
After:  [0, 1, 0, 1]

Before: [1, 2, 0, 3]
15 1 3 2
After:  [1, 2, 3, 3]

Before: [2, 3, 1, 0]
4 1 0 2
After:  [2, 3, 1, 0]

Before: [2, 1, 2, 2]
14 3 1 1
After:  [2, 3, 2, 2]

Before: [3, 2, 0, 3]
15 1 3 3
After:  [3, 2, 0, 3]

Before: [1, 3, 0, 0]
6 0 1 0
After:  [3, 3, 0, 0]

Before: [0, 1, 1, 3]
2 1 0 0
After:  [1, 1, 1, 3]

Before: [0, 3, 3, 1]
14 3 2 0
After:  [3, 3, 3, 1]

Before: [1, 3, 3, 3]
13 1 2 1
After:  [1, 1, 3, 3]

Before: [0, 3, 2, 0]
4 1 2 1
After:  [0, 1, 2, 0]

Before: [1, 0, 3, 1]
12 0 2 0
After:  [3, 0, 3, 1]

Before: [1, 1, 2, 2]
14 3 1 2
After:  [1, 1, 3, 2]

Before: [2, 1, 1, 3]
5 2 3 2
After:  [2, 1, 3, 3]

Before: [0, 2, 2, 3]
15 1 3 1
After:  [0, 3, 2, 3]

Before: [3, 3, 2, 2]
4 1 2 3
After:  [3, 3, 2, 1]

Before: [0, 1, 3, 1]
9 0 0 2
After:  [0, 1, 0, 1]

Before: [3, 1, 1, 3]
5 2 3 0
After:  [3, 1, 1, 3]

Before: [1, 0, 1, 3]
1 1 0 1
After:  [1, 1, 1, 3]

Before: [1, 0, 0, 3]
1 1 0 2
After:  [1, 0, 1, 3]

Before: [3, 2, 1, 2]
3 1 3 1
After:  [3, 1, 1, 2]

Before: [3, 2, 3, 3]
15 1 3 0
After:  [3, 2, 3, 3]

Before: [1, 2, 3, 3]
0 2 2 2
After:  [1, 2, 9, 3]

Before: [3, 0, 0, 1]
7 3 1 3
After:  [3, 0, 0, 1]

Before: [0, 1, 0, 1]
2 1 0 1
After:  [0, 1, 0, 1]

Before: [2, 1, 1, 3]
5 2 3 0
After:  [3, 1, 1, 3]

Before: [0, 1, 1, 2]
2 1 0 1
After:  [0, 1, 1, 2]

Before: [0, 0, 2, 3]
9 0 0 0
After:  [0, 0, 2, 3]

Before: [0, 2, 1, 2]
8 2 3 3
After:  [0, 2, 1, 3]

Before: [1, 0, 1, 1]
1 1 0 3
After:  [1, 0, 1, 1]

Before: [1, 0, 1, 3]
8 1 3 0
After:  [3, 0, 1, 3]

Before: [3, 1, 3, 2]
14 3 1 0
After:  [3, 1, 3, 2]

Before: [2, 2, 0, 0]
13 1 0 2
After:  [2, 2, 1, 0]

Before: [3, 1, 3, 1]
12 1 2 0
After:  [3, 1, 3, 1]

Before: [0, 3, 3, 0]
13 1 2 1
After:  [0, 1, 3, 0]

Before: [3, 1, 3, 3]
12 1 2 0
After:  [3, 1, 3, 3]

Before: [1, 2, 2, 3]
8 0 2 1
After:  [1, 3, 2, 3]

Before: [3, 0, 1, 0]
7 2 1 3
After:  [3, 0, 1, 1]

Before: [0, 1, 2, 3]
2 1 0 3
After:  [0, 1, 2, 1]

Before: [0, 0, 1, 0]
9 0 0 1
After:  [0, 0, 1, 0]

Before: [3, 2, 3, 1]
13 1 1 1
After:  [3, 1, 3, 1]

Before: [2, 2, 0, 2]
3 1 3 2
After:  [2, 2, 1, 2]

Before: [3, 3, 3, 2]
0 2 0 0
After:  [9, 3, 3, 2]

Before: [0, 0, 2, 3]
10 0 1 1
After:  [0, 1, 2, 3]

Before: [2, 3, 2, 2]
8 0 2 3
After:  [2, 3, 2, 4]

Before: [3, 3, 2, 1]
14 3 2 1
After:  [3, 3, 2, 1]

Before: [0, 0, 1, 1]
9 0 0 1
After:  [0, 0, 1, 1]

Before: [0, 2, 2, 2]
3 1 3 0
After:  [1, 2, 2, 2]

Before: [2, 2, 1, 2]
3 1 3 1
After:  [2, 1, 1, 2]

Before: [2, 1, 2, 3]
11 0 3 2
After:  [2, 1, 0, 3]

Before: [1, 2, 2, 2]
3 1 3 2
After:  [1, 2, 1, 2]

Before: [1, 3, 2, 0]
4 1 2 2
After:  [1, 3, 1, 0]

Before: [1, 1, 3, 3]
12 1 2 2
After:  [1, 1, 3, 3]

Before: [1, 2, 0, 3]
15 1 3 3
After:  [1, 2, 0, 3]

Before: [1, 2, 3, 3]
12 0 2 3
After:  [1, 2, 3, 3]

Before: [0, 2, 1, 2]
3 1 3 2
After:  [0, 2, 1, 2]

Before: [1, 1, 1, 2]
8 1 3 1
After:  [1, 3, 1, 2]

Before: [1, 1, 2, 1]
14 3 2 1
After:  [1, 3, 2, 1]

Before: [1, 0, 1, 1]
1 1 0 0
After:  [1, 0, 1, 1]

Before: [2, 1, 1, 3]
15 0 3 0
After:  [3, 1, 1, 3]

Before: [2, 1, 1, 3]
11 0 3 1
After:  [2, 0, 1, 3]

Before: [2, 3, 1, 3]
11 0 3 0
After:  [0, 3, 1, 3]

Before: [0, 3, 1, 1]
9 0 0 0
After:  [0, 3, 1, 1]

Before: [1, 0, 2, 1]
7 0 1 2
After:  [1, 0, 1, 1]

Before: [1, 0, 0, 0]
1 1 0 2
After:  [1, 0, 1, 0]

Before: [1, 0, 2, 1]
1 1 0 0
After:  [1, 0, 2, 1]

Before: [0, 3, 3, 0]
13 1 2 2
After:  [0, 3, 1, 0]

Before: [3, 2, 0, 2]
0 0 0 2
After:  [3, 2, 9, 2]

Before: [2, 1, 2, 3]
5 1 3 0
After:  [3, 1, 2, 3]

Before: [2, 2, 2, 2]
3 1 3 3
After:  [2, 2, 2, 1]

Before: [1, 3, 2, 3]
5 0 3 1
After:  [1, 3, 2, 3]

Before: [2, 1, 3, 2]
0 1 0 0
After:  [2, 1, 3, 2]

Before: [1, 0, 0, 1]
1 1 0 2
After:  [1, 0, 1, 1]

Before: [3, 3, 3, 0]
0 2 2 0
After:  [9, 3, 3, 0]

Before: [2, 2, 3, 3]
15 0 3 3
After:  [2, 2, 3, 3]

Before: [0, 3, 2, 3]
15 2 3 2
After:  [0, 3, 3, 3]

Before: [1, 2, 0, 2]
13 1 1 1
After:  [1, 1, 0, 2]

Before: [0, 3, 1, 1]
9 0 0 2
After:  [0, 3, 0, 1]

Before: [0, 1, 2, 2]
8 2 2 3
After:  [0, 1, 2, 4]

Before: [0, 0, 2, 1]
9 0 0 1
After:  [0, 0, 2, 1]

Before: [2, 3, 0, 3]
4 1 0 2
After:  [2, 3, 1, 3]

Before: [1, 0, 2, 2]
7 0 1 0
After:  [1, 0, 2, 2]

Before: [3, 1, 3, 3]
0 3 2 0
After:  [9, 1, 3, 3]

Before: [2, 3, 2, 3]
11 0 3 1
After:  [2, 0, 2, 3]

Before: [1, 0, 3, 0]
7 0 1 0
After:  [1, 0, 3, 0]

Before: [1, 3, 2, 3]
15 2 3 0
After:  [3, 3, 2, 3]

Before: [1, 3, 3, 0]
6 0 1 0
After:  [3, 3, 3, 0]

Before: [3, 0, 1, 2]
7 2 1 1
After:  [3, 1, 1, 2]

Before: [0, 3, 1, 1]
6 2 1 1
After:  [0, 3, 1, 1]

Before: [3, 3, 3, 0]
0 2 1 3
After:  [3, 3, 3, 9]

Before: [3, 2, 1, 1]
6 2 0 3
After:  [3, 2, 1, 3]

Before: [1, 0, 3, 0]
12 0 2 0
After:  [3, 0, 3, 0]

Before: [1, 2, 1, 0]
10 1 0 2
After:  [1, 2, 1, 0]

Before: [1, 3, 2, 1]
0 1 1 1
After:  [1, 9, 2, 1]

Before: [2, 3, 1, 3]
11 0 3 2
After:  [2, 3, 0, 3]

Before: [0, 1, 1, 0]
2 1 0 0
After:  [1, 1, 1, 0]

Before: [2, 2, 3, 3]
15 1 3 1
After:  [2, 3, 3, 3]

Before: [2, 3, 0, 1]
0 3 0 1
After:  [2, 2, 0, 1]

Before: [1, 0, 1, 0]
1 1 0 0
After:  [1, 0, 1, 0]

Before: [2, 2, 0, 0]
13 1 1 2
After:  [2, 2, 1, 0]

Before: [2, 0, 3, 1]
14 3 2 0
After:  [3, 0, 3, 1]

Before: [2, 1, 3, 1]
14 3 2 2
After:  [2, 1, 3, 1]

Before: [3, 3, 1, 3]
6 2 1 2
After:  [3, 3, 3, 3]

Before: [1, 2, 1, 2]
3 1 3 1
After:  [1, 1, 1, 2]

Before: [1, 2, 2, 3]
10 1 0 0
After:  [1, 2, 2, 3]

Before: [0, 1, 3, 3]
5 1 3 2
After:  [0, 1, 3, 3]

Before: [2, 1, 2, 1]
14 3 2 3
After:  [2, 1, 2, 3]

Before: [3, 3, 2, 3]
4 1 2 3
After:  [3, 3, 2, 1]

Before: [1, 3, 2, 3]
11 0 3 0
After:  [0, 3, 2, 3]

Before: [1, 2, 0, 2]
0 0 3 1
After:  [1, 2, 0, 2]

Before: [2, 2, 2, 2]
13 1 0 3
After:  [2, 2, 2, 1]

Before: [1, 3, 2, 1]
6 0 1 1
After:  [1, 3, 2, 1]

Before: [1, 3, 2, 1]
14 3 2 0
After:  [3, 3, 2, 1]

Before: [2, 3, 3, 1]
14 3 2 0
After:  [3, 3, 3, 1]

Before: [1, 2, 1, 3]
5 2 3 0
After:  [3, 2, 1, 3]

Before: [1, 1, 3, 3]
11 0 3 1
After:  [1, 0, 3, 3]

Before: [3, 1, 2, 1]
6 1 0 3
After:  [3, 1, 2, 3]

Before: [1, 0, 1, 0]
7 0 1 2
After:  [1, 0, 1, 0]

Before: [3, 0, 1, 2]
8 2 3 0
After:  [3, 0, 1, 2]

Before: [2, 3, 0, 2]
4 1 0 3
After:  [2, 3, 0, 1]

Before: [0, 2, 2, 2]
8 1 2 0
After:  [4, 2, 2, 2]

Before: [3, 2, 2, 0]
8 3 2 1
After:  [3, 2, 2, 0]

Before: [2, 1, 2, 0]
8 0 2 1
After:  [2, 4, 2, 0]

Before: [3, 1, 3, 1]
14 3 2 2
After:  [3, 1, 3, 1]

Before: [3, 3, 1, 2]
0 0 0 3
After:  [3, 3, 1, 9]

Before: [2, 1, 0, 2]
0 1 0 3
After:  [2, 1, 0, 2]

Before: [3, 3, 1, 3]
0 0 0 2
After:  [3, 3, 9, 3]

Before: [1, 0, 2, 0]
1 1 0 1
After:  [1, 1, 2, 0]

Before: [1, 2, 1, 1]
10 1 0 0
After:  [1, 2, 1, 1]

Before: [1, 0, 1, 2]
1 1 0 1
After:  [1, 1, 1, 2]`;


let str2 = `5 1 0 0
12 0 2 0
5 0 0 2
12 2 3 2
5 0 0 3
12 3 1 3
0 3 0 0
5 0 3 0
8 0 1 1
2 1 1 3
14 2 3 2
14 0 2 1
14 1 1 0
2 0 2 0
5 0 1 0
8 3 0 3
2 3 3 1
14 2 1 3
14 1 1 2
14 2 0 0
3 0 3 2
5 2 1 2
5 2 3 2
8 1 2 1
2 1 1 3
5 2 0 1
12 1 2 1
14 1 1 0
14 2 3 2
2 0 2 2
5 2 3 2
8 3 2 3
2 3 0 2
14 1 1 1
5 2 0 0
12 0 2 0
14 2 1 3
14 3 0 3
5 3 1 3
8 2 3 2
5 0 0 3
12 3 2 3
14 1 0 0
14 0 3 1
8 0 0 0
5 0 1 0
8 2 0 2
2 2 3 1
14 0 3 3
14 0 0 2
14 3 0 0
7 0 2 2
5 2 2 2
8 1 2 1
2 1 0 2
14 2 0 3
14 2 3 1
14 2 2 0
3 0 3 3
5 3 3 3
8 3 2 2
2 2 1 0
14 0 0 1
5 2 0 2
12 2 0 2
14 1 0 3
12 3 1 3
5 3 1 3
8 3 0 0
2 0 2 2
14 1 3 3
14 2 2 0
14 2 0 1
4 0 3 3
5 3 1 3
5 3 3 3
8 2 3 2
2 2 0 1
14 0 1 0
14 2 3 2
14 0 3 3
11 3 2 3
5 3 3 3
8 3 1 1
2 1 3 2
14 2 2 3
14 1 1 1
14 2 2 0
0 1 0 1
5 1 1 1
8 2 1 2
2 2 2 3
5 1 0 1
12 1 3 1
14 0 2 2
13 0 1 1
5 1 3 1
8 1 3 3
5 1 0 0
12 0 3 0
14 2 3 1
14 2 0 2
9 0 1 0
5 0 1 0
5 0 3 0
8 3 0 3
2 3 1 2
14 0 3 1
5 3 0 3
12 3 1 3
14 0 3 0
14 3 0 0
5 0 1 0
8 2 0 2
14 1 2 1
14 2 3 0
4 0 3 1
5 1 3 1
8 2 1 2
2 2 3 3
14 3 0 0
14 0 2 2
14 3 1 1
1 2 0 0
5 0 1 0
8 0 3 3
2 3 0 2
14 3 2 3
5 0 0 0
12 0 2 0
14 1 2 1
9 3 0 0
5 0 1 0
8 0 2 2
2 2 1 3
14 0 2 2
14 0 1 1
14 3 0 0
1 2 0 0
5 0 2 0
8 0 3 3
2 3 0 0
14 2 1 3
14 2 2 1
10 2 3 1
5 1 2 1
8 0 1 0
14 3 3 1
10 2 3 3
5 3 3 3
8 3 0 0
2 0 1 3
14 1 2 0
14 2 3 2
2 0 2 2
5 2 1 2
8 3 2 3
2 3 1 1
14 3 0 3
14 2 0 2
2 0 2 0
5 0 1 0
5 0 1 0
8 0 1 1
14 2 1 0
14 2 0 3
5 2 0 2
12 2 0 2
10 2 3 2
5 2 3 2
8 2 1 1
5 1 0 3
12 3 3 3
14 0 2 2
14 3 3 0
1 2 0 3
5 3 1 3
8 3 1 1
2 1 2 3
14 3 2 2
14 2 2 0
14 1 1 1
6 0 2 1
5 1 1 1
8 3 1 3
2 3 2 1
5 3 0 2
12 2 2 2
14 1 2 0
14 0 3 3
2 0 2 3
5 3 3 3
8 3 1 1
5 0 0 2
12 2 0 2
14 0 0 3
8 0 0 3
5 3 3 3
8 3 1 1
14 2 0 3
0 0 3 2
5 2 1 2
5 2 2 2
8 1 2 1
14 0 2 2
14 3 0 0
1 2 0 2
5 2 3 2
8 2 1 1
2 1 1 0
14 2 1 2
14 3 3 1
14 3 1 3
13 2 1 1
5 1 1 1
8 1 0 0
2 0 0 1
14 0 1 2
14 3 0 0
14 1 1 3
1 2 0 2
5 2 1 2
5 2 2 2
8 1 2 1
2 1 1 0
14 3 0 2
14 0 2 1
5 3 2 3
5 3 3 3
8 3 0 0
2 0 0 2
14 2 1 3
14 1 2 1
14 2 0 0
3 0 3 1
5 1 1 1
8 1 2 2
2 2 3 1
14 2 0 2
14 1 2 3
4 0 3 0
5 0 1 0
8 0 1 1
14 1 1 0
2 0 2 2
5 2 3 2
8 2 1 1
14 3 2 3
14 2 0 0
14 3 1 2
6 0 2 2
5 2 3 2
8 2 1 1
2 1 0 0
14 2 3 2
14 1 2 1
14 0 1 3
11 3 2 2
5 2 3 2
8 0 2 0
2 0 0 1
14 1 0 0
14 3 1 3
14 3 3 2
14 2 3 2
5 2 3 2
5 2 2 2
8 1 2 1
2 1 2 2
14 2 2 0
5 1 0 3
12 3 1 3
14 2 1 1
8 3 3 1
5 1 3 1
5 1 2 1
8 2 1 2
14 3 3 1
5 3 0 0
12 0 1 0
8 0 0 3
5 3 1 3
5 3 3 3
8 3 2 2
2 2 2 1
5 2 0 2
12 2 0 2
14 2 0 3
5 1 0 0
12 0 2 0
3 0 3 2
5 2 3 2
8 2 1 1
14 0 3 2
14 1 2 0
0 0 3 3
5 3 1 3
8 3 1 1
2 1 1 3
14 1 0 2
14 1 0 1
8 1 0 0
5 0 3 0
8 0 3 3
14 1 3 0
14 2 0 2
14 3 3 1
2 0 2 0
5 0 1 0
8 3 0 3
2 3 3 1
14 0 0 3
14 3 1 2
14 1 2 0
10 3 2 0
5 0 3 0
5 0 2 0
8 1 0 1
14 2 2 0
5 2 0 2
12 2 1 2
14 2 0 3
3 0 3 0
5 0 3 0
8 0 1 1
2 1 3 0
14 3 3 2
5 2 0 1
12 1 0 1
14 3 1 3
7 3 2 2
5 2 3 2
8 2 0 0
2 0 3 1
14 0 1 0
14 2 2 3
14 0 0 2
10 2 3 0
5 0 3 0
5 0 3 0
8 0 1 1
2 1 3 0
5 0 0 1
12 1 2 1
14 3 0 3
7 3 2 1
5 1 3 1
8 1 0 0
2 0 3 1
5 3 0 0
12 0 3 0
14 1 1 3
5 1 0 2
12 2 3 2
5 3 2 0
5 0 1 0
8 0 1 1
2 1 3 3
14 3 2 1
14 2 1 0
1 0 2 0
5 0 3 0
8 3 0 3
2 3 1 1
14 1 0 0
14 0 1 3
14 2 0 2
2 0 2 0
5 0 1 0
8 0 1 1
2 1 0 0
5 3 0 1
12 1 3 1
11 3 2 2
5 2 1 2
8 2 0 0
14 3 1 2
14 2 0 1
14 2 3 3
15 1 3 2
5 2 1 2
8 2 0 0
2 0 3 3
14 3 3 1
14 2 1 0
5 2 0 2
12 2 2 2
9 1 0 1
5 1 3 1
5 1 1 1
8 3 1 3
2 3 0 2
14 1 3 1
14 1 3 0
14 2 1 3
8 1 0 0
5 0 3 0
8 0 2 2
2 2 2 3
5 3 0 1
12 1 2 1
14 0 0 2
5 3 0 0
12 0 1 0
5 0 2 0
5 0 3 0
8 3 0 3
2 3 1 1
14 2 2 0
14 2 0 3
14 3 3 2
6 0 2 0
5 0 2 0
8 0 1 1
2 1 2 2
14 0 1 3
14 1 1 0
14 3 0 1
12 0 1 3
5 3 3 3
8 2 3 2
2 2 3 3
5 3 0 0
12 0 2 0
14 0 2 2
14 1 1 1
0 1 0 0
5 0 3 0
8 0 3 3
2 3 3 2
14 2 0 0
14 2 0 3
5 2 0 1
12 1 3 1
13 0 1 0
5 0 1 0
5 0 2 0
8 2 0 2
2 2 3 3
14 2 1 2
14 1 1 0
14 2 1 1
2 0 2 1
5 1 3 1
8 1 3 3
5 2 0 2
12 2 3 2
5 3 0 1
12 1 3 1
14 0 2 0
7 1 2 2
5 2 3 2
8 2 3 3
2 3 0 1
14 1 2 3
14 3 0 2
5 3 2 0
5 0 1 0
8 0 1 1
5 0 0 3
12 3 2 3
14 1 1 0
14 1 1 2
0 0 3 0
5 0 3 0
8 0 1 1
2 1 1 2
14 0 2 1
14 2 1 0
3 0 3 0
5 0 2 0
8 2 0 2
2 2 1 0
5 0 0 2
12 2 2 2
14 3 0 1
5 3 0 3
12 3 0 3
15 2 3 2
5 2 2 2
8 2 0 0
2 0 3 2
14 1 2 1
14 2 3 0
14 3 1 3
9 3 0 3
5 3 3 3
8 2 3 2
5 0 0 1
12 1 3 1
14 1 0 3
4 0 3 3
5 3 3 3
5 3 1 3
8 3 2 2
2 2 0 1
14 2 1 3
5 3 0 2
12 2 0 2
14 3 2 0
10 2 3 3
5 3 2 3
8 1 3 1
2 1 2 0
14 1 3 2
5 1 0 3
12 3 0 3
14 0 2 1
14 3 2 2
5 2 1 2
5 2 2 2
8 0 2 0
14 1 3 1
14 0 3 2
5 1 2 1
5 1 2 1
5 1 1 1
8 1 0 0
5 1 0 2
12 2 3 2
14 2 3 1
6 1 2 2
5 2 1 2
8 2 0 0
2 0 2 3
14 1 2 0
14 0 2 2
5 0 2 2
5 2 3 2
8 2 3 3
14 0 3 1
5 2 0 2
12 2 2 2
2 0 2 2
5 2 2 2
8 3 2 3
2 3 0 0
14 2 0 2
14 1 2 1
14 0 2 3
15 2 3 3
5 3 1 3
8 3 0 0
2 0 1 1
14 2 0 3
14 1 3 0
14 1 1 2
0 0 3 2
5 2 2 2
8 2 1 1
2 1 0 3
5 3 0 1
12 1 1 1
14 3 3 2
5 0 2 2
5 2 3 2
8 3 2 3
2 3 2 1
14 0 2 3
5 0 0 0
12 0 2 0
14 3 1 2
6 0 2 3
5 3 3 3
8 3 1 1
2 1 2 3
14 1 3 1
14 2 2 2
0 1 0 0
5 0 1 0
8 0 3 3
14 2 3 0
14 3 2 2
1 0 2 2
5 2 2 2
8 2 3 3
2 3 0 1
14 1 3 2
14 1 0 3
14 1 3 0
8 0 0 3
5 3 1 3
5 3 3 3
8 3 1 1
2 1 3 3
14 3 0 1
14 2 2 2
14 3 2 0
6 2 0 2
5 2 1 2
5 2 3 2
8 2 3 3
2 3 3 1
14 2 3 2
5 2 0 3
12 3 0 3
11 3 2 2
5 2 2 2
8 1 2 1
14 3 0 2
10 3 2 3
5 3 2 3
5 3 3 3
8 3 1 1
2 1 2 3
14 2 2 2
14 3 0 1
6 2 0 0
5 0 1 0
5 0 3 0
8 0 3 3
2 3 2 1
14 2 1 0
14 1 1 3
14 1 2 2
4 0 3 2
5 2 3 2
8 1 2 1
2 1 1 2
14 0 2 3
14 3 2 1
15 0 3 1
5 1 2 1
5 1 2 1
8 1 2 2
14 3 1 0
14 1 3 3
14 0 2 1
12 3 1 3
5 3 2 3
5 3 1 3
8 2 3 2
2 2 1 1
14 0 1 0
14 3 0 3
14 3 3 2
14 2 3 3
5 3 2 3
5 3 3 3
8 3 1 1
14 3 3 3
14 2 1 0
14 0 1 2
14 2 3 3
5 3 2 3
8 1 3 1
2 1 2 3
14 3 3 2
14 3 3 0
14 2 2 1
6 1 0 1
5 1 3 1
8 1 3 3
2 3 2 1
14 3 2 3
14 2 0 2
13 2 0 2
5 2 1 2
8 2 1 1
2 1 2 0
14 1 0 3
14 3 3 1
14 3 3 2
14 2 1 1
5 1 1 1
5 1 2 1
8 0 1 0
2 0 3 3
5 0 0 1
12 1 1 1
14 0 1 2
14 3 0 0
1 2 0 1
5 1 1 1
5 1 2 1
8 3 1 3
2 3 1 1
5 2 0 2
12 2 2 2
14 3 1 3
6 2 0 3
5 3 3 3
5 3 2 3
8 1 3 1
5 3 0 2
12 2 0 2
14 2 1 3
5 2 0 0
12 0 2 0
3 0 3 3
5 3 2 3
8 3 1 1
2 1 2 2
5 1 0 0
12 0 3 0
14 1 1 3
14 3 2 1
12 3 1 1
5 1 2 1
5 1 1 1
8 1 2 2
2 2 1 1
14 2 0 2
5 2 0 3
12 3 0 3
5 0 0 0
12 0 1 0
11 3 2 0
5 0 3 0
8 1 0 1
2 1 1 2
5 3 0 1
12 1 1 1
14 2 0 3
5 2 0 0
12 0 2 0
3 0 3 3
5 3 1 3
5 3 1 3
8 2 3 2
2 2 1 1
14 0 2 0
5 3 0 2
12 2 3 2
14 0 1 3
14 2 3 2
5 2 3 2
8 2 1 1
2 1 2 3
14 2 3 1
14 2 1 0
5 0 0 2
12 2 3 2
6 1 2 0
5 0 2 0
8 3 0 3
2 3 1 1
14 0 0 2
5 0 0 3
12 3 1 3
14 2 3 0
8 3 3 0
5 0 3 0
8 1 0 1
5 0 0 0
12 0 2 0
14 3 2 2
14 2 2 3
3 0 3 2
5 2 2 2
8 2 1 1
14 3 2 2
3 0 3 3
5 3 1 3
5 3 1 3
8 1 3 1
2 1 3 3
14 0 3 2
14 0 0 1
5 0 0 0
12 0 1 0
8 0 0 2
5 2 2 2
8 2 3 3
2 3 0 1
5 3 0 3
12 3 2 3
14 0 0 2
14 2 3 0
10 2 3 0
5 0 3 0
8 0 1 1
14 2 3 2
14 1 2 0
8 0 0 0
5 0 2 0
5 0 3 0
8 0 1 1
2 1 2 3
14 2 3 1
14 1 2 0
8 0 0 0
5 0 3 0
8 0 3 3
2 3 0 1
5 2 0 3
12 3 2 3
14 1 3 0
2 0 2 3
5 3 2 3
8 1 3 1
2 1 0 2
14 2 1 1
14 3 1 3
14 3 3 0
6 1 0 3
5 3 3 3
8 2 3 2
14 0 2 3
14 1 0 0
5 0 0 1
12 1 0 1
14 3 0 0
5 0 2 0
8 0 2 2
2 2 1 0
14 2 0 2
14 1 2 1
11 3 2 1
5 1 3 1
5 1 2 1
8 1 0 0
2 0 0 2
14 1 0 3
14 2 3 0
5 0 0 1
12 1 0 1
4 0 3 3
5 3 2 3
5 3 1 3
8 2 3 2
2 2 3 0
5 0 0 2
12 2 3 2
14 1 3 1
14 1 1 3
14 3 1 3
5 3 2 3
8 3 0 0
2 0 0 2
5 0 0 3
12 3 2 3
14 0 3 1
14 2 2 0
3 0 3 1
5 1 3 1
5 1 3 1
8 2 1 2
5 1 0 1
12 1 2 1
14 3 0 0
9 0 1 3
5 3 1 3
8 2 3 2
2 2 2 1
14 2 3 0
14 2 2 3
14 3 0 2
6 0 2 3
5 3 1 3
5 3 1 3
8 1 3 1
2 1 0 3
14 3 3 0
14 2 2 1
9 0 1 1
5 1 1 1
8 1 3 3
14 1 0 2
14 3 0 1
14 1 0 0
7 1 2 0
5 0 3 0
5 0 2 0
8 3 0 3
5 1 0 0
12 0 3 0
14 1 0 1
7 0 2 2
5 2 1 2
8 3 2 3
2 3 1 2
14 2 3 3
14 1 2 0
0 1 3 1
5 1 2 1
8 2 1 2
2 2 3 1
5 1 0 0
12 0 2 0
14 0 3 2
3 0 3 0
5 0 3 0
5 0 3 0
8 1 0 1
2 1 2 2
14 2 2 0
14 0 3 1
14 0 1 3
14 3 0 0
5 0 2 0
8 0 2 2
2 2 2 3
14 1 3 0
5 1 0 1
12 1 1 1
14 0 2 2
8 1 0 1
5 1 3 1
5 1 1 1
8 1 3 3
2 3 0 0`;

let arr = str.split('\n\n').map(a => a.split("\n").map((b, c) => {
    if (c == 1) {
        return b.split(' ').map(d => parseInt(d));
    } else {
        return b.substr(9,b.length - 1).split(', ').map(d => parseInt(d));
    }
}));

let arr2 = str2.split('\n').map(b => b.split(' ').map(c => parseInt(c)));

log(arr[0]);
let sum = 0;
let opsMatch = {};

for (let i = 0; i < arr.length; i++) {
    let total = 0;
    let matchedOps = [];
    for (let j = 0; j < 16; j++) {
        let val = exece(j, arr[i][1][1], arr[i][1][2], arr[i][1][3], arr[i][0]);
        if (JSON.stringify(val) === JSON.stringify(arr[i][2])) {
            total++;
            matchedOps[j] = true;;
        }
    }
    let ii = arr[i][1][0];
    if (!opsMatch[ii]) {
        opsMatch[ii] = opsMatch[ii] || matchedOps;
    } else {
        for (let j in opsMatch[ii]) {
            if (!matchedOps[j]) {
                delete opsMatch[ii][j];
            }
        }
    }
    if (total >= 3) {
        sum++;
    }
}

let finOps = {};

for (let a = 0; a < 30; a++) {
for (let i in opsMatch) {
    let o = Object.keys(opsMatch[i]);
    if (o.length === 1) {
        finOps[i] = o[0];
        for (let j in opsMatch) {
            if (i !== j) {
                delete opsMatch[j][o[0]];
            }
        }
    }
}
}
log(finOps);

let dat = [0, 0, 0, 0];

for (let i = 0; i < arr2.length; i++) {
    let cmd = arr2[i][0] + '';
    dat = exece(parseInt(finOps[cmd]), arr2[i][1], arr2[i][2], arr2[i][3], dat);
    log(dat);
}
log(dat);


function exece(code, a, b, c, data) {
    data = JSON.parse(JSON.stringify(data));
    switch(code) {
        case 0:
            data[c] = data[a] + data[b];
        break;
        case 1:
            data[c] = data[a] + b;
        break;
        case 2:
        data[c] = data[a] * data[b];
        break;
        case 3:
        data[c] = data[a] * b;

        break;
        case 4:
        data[c] = data[a] & data[b];

        break;
        case 5:
        data[c] = data[a] & b;

        break;
        case 6:
        data[c] = data[a] | data[b];

        break;
        case 7:
        data[c] = data[a] | b;

        break;
        case 8:
        data[c] = data[a];
        break;
        case 9:
        data[c] = a;
        break;
        case 10:
        data[c] = a > data[b] ? 1 : 0;
        break;
        case 11:
        data[c] = data[a] > b ? 1 : 0;
        break;
        case 12:
        data[c] = data[a] > data[b] ? 1 : 0;
        break;
        case 13:
        data[c] = a == data[b] ? 1 : 0;
        break;
        case 14:
        data[c] = data[a] == b ? 1 : 0;
        break;
        case 15:
        data[c] = data[a] == data[b] ? 1 : 0;
        break;

    }
    return data;
}
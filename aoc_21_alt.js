let r0 = 0;
let r1 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;

r3 = r3 & 456
r3 = 0

let map = {};
let end = 0;

while (true) {
    r1 = r3 | 65536 // ------------- 5
    r3 = 14906355;
    while (true) {
        r4 = r1 & 255;  // ----------------- 7
        r3 = r3 + r4;
        r3 = r3 & 16777215;
        r3 = r3 * 65899;
        r3 = r3 & 16777215;
        if (256 > r1) {
            //test end
            console.log(r3);
            if (map[r3]) {
                end = true;
                break;
            }
            map[r3] = true;
            if (r3 == r0) {
                console.log(r3);
                // end
                break;
            }
            //restart
            break;
        }
        r4 = 0
        r4 = Math.floor(r1 / 256);
        r2 = (r4 + 1) * 256;
        r1 = r4;
        /*while (true) {
            r2 = r4 + 1 //--------------- 17
            r2 *= 256
            if (r2 <= r1) {
                r4++
                //jmp 17
            } else {
                r1 = r4
                console.log(r1);
                break;
            }
        }*/
    }
    if (end) {
        break;
    }
}
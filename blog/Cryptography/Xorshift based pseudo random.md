# XorShift based pseudo random

This paper [Xorshift RNGs, July 2003, Marsaglia, George](https://www.jstatsoft.org/v08/i14/paper) was inspired me to create another kind of `Xorshift` based without static initial.

The basic concept is:
- Seeding with a initial value `seed`
- Repeat caculation for every bit of `seed`
- `i` is denoted for bit `i th`
- Read `shift flag` by take less significant bit `RSHIFT(seed, i) AND 1`
- If `shift flag` equal to `0`: `result = result ^ RSHIFT(seed, i)`
- If `shift flag` equal to `1`: `result = result ^ LSHIFT(seed, i)`


## Implementation

### Implement in Python

```python
import random

seed = random.randint(0x55555555, 0xffffffff)


def rnd():
    global seed
    x = 0
    for i in range(32):
        if (seed >> i) & 1:
            x ^= seed >> i
        else:
            x ^= seed << i
    x = 0xffffffff & x
    seed = x
    return x


for i in range(1000):
    print rnd()
```

### Implement in JavaScript:

```js
const crypto = require('crypto');

//Generate seed randomBytes
var seed = crypto.randomBytes(4).readUInt32LE(0);

//XorShift based PRNG
function rnd(){
    var x = 0, i;
    for(i = 0; i < 32; i++){
        //Shift right if [i th] bit is equal to 1, otherwise shift letf
        x ^= ((seed >> i) & 1) ? seed >> i : seed << i;
    }
    return seed = x >>> 0;
}

for(let i = 0; i < 1000; i++){
  process.stdout.write(`${i}\n`)
}
```

### Implement in C

```c
#include <stdio.h>
#include <time.h>

unsigned int seed;

unsigned int rnd(){
    unsigned int x = 0, i;
    for(i = 0; i < 32; i++){
        x ^= ((seed >> i) & 1) ? seed >> i : seed << i;
    }
    return seed = x;
}

int main(){
    time_t tsec;
    int i = 0;
    tsec = time(NULL);
    seed = (unsigned int)tsec;
    for(;i < 1000; i++) printf("%u\n", rnd());
    return 0;
}
```

Test:
```
gcc test.c -o test && chmod a+x test && ./test
```

## Conclusion

- `0x00000000` and other kind of *poor entropy seed* are the worst thing to this **algorithm**
- The result is predictable within disclosed `seed`
- We need some kind of `fallback mode` for *low entropy seed*
- It isn't safe for cryptography purpose
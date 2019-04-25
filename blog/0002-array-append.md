---
title: I++ and I-- which is faster with array operator?
date: Sun Apr 14 10:36:55 +07 2019
categories: Algorithm
tags: algorithm, javascript
---

# I++ and I-- which is faster with array operator?

My friend gave me a link on Youtube [why i-- for loop is faster than i++ with arrays in JavaScript](https://www.youtube.com/watch?v=aUfOeDXE9Rk). The guy who was create this video is some kind of dumb ass. He's not event know how does `Node.JS` or `Javascript` work.


## Let repeat his experiment

I wrote a simple code with `i++` then append `i` in to an `Array`:

```js
let a = [];
let s = Date.now()
for (let i = 0; i < 10000000; i++) {
  a.push(i);
}
console.log('I++ cost:', Date.now() - s, 'μs');
```

Result:
```
I++ cost: 175 μs
```

Let try the same with `i--`:

```js
let b = [];
let c = Date.now()
for (let i = 10000000; i > 0; i--) {
  b.push(i);
}
console.log('I-- cost:', Date.now() - c, 'μs');
```

Result:
```
I-- cost: 175 μs
```

Wow, it's the same, why the hell it happened?.


## Let repeat the dumb ass experiment

```js
let b = [];
let c = Date.now()
for (let i = 10000000; i > 0; i--) {
  b.push(i);
}
console.log('I-- cost:', Date.now() - c, 'μs');

let a = [];
let s = Date.now()
for (let i = 0; i < 10000000; i++) {
  a.push(i);
}
console.log('I++ cost:', Date.now() - s, 'μs');
```

Result:
```
I-- cost: 197 μs
I++ cost: 202 μs
```

The result shown, `I--` quite faster than `I++` when I let it on the top then let do in reverse.

```js
let a = [];
let s = Date.now()
for (let i = 0; i < 10000000; i++) {
  a.push(i);
}
console.log('I++ cost:', Date.now() - s, 'μs');

let b = [];
let c = Date.now()
for (let i = 10000000; i > 0; i--) {
  b.push(i);
}
console.log('I-- cost:', Date.now() - c, 'μs');
```

Result:
```
I++ cost: 195 μs
I-- cost: 205 μs
```

Oh! see, `V8 Engine` have some kind pre-processing for initial code on the top. That's why this dumb ass orbserve and do stupid experiment.
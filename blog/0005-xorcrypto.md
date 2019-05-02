---
title: Onward in XOR cipher
date: Tue Apr 30 21:09:39 +07 2019
categories: Algorithm, Cryptography
tags: cryptography, algorithm, typescript
---

# Onward in XOR cipher

A long time ago, I had readed this article [Unbreakable Cryptography in 5 Minutes](https://blog.xrds.acm.org/2012/08/unbreakable-cryptography-in-5-minutes/). I've realized `XOR Cipher` is secure as long as `key length` equal or greater than `data length`. It's sound stupid where data is fucking big but what if we could generate the key deterministically?.

## Hash function

Hash function is some kind of deterministic algorithm, it's always giving the same result for the same input. And you could repeating hash function on the result of itself  to get new `digest`, it won't repeat by sequence.

## Proposing a method to generate infinity key length

![xorCrypto](assets/content/xor-cipher.png)

## Implementation

- [NPM package](https://www.npmjs.com/package/xorcrypto)
- [Source code](https://github.com/chiro-hiro/xorcrypto)
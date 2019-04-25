---
title: Programming with libpcap
date: Wed Apr 24 22:18:32 +07 2019
categories: Programing
tags: c, pcap
---

# Programming with libpcap

`libpcap` is a good library to capture network traffic, It's fun to programing with `libpcap` you could do some experiment or deal with lower layer of OSI model. I'm go back to programing with `libpcap` in the challenge of capture `TCP traffic`.

## Install development environment

I'm using `Fedora 29` and have no idea about your **Operating System** then some might not work.

```
$ sudo dnf install gcc make cmake libpcap-devel
```

`libpcap-devel` is required, of course.

## Write first program to listing all device

It's some kind of `Hello World!` with `libpcap`.

```c
#include <stdio.h>
#include <pcap.h>

int main()
{
  pcap_if_t *alldevs;
  pcap_if_t *d;
  int i = 0;
  char errbuf[PCAP_ERRBUF_SIZE];

  /* Retrieve the device list from the local machine */
  if (pcap_findalldevs(&alldevs, errbuf) == -1)
  {
    fprintf(stderr, "Error in pcap_findalldevs: %s\n", errbuf);
    return 0;
  }

  /* Print the list */
  for (d = alldevs; d != NULL; d = d->next)
  {
    printf("%d. %s", ++i, d->name);
    if (d->description)
      printf(" (%s)\n", d->description);
    else
      printf(" (No description available)\n");
  }

  if (i == 0)
  {
    printf("\nNo interfaces found! Make sure libPcap is installed.\n");
    return 1;
  }

  /* Free device list */
  pcap_freealldevs(alldevs);
}
```

## Compile and run

It's the same to complie `Hello World!` but you need to add `-lpcap` to link `libpcap` to your program.

```
gcc ./src/list_devices.c -o ./list_devices -lpcap && ./list_devices
```

Result:

```
1. enp3s0 (No description available)
2. lo (No description available)
3. any (Pseudo-device that captures on all interfaces)
4. virbr0 (No description available)
5. bluetooth-monitor (Bluetooth Linux Monitor)
6. nflog (Linux netfilter log (NFLOG) interface)
7. nfqueue (Linux netfilter queue (NFQUEUE) interface)
8. bluetooth0 (Bluetooth adapter number 0)
9. usbmon0 (All USB buses)
10. wlo1 (No description available)
11. usbmon1 (USB bus number 1)
12. usbmon2 (USB bus number 2)
13. virbr0-nic (No description available)
```

[Capture all TCP traffic ](https://fkguru.com/0004-capture-all-tcp-traffic.html).

## Credits

Thank to there guys,

- [Programming with pcap, Tim Carstens](https://www.tcpdump.org/pcap.html)
- [Using libpcap in C](https://www.devdungeon.com/content/using-libpcap-c)
- [Programming with pcap](http://yuba.stanford.edu/~casado/pcap/section3.html)
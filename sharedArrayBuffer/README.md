# Use

- `npm i` on root
- node server.js
- wait 1 minutes (you have to stay on the tab, the )
- the graph represente the delta (ms) between main and worker over the time (ms)

# Note

See setHeaders in server.js  

# Purpose

Timing calcul from shared array buffer (sab), write by the worker, read by the main.

No use of Atomic.

TODO test Atomic.

# Conclusion

## Without Atomics

There is a constant ~10ms delay with a ~5ms delta, it is pretty impressive.

We can make the **particle system** and the **animation bone calculation** with this technique !

## With Atomics

TODO
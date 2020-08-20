# Typescript guidelines

Some biased rules I like at this point of time

## Exported functions: max 2 args, put the rest into an options object

When designing function interfaces, stick to the following rules

- A function that is part of the public API takes 0-2 required arguments, plus (if necessary) an options object (so max
3 total)

- Optional parameters should generally go into the options object

  An optional parameter that's not in an options object might be acceptable if there is only one, and it seems
inconceivable that we would add more optional parameters in the future

- The 'options' argument is the only argument that is a regular 'Object'

  Other arguments can be objects, but they must be distinguishable from a 'plain' Object runtime, by having either:
  - a distinguishing prototype (e.g. Array, Map, Date, class MyThing)
  - a well-known symbol property (e.g. an iterable with Symbol.iterator)

  This allows the API to evolve in a backwards compatible way, even when the position of the options object changes

```ts
// BAD: optional parameters not part of options object. (#2)
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}

// GOOD.
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {},
): IPAddress[] {}
```

```ts
export interface Environment {
  [key: string]: string;
}

// BAD: `env` could be a regular Object and is therefore indistinguishable
// from an options object. (#3)
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// GOOD.
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions,
): string {}
```

```ts
// BAD: more than 3 arguments (#1), multiple optional parameters (#2).
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean,
) {}

// GOOD.
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {},
) {}
```

```ts
// BAD: too many arguments. (#1)
export function pwrite(
  fd: number,
  buffer: TypedArray,
  offset: number,
  length: number,
  position: number,
) {}

// BETTER.
export interface PWrite {
  fd: number;
  buffer: TypedArray;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```

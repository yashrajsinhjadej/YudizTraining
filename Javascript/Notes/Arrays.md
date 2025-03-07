# JavaScript Array Methods Reference

## Array.prototype.at()

**Parameters:**

- `index`: Integer value representing the index of the array element to be returned.

**Returns:**

- The array element at the specified index. Accepts negative integers, which count back from the last item.

**Example:**

```js
const array1 = [5, 12, 8, 130, 44];
let index = 2;
console.log(`An index of ${index} returns ${array1.at(index)}`);
// Expected output: "An index of 2 returns 8"
```

## Array.prototype.concat()

**Parameters:**

- `value1, value2, ...`: Arrays and/or values to concatenate with the calling array.

**Returns:**

- A new array containing the joined elements of the calling array and all arguments.

**Example:**

```js
const array1 = ["a", "b", "c"];
const array2 = ["d", "e", "f"];
const array3 = array1.concat(array2);
console.log(array3);
// Expected output: Array ["a", "b", "c", "d", "e", "f"]
```

## Array.prototype.entries()

**Parameters:**

- None

**Returns:**

- A new array iterator object containing key/value pairs for each index in the array.

**Example:**

```js
const array1 = ["a", "b", "c"];
const iterator = array1.entries();

for (const entry of iterator) {
  console.log(entry);
}
// Expected output: [0, "a"]
// Expected output: [1, "b"]
// Expected output: [2, "c"]
```

## Array.prototype.every()

**Parameters:**

- `callback`: Function to test for each element, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array every was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- `true` if the callback function returns a truthy value for every array element; otherwise, `false`.

**Example:**

```js
const isBelowThreshold = (currentValue) => currentValue < 40;
const array1 = [1, 30, 39, 29, 10, 13];
console.log(array1.every(isBelowThreshold));
// Expected output: true
```

## Array.prototype.fill()

**Parameters:**

- `value`: Value to fill the array with
- `start` (optional): Zero-based index to start filling, defaults to 0
- `end` (optional): Zero-based index to stop filling, defaults to array.length

**Returns:**

- The modified array, filled with the specified value.

**Example:**

```js
const array1 = [1, 2, 3, 4];
console.log(array1.fill(0, 2, 4));
// Expected output: Array [1, 2, 0, 0]
```

## Array.prototype.filter()

**Parameters:**

- `callback`: Function to test each element of the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array filter was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- A new array with elements that pass the test provided by the callback function.

**Example:**

```js
const words = ["spray", "elite", "exuberant", "destruction", "present"];
const result = words.filter((word) => word.length > 6);
console.log(result);
// Expected output: Array ["exuberant", "destruction", "present"]
```

## Array.prototype.find()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array find was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- The first element in the array that satisfies the provided testing function, or `undefined` if none is found.

**Example:**

```js
const array1 = [5, 12, 8, 130, 44];
const found = array1.find((element) => element > 10);
console.log(found);
// Expected output: 12
```

## Array.prototype.findIndex()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array findIndex was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- The index of the first element in the array that satisfies the provided testing function, or `-1` if none is found.

**Example:**

```js
const array1 = [5, 12, 8, 130, 44];
const isLargeNumber = (element) => element > 13;
console.log(array1.findIndex(isLargeNumber));
// Expected output: 3
```

## Array.prototype.findLast()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array findLast was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- The value of the last element in the array that satisfies the provided testing function, or `undefined` if none is found.

**Example:**

```js
const array1 = [5, 12, 50, 130, 44];
const found = array1.findLast((element) => element > 45);
console.log(found);
// Expected output: 130
```

## Array.prototype.findLastIndex()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array findLastIndex was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- The index of the last element in the array that satisfies the provided testing function, or `-1` if none is found.

**Example:**

```js
const array1 = [5, 12, 50, 130, 44];
const isLargeNumber = (element) => element > 45;
console.log(array1.findLastIndex(isLargeNumber));
// Expected output: 3
```

## Array.prototype.flat()

**Parameters:**

- `depth` (optional): The depth level specifying how deep the nested array structure should be flattened. Defaults to 1.

**Returns:**

- A new array with all sub-array elements concatenated into it recursively up to the specified depth.

**Example:**

```js
const arr1 = [0, 1, 2, [3, 4]];
console.log(arr1.flat());
// Expected output: Array [0, 1, 2, 3, 4]
```

## Array.prototype.flatMap()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array flatMap was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- A new array formed by applying the callback function to each element of the array, and then flattening the result by one level.

**Example:**

```js
const arr1 = [1, 2, 1];
const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));
console.log(result);
// Expected output: Array [1, 2, 2, 1]
```

## Array.prototype.forEach()

**Parameters:**

- `callback`: Function to execute on each element, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array forEach was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- `undefined`

**Example:**

```js
const array1 = ["a", "b", "c"];
array1.forEach((element) => console.log(element));
// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
```

## Array.prototype.includes()

**Parameters:**

- `searchElement`: The element to search for
- `fromIndex` (optional): The position in the array at which to begin searching. Defaults to 0.

**Returns:**

- `true` if the array contains the specified element, `false` otherwise.

**Example:**

```js
const array1 = [1, 2, 3];
console.log(array1.includes(2));
// Expected output: true
```

## Array.prototype.indexOf()

**Parameters:**

- `searchElement`: Element to locate in the array
- `fromIndex` (optional): The index to start the search at. Defaults to 0.

**Returns:**

- The first index at which the specified element is found in the array, or -1 if it is not found.

**Example:**

```js
const beasts = ["ant", "bison", "camel", "duck", "bison"];
console.log(beasts.indexOf("bison"));
// Expected output: 1
```

## Array.prototype.join()

**Parameters:**

- `separator` (optional): A string used to separate array elements. Defaults to a comma (",").

**Returns:**

- A string containing all array elements joined with the specified separator.

**Example:**

```js
const elements = ["Fire", "Air", "Water"];
console.log(elements.join());
// Expected output: "Fire,Air,Water"
console.log(elements.join(""));
// Expected output: "FireAirWater"
console.log(elements.join("-"));
// Expected output: "Fire-Air-Water"
```

## Array.prototype.keys()

**Parameters:**

- None

**Returns:**

- A new array iterator object that contains the keys (indices) for each element in the array.

**Example:**

```js
const array1 = ["a", "b", "c"];
const iterator = array1.keys();
for (const key of iterator) {
  console.log(key);
}
// Expected output: 0
// Expected output: 1
// Expected output: 2
```

## Array.prototype.lastIndexOf()

**Parameters:**

- `searchElement`: Element to locate in the array
- `fromIndex` (optional): The index at which to start searching backward. Defaults to the array's length minus 1.

**Returns:**

- The last index at which the specified element is found in the array, or -1 if it is not found.

**Example:**

```js
const animals = ["Dodo", "Tiger", "Penguin", "Dodo"];
console.log(animals.lastIndexOf("Dodo"));
// Expected output: 3
```

## Array.prototype.map()

**Parameters:**

- `callback`: Function that is called for every element of the array, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array map was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- A new array with each element being the result of the callback function.

**Example:**

```js
const array1 = [1, 4, 9, 16];
const map1 = array1.map((x) => x * 2);
console.log(map1);
// Expected output: Array [2, 8, 18, 32]
```

## Array.prototype.pop()

**Parameters:**

- None

**Returns:**

- The removed element from the array; `undefined` if the array is empty.

**Example:**

```js
const plants = ["broccoli", "cauliflower", "cabbage", "kale", "tomato"];
console.log(plants.pop());
// Expected output: "tomato"
```

## Array.prototype.push()

**Parameters:**

- `element1, element2, ...`: The elements to add to the end of the array.

**Returns:**

- The new length of the array.

**Example:**

```js
const animals = ["pigs", "goats", "sheep"];
const count = animals.push("cows");
console.log(count);
// Expected output: 4
```

## Array.prototype.reduce()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking four arguments:
    - `accumulator`: The accumulator accumulates the callback's return values
    - `currentValue`: The current element being processed
    - `currentIndex` (optional): The index of the current element
    - `array` (optional): The array reduce was called upon
- `initialValue` (optional): A value to use as the first argument to the first call of the callback.

**Returns:**

- The value that results from the reduction.

**Example:**

```js
const array1 = [1, 2, 3, 4];
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue
);
console.log(sumWithInitial);
// Expected output: 10
```

## Array.prototype.reduceRight()

**Parameters:**

- `callback`: Function to execute on each element in the array, taking four arguments:
    - `accumulator`: The accumulator accumulates the callback's return values
    - `currentValue`: The current element being processed
    - `currentIndex` (optional): The index of the current element
    - `array` (optional): The array reduceRight was called upon
- `initialValue` (optional): A value to use as the first argument to the first call of the callback.

**Returns:**

- The value that results from the reduction.

**Example:**

```js
const array1 = [[0, 1], [2, 3], [4, 5]];
const result = array1.reduceRight((accumulator, currentValue) =>
  accumulator.concat(currentValue)
);
console.log(result);
// Expected output: Array [4, 5, 2, 3, 0, 1]
```

## Array.prototype.reverse()

**Parameters:**

- None

**Returns:**

- The reversed array. The first array element becomes the last, and the last array element becomes the first.

**Example:**

```js
const array1 = ["one", "two", "three"];
const reversed = array1.reverse();
console.log(reversed);
// Expected output: Array ["three", "two", "one"]
```

## Array.prototype.shift()

**Parameters:**

- None

**Returns:**

- The removed element from the array; `undefined` if the array is empty.

**Example:**

```js
const array1 = [1, 2, 3];
const firstElement = array1.shift();
console.log(array1);
// Expected output: Array [2, 3]
```

## Array.prototype.slice()

**Parameters:**

- `start` (optional): Zero-based index at which to start extraction. Defaults to 0.
- `end` (optional): Zero-based index before which to end extraction. slice extracts up to but not including end. Defaults to the array's length.

**Returns:**

- A new array containing the extracted elements.

**Example:**

```js
const animals = ["ant", "bison", "camel", "duck", "elephant"];
console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]
console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]
```

## Array.prototype.some()

**Parameters:**

- `callback`: Function to test for each element, taking three arguments:
    - `element`: The current element being processed
    - `index` (optional): The index of the current element
    - `array` (optional): The array some was called upon
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:**

- `true` if the callback function returns a truthy value for at least one element in the array; otherwise, `false`.

**Example:**

```js
const array = [1, 2, 3, 4, 5];
const even = (element) => element % 2 === 0;
console.log(array.some(even));
// Expected output: true
```

## Array.prototype.sort()

**Parameters:**

- `compareFn` (optional): Function that defines the sort order. If omitted, the array elements are converted to strings, then sorted according to Unicode code point value.

**Returns:**

- The sorted array. Note that the array is sorted in place.

**Example:**

```js
const months = ["March", "Jan", "Feb", "Dec"];
months.sort();
console.log(months);
// Expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// Expected output: Array [1, 100000, 21, 30, 4]
```

## Array.prototype.splice()

**Parameters:**

- `start`: The index at which to start changing the array
- `deleteCount` (optional): The number of elements to remove. Defaults to all elements from start to the end of the array.
- `item1, item2, ...` (optional): The elements to add to the array, beginning from the start index.

**Returns:**

- An array containing the deleted elements.

**Example:**

```js
const months = ["Jan", "March", "April", "June"];
months.splice(1, 0, "Feb");
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, "May");
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]
```

## Array.prototype.toReversed()

**Parameters:**

- None

**Returns:**

- A new array with the elements in reversed order, without modifying the original array.

**Example:**

```js
const array1 = [1, 2, 3, 4, 5];
console.log(array1.toReversed());
// Expected output: Array [5, 4, 3, 2, 1]
console.log(array1);
// Expected output: Array [1, 2, 3, 4, 5]
```

## Array.prototype.toSorted()

**Parameters:**

- `compareFn` (optional): Function that defines the sort order.

**Returns:**

- A new array with the elements sorted in ascending order, without modifying the original array.

**Example:**

```js
console.log(["a", "c", , "b"].toSorted());
// Expected output: ['a', 'b', 'c', undefined]
console.log([, undefined, "a", "b"].toSorted());
// Expected output: ["a", "b", undefined, undefined]
```

## Array.prototype.toString()

**Parameters:**

- None

**Returns:**

- A string representing the specified array and its elements.

**Example:**

```js
const array1 = [1, 2, 'a', '1a'];
console.log(array1.toString());
// Expected output: "1,2,a,1a"
```

## Array.prototype.unshift()

**Parameters:**

- `element1, element2, ...`: The elements to add to the front of the array.

**Returns:**

- The new length of the array.

**Example:**

```js
const array1 = [1, 2, 3];
console.log(array1.unshift(4, 5));
// Expected output: 5
console.log(array1);
// Expected output: Array [4, 5, 1, 2, 3]
```

## Array.prototype.values()

**Parameters:**

- None

**Returns:**

- A new array iterator object that contains the values for each index in the array.

**Example:**

```js
const array1 = ["a", "b", "c"];
const iterator = array1.values();

for (const value of iterator) {
  console.log(value);
}
// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
```

## Array.prototype.with()

**Parameters:**

- `index`: Zero-based index at which to replace the element
- `value`: The new value to place at the specified index

**Returns:**

- A new array with the element at the given index replaced with the given value, without modifying the original array.

**Example:**

```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.with(2, 6));
// Expected output: [1, 2, 6, 4, 5]
console.log(arr);
// Expected output: [1, 2, 3, 4, 5]
```
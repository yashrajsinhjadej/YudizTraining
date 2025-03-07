# JavaScript Promises

A Promise in JavaScript represents a value that may not be available yet. It's an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

## Basic Promise Syntax

```javascript
const myPromise = new Promise((resolve, reject) => {
  // Asynchronous operation
  if (/* operation successful */) {
    resolve(value); // fulfilled successfully
  } else {
    reject(error); // error, rejected
  }
});
```

## Promise States

A Promise can be in one of three states:

1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: The operation completed successfully
3. **Rejected**: The operation failed

## Example

```javascript
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const data = { id: 1, name: "User" };
    // Simulate successful API call
    resolve(data);
    // Or if there was an error:
    // reject(new Error("Failed to fetch data"));
  }, 2000);
});

// Using the promise
fetchData
  .then(data => console.log("Data received:", data))
  .catch(error => console.error("Error:", error));
```

Promises allow you to write cleaner asynchronous code compared to callbacks, avoiding the "callback hell" problem.

# Promise Methods: then, catch, and finally

## .then()

The `.then()` method is used to handle the successful completion (fulfillment) of a Promise. It takes up to two arguments: callback functions for the fulfilled and rejected cases.

```javascript
myPromise.then(
  (value) => {
    // fulfillment handler
    console.log(value);
  },
  (error) => {
    // rejection handler (optional)
    console.error(error);
  }
);
```

### Chaining

One of the most powerful features of `.then()` is that it returns a Promise, allowing for method chaining:

```javascript
fetchUserData()
  .then(userData => fetchUserPosts(userData.id))
  .then(posts => renderPosts(posts))
  .catch(error => handleError(error));
```

## .catch()

The `.catch()` method is used to handle Promise rejections. It's essentially a shorthand for `.then(null, errorHandler)`.

```javascript
myPromise
  .then(value => console.log(value))
  .catch(error => console.error("Something went wrong:", error));
```

### Error Propagation

In a Promise chain, errors will propagate down until they encounter a `.catch()` handler:

```javascript
fetchData()
  .then(data => processData(data))  // If processData throws, the error skips to .catch()
  .then(processed => displayData(processed))
  .catch(error => handleError(error));  // Catches any error in the chain
```

## .finally()

The `.finally()` method runs code regardless of whether the Promise was fulfilled or rejected:

```javascript
showLoadingIndicator();

fetchData()
  .then(data => displayData(data))
  .catch(error => showError(error))
  .finally(() => {
    hideLoadingIndicator(); // This runs no matter what
  });
```

Key characteristics of `.finally()`:

- It doesn't receive any arguments
- It passes through the result or error to the next handler
- It's great for cleanup operations

# Async/Await

Async/await is syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code.

## The `async` Keyword

When you mark a function with the `async` keyword:

1. It automatically returns a Promise
2. It allows the use of the `await` keyword inside the function

```javascript
async function fetchUserData() {
  // This function returns a Promise automatically
  return { id: 1, name: "John" };
}

// Equivalent to:
function fetchUserData() {
  return Promise.resolve({ id: 1, name: "John" });
}
```

## The `await` Keyword

The `await` keyword can only be used inside an `async` function. It pauses the execution of the function until the Promise resolves, and then returns the resolved value.

```javascript
async function showUserData() {
  try {
    const user = await fetchUserData();  // Pauses until fetchUserData resolves
    const posts = await fetchUserPosts(user.id);  // Pauses again
    
    displayUser(user);
    displayPosts(posts);
  } catch (error) {
    // Handles any errors in either await expression
    showError(error);
  }
}
```

## Benefits of Async/Await

1. **Cleaner code**: Eliminates the need for multiple `.then()` calls
2. **Better error handling**: Can use standard try/catch blocks
3. **Debugging**: Easier to set breakpoints
4. **Conditional logic**: More straightforward with asynchronous operations

## Example: Sequential vs Parallel

### Sequential Execution

```javascript
async function sequential() {
  const result1 = await asyncOperation1();
  const result2 = await asyncOperation2();  // Waits for operation1 to complete
  return [result1, result2];
}
```

### Parallel Execution

```javascript
async function parallel() {
  const promise1 = asyncOperation1();  // Starts immediately
  const promise2 = asyncOperation2();  // Also starts right away
  
  // Wait for both to complete
  const [result1, result2] = await Promise.all([promise1, promise2]);
  return [result1, result2];
}
```

## Error Handling

```javascript
async function fetchWithErrorHandling() {
  try {
    const data = await fetchData();
    return processData(data);
  } catch (error) {
    console.error("Error in async function:", error);
    // You can also rethrow or return a default value
    return defaultData;
  }
}
```


# Promise Static Methods

JavaScript's Promise object offers several static methods that provide useful functionality for working with Promises.

## Promise.all()

Accepts an array of Promises and returns a new Promise that fulfills when all input Promises fulfill (or rejects if any Promise rejects).

```javascript
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(([users, posts, comments]) => {
    // All requests completed successfully
    // Results are in same order as the input promises
  })
  .catch(error => {
    // At least one request failed
    console.error("One or more requests failed:", error);
  });
```

Use cases:

- Loading multiple resources in parallel
- Waiting for multiple independent operations to complete

## Promise.race()

Returns a Promise that fulfills or rejects as soon as one of the input Promises fulfills or rejects.

```javascript
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Request timed out")), 5000);
});

const dataFetch = fetch('/api/data');

Promise.race([dataFetch, timeout])
  .then(response => response.json())
  .catch(error => console.error("Failed:", error));
```

Use cases:

- Implementing timeouts
- Taking the result of the fastest operation

## Promise.allSettled()

Returns a Promise that resolves after all input Promises have settled (either fulfilled or rejected).

```javascript
const promises = [
  fetch('/api/critical'),
  fetch('/api/optional1'),
  fetch('/api/optional2')
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index} fulfilled with value:`, result.value);
      } else {
        console.log(`Promise ${index} rejected with reason:`, result.reason);
      }
    });
  });
```

Use cases:

- When you need to know the outcome of each Promise regardless of success/failure
- Collecting multiple operations where some can fail without aborting the process

## Promise.any()

Returns a Promise that fulfills as soon as any of the input Promises fulfills. If all Promises reject, it rejects with an AggregateError.

```javascript
const mirrors = [
  fetch('https://mirror1.example.com/data'),
  fetch('https://mirror2.example.com/data'),
  fetch('https://mirror3.example.com/data')
];

Promise.any(mirrors)
  .then(response => response.json())
  .then(data => console.log("Data from fastest mirror:", data))
  .catch(error => {
    console.error("All mirrors failed:", error);
    // error is an AggregateError containing all rejection reasons
  });
```

Use cases:

- Fetching from multiple redundant sources
- Using the first available resource

## Promise.resolve() and Promise.reject()

Create Promises that are immediately fulfilled or rejected:

```javascript
// Create a Promise that immediately resolves with the value 42
const resolved = Promise.resolve(42);

// Create a Promise that immediately rejects with an error
const rejected = Promise.reject(new Error("Something went wrong"));
```

Use cases:

- Converting values to Promises
- Creating precomputed results
- Testing Promise-based code
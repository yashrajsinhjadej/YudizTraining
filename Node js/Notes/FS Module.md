 # Node.js File System (fs) Module Methods

This document provides an overview of key methods in Node.js's File System (fs) module, their usage, and best practices.

## Synchronous vs Asynchronous

Every method in the fs module has synchronous as well as asynchronous versions. Asynchronous methods take the `last parameter` as the completion `function callback` and the `first parameter of the callback function as error`.

For example, the synchronous method for writing data in a file is:
```javascript
fs.writeFileSync(file, data[, options])
```

On the other hand, its asynchronous version has the following syntax:
```javascript
fs.writeFile(file, data[, options], callback)
```

The asynchronous methods are non-blocking in nature compared to the synchronous methods.

Example of asynchronous file reading with promises:
```javascript
const fs = require("fs");

let file = "./test.js";

let promise = new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data);
    });
});

promise.then((data) => {
    console.log(data.toString());
}).catch((err) => {
    console.error("Error reading file:", err);
});
```

## Reading Files

### fs.readFile(path, [options], callback)
- **Purpose**: Asynchronously reads a file's entire contents
- **Usage**:
  ```javascript
  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```
- **Note**: Non-blocking operation, suitable for most use cases

### fs.readFileSync(path, [options])
- **Purpose**: Synchronously reads a file's entire contents
- **Usage**:
  ```javascript
  try {
    const data = fs.readFileSync('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  ```
- **Note**: Blocks the Node.js event loop until completed

## Writing Files

### fs.writeFile(path, data, [options], callback)
- **Purpose**: Asynchronously writes data to a file, replacing the file if it exists
- **Usage**:
  ```javascript
  fs.writeFile('file.txt', 'Hello World!', 'utf8', (err) => {
    if (err) throw err;
    console.log('File saved!');
  });
  ```

### fs.writeFileSync(path, data, [options])
- **Purpose**: Synchronously writes data to a file
- **Usage**:
  ```javascript
  try {
    fs.writeFileSync('file.txt', 'Hello World!', 'utf8');
    console.log('File saved!');
  } catch (err) {
    console.error(err);
  }
  ```

### fs.appendFile(path, data, [options], callback)
- **Purpose**: Asynchronously appends data to a file
- **Usage**:
  ```javascript
  fs.appendFile('file.txt', 'More content', 'utf8', (err) => {
    if (err) throw err;
    console.log('Data appended!');
  });
  ```

## Checking File/Directory Existence
### fs.stat(path, callback)
- **Purpose**: Gets file/directory information
- **Usage**:
  ```javascript
  fs.stat('path/to/check', (err, stats) => {
    if (err) {
      console.log('Path does not exist');
      return;
    }
    
    if (stats.isDirectory()) {
      console.log('It is a directory');
    } else if (stats.isFile()) {
      console.log('It is a file');
    }
    
    console.log('File size:', stats.size, 'bytes');
    console.log('Last modified:', stats.mtime);
  });
  ```

## Low-Level File Operations

### fs.open(path, flags, [mode], callback)
- **Purpose**: Opens a file and returns a file descriptor
- **Flags**:
  - `'r'`: Read (default)
  - `'w'`: Write (create/truncate)
  - `'a'`: Append (create if needed)
  - `'r+'`: Read and write
  - `'w+'`: Read and write (create/truncate)
  - `'a+'`: Read and append (create if needed)
- **Usage**:
  ```javascript
  fs.open('example.txt', 'r', (err, fd) => {
    if (err) throw err;
    console.log('File opened with descriptor:', fd);
    
    // Always close when done
    fs.close(fd, (err) => {
      if (err) throw err;
      console.log('File closed');
    });
  });
  ```

### fs.close(fd, callback)
- **Purpose**: Closes a file descriptor
- **Importance**:
  - Releases system resources
  - Prevents file locks
  - Ensures data is written to disk
  - Prevents memory leaks
- **Usage**: See example in `fs.open()`

### fs.read(fd, buffer, offset, length, position, callback)
- **Purpose**: Reads data from a file using a file descriptor
- **Usage**:
  ```javascript
  fs.open('example.txt', 'r', (err, fd) => {
    if (err) throw err;
    
    const buffer = Buffer.alloc(1024);
    
    fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, buffer) => {
      if (err) throw err;
      console.log(buffer.slice(0, bytesRead).toString());
      
      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });
  });
  ```

### fs.write(fd, buffer, offset, length, position, callback)
- **Purpose**: Writes data to a file using a file descriptor
- **Usage**:
  ```javascript
  fs.open('output.txt', 'w', (err, fd) => {
    if (err) throw err;
    
    const buffer = Buffer.from('Hello, world!');
    
    fs.write(fd, buffer, 0, buffer.length, null, (err, bytesWritten, buffer) => {
      if (err) throw err;
      console.log(`Wrote ${bytesWritten} bytes to file`);
      
      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });
  });
  ```

## Directory Operations

### fs.mkdir(path, [options], callback)
- **Purpose**: Creates a new directory
- **Usage**:
  ```javascript
  fs.mkdir('new-directory', (err) => {
    if (err) throw err;
    console.log('Directory created!');
  });
  
  // Creating nested directories
  fs.mkdir('parent/child/grandchild', { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Nested directories created!');
  });
  ```
- **Options**: Can create recursive directories with `{ recursive: true }`

### fs.readdir(path, [options], callback)
- **Purpose**: Reads directory contents
- **Usage**:
  ```javascript
  fs.readdir('directory', (err, files) => {
    if (err) throw err;
    files.forEach(file => console.log(file));
  });
  
  // With options to get file types
  fs.readdir('directory', { withFileTypes: true }, (err, dirents) => {
    if (err) throw err;
    dirents.forEach(dirent => {
      console.log(`${dirent.name}: ${dirent.isFile() ? 'File' : 'Directory'}`);
    });
  });
  ```

## File/Directory Management

### fs.rename(oldPath, newPath, callback)
- **Purpose**: Renames a file or directory
- **Usage**:
  ```javascript
  fs.rename('old.txt', 'new.txt', (err) => {
    if (err) throw err;
    console.log('Renamed!');
  });
  ```

### fs.unlink(path, callback)
- **Purpose**: Deletes a file
- **Usage**:
  ```javascript
  fs.unlink('file.txt', (err) => {
    if (err) throw err;
    console.log('File deleted!');
  });
  ```
### fs.rmdir(path, callback)
- **Purpose**: Deletes a folder or directory 
- **Usage**:
```
fs.rmdir('./file',(err)=>{
if(err){console.log(err)}
else{console.log('delted')}
})
```

## Best Practices

1. **Use asynchronous methods** for better performance in production applications
2. **Always handle errors** properly with try/catch or error callbacks
3. **Close file descriptors** when finished to prevent resource leaks
4. **Prefer promise-based API** for cleaner, more maintainable code
5. **Use `fs.access()` instead of `fs.exists()`** to check file existence
6. **Consider using the `graceful-fs` package** for additional error handling in high-volume file operations
7. **Use the `fs/promises` module** for modern Node.js applications
8. **Handle file paths correctly** using `path.join()` or `path.resolve()` for cross-platform compatibility
9. **Implement proper error recovery** for critical file operations
10. **Be careful with synchronous methods** in server applications as they block the event loop

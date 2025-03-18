## process.config

- **Purpose**: Contains the JavaScript representation of the configure options used to compile the current Node.js executable
- **Examples**:

```javascript
process.config
/* Returns configuration object with properties like:
{
  target_defaults: { cflags: [], default_configuration: 'Release', ... },
  variables: { node_prefix: '/usr/local', ... }
}
*/
```

## process.argv

- **Purpose**: Returns an array containing the command line arguments
- **Examples**:

```javascript
process.argv
/* For 'node script.js arg1 arg2', returns:
[
  '/usr/local/bin/node',    // Node.js executable path
  '/path/to/script.js',     // Script file path
  'arg1',                   // First argument
  'arg2'                    // Second argument
]
*/
```

## process.cwd()

- **Purpose**: Returns the current working directory of the Node.js process
- **Examples**:

```javascript
process.cwd()   // '/Users/username/projects/myapp'
```

## process.env

- **Purpose**: Returns an object containing the user environment variables
- **Examples**:

```javascript
process.env
/* Returns:
{
  HOME: '/Users/username',
  PATH: '/usr/local/bin:/usr/bin:/bin',
  NODE_ENV: 'development',
  ...
}
*/
process.env.NODE_ENV   // 'development'
```

## process.versions

- **Purpose**: Returns an object listing the version strings of Node.js and its dependencies
- **Examples**:

```javascript
process.versions
/* Returns:
{
  node: '16.13.0',
  v8: '9.4.146.24-node.14',
  uv: '1.42.0',
  zlib: '1.2.11',
  ...
}
*/
```
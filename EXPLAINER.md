
# Directory Upload

## Abstract

The Google Chrome team proposed and implemented a sandboxed file
system API, defining a new storage type available to script,
partitioned by origin. This API included types for creating, reading
and writing files, as well as enumerating directories and accessing
the files contained therein. The same directory enumeration types were
made available to script when files and directories were dragged onto
a page via the input element and Data Transfer mechanisms defined in
[HTML](html.spec.whatwg.org/multipage).

While the sandboxed file system API proposal has not been adopted by
other browser vendors and is not widely used, the subset of the API
supporting "directory upload" scenarios has been identified that other
browser vendors may implement. This specification attempts to document
the subset to allow the creation of interoperable implementations.

## Previous Work

The
[File API: Directories and System](https://www.w3.org/TR/file-system-api/)
specification (which is now a W3C Working Group Note) described the
behavior of the sandboxed filesystem behavior in Chrome and the
directory enumeration behavior methods and types at a high level. The
most recent
[Editors Draft](https://dev.w3.org/2009/dap/file-system/file-dir-sys.html)
of the specification contains the full text of the proposal.


The
[Directory Upload](https://wicg.github.io/directory-upload/proposal.html)
proposal specifies a way to allow directory upload via HTML input
elements, and methods and types for enumerating directory contents,
but is not based on the behavior implemented in Google Chrome.

## Goals

The goal of this document is to specify the existing behavior of
Google Chrome necessary to create an interoperable implementation
supporting script access to the contents of directories made available
to the page by user actions such as form selection and drag-and-drop
operations.

Where possible, this document will attempt to describe the behavior of
the implemented API in a forward-looking, content-compatible manner.
For example, previous descriptions used obsolete
[Web IDL](heycam.github.io/webidl/) constructs such as __T[]__ to
describe iterable collections of typed objects; the similar
syntax __sequence&lt;T&gt;__ and __FrozenArray&lt;T&gt;__ will be used
which may not have identical semantics but which are believed to be
compatible with deployed content.

It is _not_ a goal of this document to modify the described API in
content-incompatible ways or improve the usability of the API; for
example the script API contains several methods that accept success
and error callback pairs. Newer web standards use the
[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)
Promise type. This document does not propose changes to the methods to
drop the callbacks and instead return Promises.

Finally, it is also very explicitly _not_ a goal of this document to
preclude further exploration of this area with APIs by other
specifications that may improve the usability of this functionality.
[Directory Upload](https://wicg.github.io/directory-upload/proposal.html)
is an example of work that is soliciting feedback from browser
implementors and web developers and may produce a more usable API.

## Code Samples

### Handle Drag-and-Drop
```js
elem.addEventListener('drop', e => {
  e.preventDefault();
  for (let item of e.dataTransfer.items) {
    if (item.kind === 'file') {
      let entry = item.webkitGetAsEntry();
      handleEntry(entry);
    }
  }
});
```

### Inspect an Entry
```js
function handleEntry(entry) {
  console.log('name: ' + entry.name);
  console.log('path: ' + entry.fullPath);
  if (entry.isFile) {
    console.log('... is a file');
  } else if (entry.isDirectory) {
    console.log('... is a directory');
  }
}
```

### Enumerate a Directory Entry
```js
let reader = dirEntry.createReader();
let readBatch = function() {
    reader.readEntries(entries => {
      if (entries.length === 0) {
        return;
      }
      entries.forEach(handleEntry);
      readBatch();
    }, error => console.warn(error));
  };
readBatch();
```

## Other Tutorials

* [Drag and drop a folder onto Chrome now available](https://developers.google.com/web/updates/2012/07/Drag-and-drop-a-folder-onto-Chrome-now-available)
  by Eiji Kitamura
* [Exploring the FileSystem APIs](http://www.html5rocks.com/en/tutorials/file/filesystem/)
  by Eric Bidelman

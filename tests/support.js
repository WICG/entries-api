// ----------------------------------------
// Test Utilities
// ----------------------------------------

setup({explicit_timeout: true});

const tests = [];
const elem = document.getElementById('drop');
elem.addEventListener('dragover', e => {
  e.preventDefault();
});
elem.addEventListener('drop', e => {
  e.preventDefault();
  const entry = e.dataTransfer.items[0].webkitGetAsEntry();
  window.entry = entry;
  elem.parentElement.removeChild(elem);

  tests.forEach(f => f(entry));
});


// Registers a test to be run when an entry is dropped. Calls |func|
// with (test, entry); |func| and must call `test.done()` when complete.
function entry_test(func, description) {
  const test = async_test(description);
  tests.push(test.step_func(arg => func(test, arg)));
}
function run_tests(arg) {
}

// Registers a test to be run when an entry is dropped. Digs the named
// |file| out of the dropped entry and calls |func| with
// (test, file_entry); |func| must call `test.done()` when complete.
function file_entry_test(name, func, description) {
  return entry_test((t, entry) => {
    entry.getFile(
      name, {},
      t.step_func(entry => func(t, entry)),
      t.unreached_func('getFile should not fail'));
  }, description);
}


// ----------------------------------------
// Paths
// ----------------------------------------

const INVALID_PATHS = [
  '\x00', 'a-\x00-b',
  '\x0B', 'a-\x0B-b',
];
const EMPTY_PATHS = ['', null, undefined];
const NOT_FOUND_PATHS = ['nope', '/upload/nope', './nope', 'subdir/../nope'];

const DIR_PATHS = [
  'subdir',
  '/upload/subdir',
  './subdir',
  'subdir/.',
  'subdir/../subdir',
  'subdir/./../subdir',
  'subdir/../subdir/.',
  '//upload/subdir',
  '/upload//subdir',
  './/subdir',
  'subdir//.',
];
const FILE_PATHS = [
  'file.txt',
  '/upload/file.txt',
  'subdir/../file.txt',
  '//upload/file.txt',
  '/upload//file.txt',
  'subdir/./../file.txt',
];

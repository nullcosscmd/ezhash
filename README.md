# ezhash

ezhash is a replacement for the sha256sum command on linux, and could be a much simpler way to get a file's hash on windows

## Usage

Simply type `ezhash (file directory)` to get the file's hash.
If you want to copy the hash to your clipboard, add `-c` before `ezhash`.
If you want to compare two hashes, add `-d` before `ezhash`, then add the hash you want to compare with, then add the file directory.

### Examples

`ezhash index.js`
`ezhash -c index.js`
`ezhash -d e878a68f8f60a21d0bc1527c5c7ffdb5dd5ace06cd045fa9ceb279aed4d8e684 index.js`

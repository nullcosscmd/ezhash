# neohash

neohash is a replacement for the `sha256sum` command, and is also a simpler way to compare file hashes.

## Usage

Simply type `neohash (file directory)` to get the file's hash.
If you want to copy the hash to your clipboard, add `-c` before `neohash`.
If you want to compare two hashes, add `-d` before `neohash`, then add the hash you want to compare with, then add the file directory.

### Examples

`neohash index.js`
`neohash -c index.js`
`neohash -d e878a68f8f60a21d0bc1527c5c7ffdb5dd5ace06cd045fa9ceb279aed4d8e684 index.js`

this library sucks
# base91-js   
[basE91](https://base91.sourceforge.net/) encoding in JavaScript. Ported from the base91 PHP code.   

## Usage
## Browser
Include this script tag in your `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/base91-js@1.0.8/dist/base91.min.js"></script>
```
## Node
```js
const {
    encode,
    decode,
    create
} = require("base91-js");
/*
or
const base91 = require("base91-js");
*/
```
### To encode:
```javascript
const textToEncode = "Hello 👋. 这是一些中文文本. А вот и русский текст."
const encoded = base91.encode(textToEncode);
console.log(encoded);
```
### To decode:
```javascript
const textToDecode = ">OwJh>&\"zkMICB;`TkMK)9C+cLmp_Zv=k2k`F[fVYUifCB2k/t7fj/^xtLg4FE+k4YER7tKFf#+4FE9gIY)F`#n;`od56[C"
const decoded = base91.decode(textToDecode);
console.log(decoded);
```
### Chunked encoding   
Note: Chunked encoding uses typed arrays, not strings, so you'll need to use a `TextEncoder` if you want to use strings.
```javascript
const encoder = new TextEncoder();
const base91_encoder = base91.create();
const view1 = encoder.encode("Hello, ");
const view2 = encoder.encode("world");

base91_encoder.update(view1);
base91_encoder.update(view2);
const result = base91_encoder.finalize();
```

# Credits   
Joachim Henke - basE91 library and source code author

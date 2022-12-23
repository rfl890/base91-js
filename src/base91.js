(function () {
    const encodingChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';

    function base91_encode(input) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        const length = bytes.length;
        let result = "";
        let n = 0;
        let b = 0;
        for (let i = 0; i < length; i++) {
            b |= bytes[i] << n;
            n += 8;
            if (n > 13) {
                let v = b & 8191;
                if (v > 88) {
                    b >>= 13;
                    n -= 13;
                } else {
                    v = b & 16383;
                    b >>= 14;
                    n -= 14;
                }
                result +=
                    encodingChars.charAt(v % 91) +
                    encodingChars.charAt((v / 91) | 0);
            }
        }
        if (n) {
            result += encodingChars.charAt(b % 91);
            if (n > 7 || b > 90) {
                result += encodingChars.charAt((b / 91) | 0);
            }
        }
        return result;
    }
    function base91_decode(input) {
        const length = input.length;
        const decoder = new TextDecoder();
        let result = [];
        let b = 0;
        let n = 0;
        let v = -1;
        for (let i = 0; i < length; i++) {
            const c = encodingChars.indexOf(input[i]);
            if (c === -1) continue;
            if (v < 0) {
                v = c;
            } else {
                v += c * 91;
                b |= v << n;
                n += (v & 8191) > 88 ? 13 : 14;
                do {
                    result.push(b & 0xff);
                    b >>= 8;
                    n -= 8;
                } while (n > 7);
                v = -1;
            }
        }
        if (v > -1) {
            result.push((b | (v << n)) & 0xff);
        }
        const view = new Uint8Array(result);
        const decoded = decoder.decode(view);
        return decoded;
    }

    function base91_createEncode() {
        const decoder = new TextDecoder();
        let b = 0;
        let n = 0;
        let result = "";
        return {
            update: function (chunk) {
                for (let i = 0; i < chunk.length; i++) {
                    b |= chunk[i] << n;
                    n += 8;
                    if (n > 13) {
                        let v = b & 8191;
                        if (v > 88) {
                            b >>= 13;
                            n -= 13;
                        } else {
                            v = b & 16383;
                            b >>= 14;
                            n -= 14;
                        }
                        result +=
                            encodingChars.charAt(v % 91) +
                            encodingChars.charAt((v / 91) | 0);
                    }
                }
            },
            finalize: function () {
                if (!this.finalized) {
                    if (n) {
                        result += encodingChars.charAt(b % 91);
                        if (n > 7 || b > 90) {
                            result += encodingChars.charAt((b / 91) | 0);
                        }
                    }
                    this.finalized = true;
                    return result;
                } else {
                    return result;
                }
            },
            finalized: false,
        };
    }
    if (typeof module !== "undefined" && module.exports) {
        // CommonJS
        module.exports = {
            encode: base91_encode,
            decode: base91_decode,
            create: base91_createEncode,
        };
        return;
    } else if (typeof window !== "undefined") {
        // Script tag
        window.base91 = {
            encode: base91_encode,
            decode: base91_decode,
            create: base91_createEncode,
        };
        return;
    }
})();

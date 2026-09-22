---
title: How Kruti Dev to Unicode conversion works: reph and matra reordering
published: true
description: A deep dive into the computer science behind converting legacy Remington Hindi fonts (Kruti Dev, Devlys) to Unicode Devanagari without mangling reph, matras, and conjuncts.
tags: javascript, webdev, unicode, opensource
canonical_url: https://toolsoftools.com/font-converters/krutidev-to-unicode/
cover_image: https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1000&auto=format&fit=crop&q=80
---

If you have ever dealt with Indian government databases, High Court judgments, municipal land records, or state recruitment exams, you have likely encountered text that looks like this:

```text
Hkkjr ,d egku ns'k gSA ;gk¡ fofo/krk esa ,drk gSA
```

To an untrained eye, it looks like a corrupted password hash or someone fell asleep on a QWERTY keyboard. But if you install a 30-year-old TrueType font called **Kruti Dev 010**, that exact line suddenly renders as:

> **भारत एक महान देश है। यहाँ विविधता में एकता है।**

Tens of millions of official documents across India are still typed and stored in this format today. Yet, when developers try to convert this text into modern Unicode (`UTF-8`) for web apps or search engines, **almost every script on GitHub fails on complex words**.

Words like `धर्म` (duty) turn into `ध्र्ाम`, `किताब` (book) turns into `कताबि`, and `शर्मा` (Sharma) turns into `र्शमा`.

In this article, we’ll unpack the fascinating history of why Kruti Dev works this way and look under the hood at the exact topological algorithm needed to solve **Reph** and **Matra** reordering in JavaScript/TypeScript.

---

## 1. The 1990s Hack: ASCII Fonts vs. Unicode

To understand why conversion is notoriously tricky, we have to look back at Windows 95.

In the mid-1990s, standard computers had no native support for the complex OpenType shaping engines required by Devanagari. Standard Western computers only understood 8-bit ASCII characters (`0x20` to `0x7E`).

Meanwhile, typists across government secretariats and newspaper publishing houses had spent decades training on mechanical **Remington Hindi typewriters**.

To bring Hindi typing to PC word processors (like PageMaker and MS Word 6.0), font creators pulled off an ingenious hack:

> **They kept the 8-bit ASCII character table, but redrew the glyph outlines inside the TrueType font file as Devanagari shapes.**

- Key `d` was redrawn as **क**
- Key `r` was redrawn as **त**
- Key `e` was redrawn as **म**
- Key `k` was redrawn as the long-a vowel sign **ा**

When a typist typed `d`, the computer stored ASCII `100` (`0x64`). As long as the document had the *Kruti Dev* font selected, it rendered on screen as **क**. But copy-pasting that text into Chrome, WhatsApp, or a modern database produces the raw ASCII letter: `d`.

### Visual Order vs. Phonetic Logical Order

Unicode Devanagari (`U+0900–U+097F`) stores characters **phonetically in logical reading order**:

$$\text{Consonant} + \text{Virama} + \text{Consonant} + \text{Matra}$$

Kruti Dev, however, stores characters in **visual printing order**—the exact sequence mechanical typewriter hammers struck paper.

And that difference is where all naive converters break.

---

## 2. Problem #1: The Pre-base Vowel (Chhoti Ee `ि`)

In Devanagari script, the short vowel *Chhoti Ee* (`ि`, `U+093F`) is visually rendered on the **left** of the consonant it modifies, even though phonetically it is pronounced **after** the consonant.

When typing the syllable **कि** (*ki*):
1. **Phonetic order (Unicode)**: Consonant first, then vowel.
   $$\text{क } (\texttt{U+0915}) + \text{ि } (\texttt{U+093F}) \implies \text{कि}$$
2. **Typewriter order (Kruti Dev)**: The left-hanging arc must be struck on paper *before* striking the letter body.
   $$\texttt{f (ि)} + \texttt{d (क)} \implies \texttt{fd}$$

### Why naive regexes fail catastrophically

A common shortcut you’ll find in older JavaScript converters looks like this:

```typescript
// ❌ BROKEN NAIVE IMPLEMENTATION
function reorderMatra(text: string) {
  // Try to find 'f' and move it after the Devanagari character(s)
  return text.replace(/f([\u0900-\u097F]+)/g, '$1\u093f');
}
```

Notice the quantifier: `[\u0900-\u097F]+`. It is **greedy**.

Let's trace what happens with the word **किताब** (book), which in Kruti Dev is typed as `fdrkc`:
- `d` $\to$ क
- `r` $\to$ त
- `k` $\to$ ा
- `c` $\to$ ब

After the character mapping pass, the string in memory is:
```text
fकताब
```

Now the naive regex runs. Because `[\u0900-\u097F]+` matches *every consecutive Devanagari character*, it doesn't just match `क`—it swallows the whole word `कताब`!

It moves `ि` to the very end of the word:
$$\texttt{fकताब} \implies \text{कताबि } \text{❌}$$

Instead of **किताब** (*kitab*), your user gets **कताबि** (*katabi*)!

### The Solution: Scoped Consonant Cluster Lookahead

To reorder correctly, our regex must match **only the immediate consonant cluster** (optional half-consonants joined by halants, followed by exactly one full consonant):

```typescript
// ✅ MATHEMATICALLY ACCURATE CLUSTER REORDERING
const chotiEeRegex = /f((?:[\u0915-\u0939\u0958-\u095F]\u093c?\u094d)*[\u0915-\u0939\u0958-\u095F]\u093c?)/g;
text = text.replace(chotiEeRegex, '$1\u093f');
```

When this runs on `fकताब`:
- The cluster match stops immediately after `क`.
- The string transforms into `क` + `ि` + `ताब` = **किताब** ✅.
- Even conjunct clusters like `क्यि` (`fD;`) cleanly resolve to `क्` + `य` + `ि` = **क्यि** ✅.

---

## 3. Problem #2: The Post-base Reph (`र्`)

*Reph* is the superscript `र्` that sits on top of a consonant, such as the `र्म` in **धर्म** (*dharma*).

In typewriter mechanics:
1. The typist strikes the base consonant **म** (`e`).
2. Then they strike the Reph key **Z** to print the top hook.
3. So `र्म` is typed as `eZ`.
4. And **धर्म** is typed as `/k` (ध) + `e` (म) + `Z` = `/keZ`.

In Unicode:
- Reph is represented by `\u0930\u094D` (**र + virama ्**).
- Critically, in Unicode memory, **Reph is stored BEFORE the consonant cluster**:
  $$\text{ध } (\texttt{U+0927}) + \text{र् } (\texttt{U+0930\u094D}) + \text{म } (\texttt{U+092E}) \implies \text{धर्म}$$

### Why naive Reph reordering fails

In legacy code, developers often try to move `Z` before the word using:
```javascript
// ❌ NAIVE REPH SWAP
text = text.replace(/([a-zA-Z]+)Z/g, 'Z$1');
```

Look at what happens to `/keZ` (**धर्म**):
- The regex sees `ke` before `Z`.
- It moves `Z` before `k`, giving `/Zke`.
- During mapping, `/` cannot find its partner `k` because `Z` is in the middle!
- `/` maps to `ध्`.
- `k` maps to `ा`.
- `Z` maps to `र्`.
- Output: **ध्र्ाम** ❌.

A sacred word of philosophy was turned into complete gibberish!

### The Solution: Scoped Preceding Consonant Cluster

In Kruti Dev typing, Reph `Z` belongs **exclusively to the consonant cluster immediately preceding it**, not the entire word!

We define what constitutes a valid Kruti Dev consonant cluster:
```typescript
// 1. Full consonants (both 2-key and 1-key)
const kdConsonants = '(?:(?:\\[k|\\?k|\\.k|Fk|\\/k|Hk|\'k|"k)|[dxptVBM<runeic;jyolgK={])';

// 2. Half-consonants (D = क्, R = त्, etc.)
const kdHalfConsonants = '[D\\[X?TRF/UICE\'"LYO]';

// 3. Match only the immediate cluster preceding Z:
const rephRegex = new RegExp(`(${kdHalfConsonants}*${kdConsonants}[qw\`]?)Z`, 'g');
text = text.replace(rephRegex, 'Z$1');
```

Now let's trace `/keZ` with this scoped lookbehind:
1. Before `Z` is `e` (म).
2. The regex matches only `e`. It stops before `/k` (ध).
3. The string becomes `/k` + `Ze`.
4. Mapping runs: `/k` $\to$ `ध`, `Z` $\to$ `र्`, `e` $\to$ `म`.
5. Result: **धर्म** ✅.

---

## 4. The Nightmare Case: Simultaneous Reph + Matra

What happens when a word contains **both** a Reph and an AA-matra on the same letter, such as **शर्मा** (*Sharma*)?

In Kruti Dev, typists type:
```text
'k (श)  +  e (म)  +  Z (reph)  +  k (ा matra)  =  'keZk
```

Notice the order: the typist struck `Z` **between** the consonant `e` and the matra `k`!

If your converter doesn't account for this exact typing sequence:
1. `Z` gets pushed before `श`, producing **र्शमा** ❌.
2. Or the matra detaches from the consonant and produces an orphaned `ा`.

With our two-pass topological pipeline:
1. **Pass 1 (Scoped Reph Lookahead)**: Matches only `e` before `Z`, turning `'keZk` into `'kZek`.
2. **Pass 2 (Greedy Mapping)**:
   - `'k` $\to$ `श`
   - `Z` $\to$ `र्`
   - `e` $\to$ `म`
   - `k` $\to$ `ा`
3. **Pass 3 (Matra Normalization)**: Ensures no virama/matra inversion artifacts remain (`\u093f\u094d` $\to$ `\u094d\u093f`).
4. **Final Output**: **शर्मा** ✅.

---

## 5. Reverse Conversion: Why Unicode $\to$ Kruti Dev is Harder

Converting from Unicode back to Kruti Dev is essential for legal stenographers who must submit files to legacy government portals.

In reverse conversion, you encounter **prefix collision**:
- The conjunct **क्ष** in Unicode is 3 codepoints: `क` (`\u0915`) + `्` (`\u094D`) + `ष` (`\u0937`).
- In Kruti Dev, it is represented by a single key: `{`.
- If you replace single consonants (`क` $\to$ `d`) before replacing conjuncts, **क्ष** gets obliterated into `d~"k`!

To guarantee greedy, prefix-safe replacement, the reverse mapping dictionary must be dynamically sorted by **Unicode string length in descending order**:

```typescript
const reverseMap = [...KRUTI_TO_UNICODE_MAP].sort(
  (a, b) => b[1].length - a[1].length
);

for (const [kd, uni] of reverseMap) {
  if (text.includes(uni)) {
    text = text.replaceAll(uni, kd);
  }
}
```

---

## 6. Open Sourcing `krutidev-converter`

To save fellow developers from spending weeks reverse-engineering 1990s font encodings, we have packaged this engine as a lightweight, zero-dependency, dual ESM/CommonJS npm library:

```bash
npm install krutidev-converter
```

### Quick Usage

```typescript
import {
  krutiDevToUnicode,
  unicodeToKrutiDev,
  devlysToUnicode,
  chanakyaToUnicode
} from 'krutidev-converter';

// Converts Kruti Dev 010, 011, 016, 055, 060
const hindi = krutiDevToUnicode("/keZ vkSj deZ");
console.log(hindi); // "धर्म और कर्म"

// Reverse round-trip
console.log(unicodeToKrutiDev("शर्मा")); // "'keZk"

// Devlys 010 (used in Rajasthan & UP Steno exams)
console.log(devlysToUnicode("fdrkc")); // "किताब"

// Chanakya (used in newspaper publishing)
console.log(chanakyaToUnicode("{ks=")); // "क्षेत्र"
```

### Benchmarks
- **Zero dependencies**.
- Pre-compiled regex cache.
- Converts a 100-page court petition (250,000 characters) in **under 15 milliseconds** in modern V8.

---

## Try the Interactive Tools Online

If you just need to convert text or want to test edge cases interactively in your browser:
- 🔗 [Live Kruti Dev to Unicode Converter on ToolsOfTools](https://toolsoftools.com/font-converters/krutidev-to-unicode/)
- 🔗 [Unicode to Kruti Dev Converter](https://toolsoftools.com/font-converters/unicode-to-krutidev/)
- 🔗 [Kruti Dev to Mangal Converter](https://toolsoftools.com/font-converters/krutidev-to-mangal/)
- 🔗 [Interactive Kruti Dev On-Screen Keyboard & Downloadable PDF Chart](https://toolsoftools.com/font-converters/kruti-dev-keyboard/)

Have you ever had to support legacy character encodings in your stack? Let me know in the comments below!

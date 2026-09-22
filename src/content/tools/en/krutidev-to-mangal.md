---
title: "Krutidev to Mangal: Convert Kruti Dev to Mangal Font"
description: "Convert krutidev to mangal online instantly. Free kruti dev to mangal tool turns legacy text into Unicode Hindi with accurate matras, copy, and export."
h1: "Krutidev to Mangal Converter"
intro: "A Krutidev to Mangal converter transforms legacy Kruti Dev 010 Remington keystrokes into Mangal Unicode Devanagari text. It reorders pre-base chhoti ee matras (ि), fixes reph (र्), and maps conjuncts, creating clean Hindi script that displays across Word, web pages, and mobile phones without installing fonts."
primaryKeyword: "krutidev to mangal"
formula: "Kruti Dev 010 (Legacy ASCII Encoding) → Mangal / Unicode Devanagari (UTF-8, U+0900–U+097F)"
example: "Typing 'Hkkjr ,d egku ns'k gSA' in Kruti Dev converts to 'भारत एक महान देश है।' in Mangal Unicode — modern Hindi text that displays natively on every device."
faq:
  - q: "How do I convert Krutidev to Mangal font online?"
    a: "Paste your legacy Kruti Dev 010 text into the left input panel. The tool converts each Remington keystroke sequence into standard Mangal Unicode Devanagari instantly. Once converted, click 'Copy Converted' to paste into Microsoft Word or Google Docs, or click 'Download' to save as a UTF-8 text file."
  - q: "What is the difference between Kruti Dev and Mangal font?"
    a: "Kruti Dev 010 is a legacy non-Unicode font that maps English ASCII letters to Devanagari shapes. Mangal is an official Microsoft Unicode font conforming to UTF-8 standards. When you convert kruti to mangal, the text becomes genuine Unicode Devanagari that renders identically on mobile phones, tablets, web pages, and search engines without installing special fonts."
  - q: "Why does my converted Mangal text show question marks or broken characters?"
    a: "This happens when input text is already in Unicode or when non-standard font variants (like Kruti Dev 011 or 016) are used. Ensure your source consists of genuine Kruti Dev 010 ASCII keystrokes. Also ensure your word processor is displaying the text with a Unicode Devanagari font like Mangal, Nirmala UI, or Aparajita."
  - q: "Why is kurtidev10 to mangal conversion required for government e-filing?"
    a: "Decades of state notifications, court records, and official circulars were drafted in Kruti Dev (often searched as kurtidev10 to mangal). Modern Indian e-Governance portals, NIC websites, and High Court databases now mandate searchable Unicode text. Converting legacy Kruti Dev documents to Mangal makes them fully searchable and archivable."
  - q: "How do I apply the Mangal font in Microsoft Word after converting?"
    a: "Copy the output from this converter and paste it into Microsoft Word. Select the text and choose 'Mangal' from the font dropdown list. Because the converted text is true Unicode, it will also display correctly under other Hindi fonts such as Kokila, Utsaah, or Arial Unicode MS."
  - q: "Does kruti dev to mangal conversion handle complex conjuncts like क्ष and त्र?"
    a: "Yes. The converter features dedicated rules for complex conjunct shortcuts: '{' converts to क्ष, '=' translates to त्र, 'K' maps to ज्ञ, and the apostrophe-j combination transforms into श्र. It also properly positions halants for half-consonants like क्, थ्, and ध्."
sources:
  - label: "Unicode Consortium: Devanagari Code Chart (U+0900–U+097F)"
    url: "https://www.unicode.org/charts/PDF/U0900.pdf"
  - label: "Microsoft Typography: Mangal Font Documentation"
    url: "https://learn.microsoft.com/en-us/typography/font-list/mangal"
updated: "2026-09-21"
related:
  - "mangal-to-krutidev"
  - "krutidev-to-unicode"
  - "kruti-dev-keyboard"
  - "unicode-to-krutidev"
  - "devlys-to-unicode"
  - "unicode-to-non-unicode"
disclaimer: "none"
---

> **Direct Answer (AI Overview):** A **Krutidev to Mangal converter** translates legacy Kruti Dev 010 Remington typewriter keystrokes into standardized Mangal Unicode Devanagari script. It fixes pre-base short-i matras (ि), relocates reph (र्) before consonant clusters, and decodes half-letters so legacy Hindi files display natively in Word, web browsers, mobile apps, and government e-filing systems without font dependencies.

## Understanding Kruti Dev and Mangal Font

For decades, typists throughout government departments, steno schools, and publishing houses in India used **Kruti Dev 010** (frequently searched as *kruti dev*, *kurtidev*, or *kurtidev10*). Kruti Dev relied on a clever workaround: it mapped standard ASCII keyboard keys to Hindi glyphs. When viewed with the font installed, typing `d` looked like `क`, and typing `j` looked like `र`.

However, the underlying data remained standard Latin English letters. If a user without the Kruti Dev font installed opened the document, or if someone tried to email or publish that content online, the text turned into unreadable English gibberish (`Hkkjr` instead of `भारत`).

**Mangal font**, developed by Microsoft and included by default on all Windows systems, represents the modern era of **Unicode Devanagari**. When you convert **krutidev to mangal**, you are converting proprietary keystroke sequences into standardized international Unicode (UTF-8). The resulting text is universally searchable by Google, readable on Android and iOS smartphones, and fully compliant with government e-governance standards.

---

### Key Technical Transformations in Kruti to Mangal Conversion

A reliable **kruti dev to mangal** converter must perform several context-sensitive character reorderings:

#### 1. Chhoti Ee ki Matra (ि) Placement
On a Remington keyboard, typists type `f` *before* the letter:
* Typing `f` + `d` yields `fd` (rendered as `कि` in Kruti Dev).
* In Unicode, the vowel sign is appended *after* the consonant: `क` (U+0915) + `ि` (U+093F).
* The converter scans for `f`, identifies the succeeding consonant, and places the matra in its proper phonetic sequence.

| Kruti Dev Keystrokes | Mangal / Unicode Result | Phonetic Representation |
|---|---|---|
| `fd` | कि | Ka + short-i matra |
| `fu` | नि | Na + short-i matra |
| `fl` | सि | Sa + short-i matra |
| `fD;` | क्यि | Half-Ka + Ya + short-i matra |

#### 2. Reph Reordering (`Z` → र्)
In Kruti Dev, the reph key `Z` is pressed *after* the base letter:
* `e` + `Z` = `eZ` (visual: `र्म`).
* In Mangal Unicode, reph is written as `र` + `्` (virama) *before* the consonant: `र` + `्` + `म` = `र्म`.
* The conversion algorithm identifies `Z`, traverses back to the preceding consonant cluster, and inserts the Unicode reph sequence.

| Kruti Dev Input | Mangal Output | Phonetic Structure |
|---|---|---|
| `eZ` | र्म | Reph over Ma |
| `eZk` | र्मा | Reph over Ma + Aa matra |
| `deZ` | कर्म | Ka + Reph over Ma |
| `/keZ` | धर्म | Dha + Reph over Ma |

#### 3. Half-Letters and Halant Forms
Kruti Dev utilizes dedicated uppercase keystrokes for half-consonants:

| Kruti Dev Key | Mangal Character | Meaning |
|---|---|---|
| `D` | क् | Half Ka |
| `U` | न् | Half Na |
| `R` | त् | Half Ta |
| `F` | थ् | Half Tha |
| `/` | ध् | Half Dha |
| `L` | स् | Half Sa |
| `E` | म् | Half Ma |
| `H` | भ् | Half Bha |

---

### Worked Examples: Krutidev to Mangal

#### Example 1: Standard Sentence
* **Kruti Dev Input:** `Hkkjr ,d egku ns'k gSA`
* **Mangal Output:** `भारत एक महान देश है।`
* **Step-by-step:** `Hk` maps to भ, `k` to ा, `j` to र, `r` to त. The danda full stop `A` converts to `।`.

#### Example 2: Reph and Philosophical Terms
* **Kruti Dev Input:** `deZ gh /eZ gSA`
* **Mangal Output:** `कर्म ही धर्म है।`
* **Step-by-step:** The trailing `Z` in `deZ` and `/eZ` is identified and converted to a leading reph above `म`.

#### Example 3: Complex Conjuncts and Vowels
* **Kruti Dev Input:** `Kku dk {ks= = dk foLrkj`
* **Mangal Output:** `ज्ञान का क्षेत्र त्र का विस्तार`
* **Step-by-step:** `K` converts to the conjunct `ज्ञ`, `{` becomes `क्ष`, `=` produces `त्र`, and `foLrkj` applies short-i matra reversal to form `विस्तार`.

---

### Keyboard Reference: Kruti Dev 010 → Mangal / Unicode

| Kruti Dev Key | Mangal Unicode Character | Letter / Sound |
|---|---|---|
| `d` | क | Ka |
| `[k` | ख | Kha |
| `x` | ग | Ga |
| `?k` | घ | Gha |
| `p` | च | Cha |
| `N` | छ | Chha |
| `t` | ज | Ja |
| `r` | त | Ta |
| `Fk` | थ | Tha |
| `n` | द | Da |
| `/k` | ध | Dha |
| `u` | न | Na |
| `i` | प | Pa |
| `c` | ब | Ba |
| `Hk` | भ | Bha |
| `e` | म | Ma |
| `;` | य | Ya |
| `j` | र | Ra |
| `y` | ल | La |
| `o` | व | Va |
| `'k` | श | Sha |
| `l` | स | Sa |
| `g` | ह | Ha |
| `k` | ा | Aa ki Matra |
| `f` + consonant | ि | Chhoti Ee ki Matra |
| `h` | ी | Badi Ee ki Matra |
| `q` | ु | Chhota U ki Matra |
| `w` | ू | Bada U ki Matra |
| `s` | े | E ki Matra |
| `S` | ै | Ai ki Matra |
| `ks` | ो | O ki Matra |
| `kS` | ौ | Au ki Matra |
| `a` | ं | Anusvara |
| `%` | ः | Visarga |
| `~` | ् | Virama / Halant |
| `Z` | र् | Reph (trailing key) |
| `A` | । | Danda (Full Stop) |
| `{` | क्ष | Ksha Conjunct |
| `=` | त्र | Tra Conjunct |
| `K` | ज्ञ | Jña / Gya Conjunct |

---

## Why Is My Output Gibberish? — Troubleshooting Guide

If your conversion produces unexpected characters or broken Devanagari, review the common scenarios below:

1. **Input Is Already Unicode Hindi:**  
   If you paste text that is already in Mangal or Unicode Hindi (such as `भारत`), the tool attempts to interpret those Devanagari characters as Kruti Dev ASCII keystrokes, resulting in corrupted output. Use our [Mangal to Krutidev](/font-converters/mangal-to-krutidev/) converter if you need to reverse modern text into Kruti Dev keystrokes.

2. **Font Mismatch in Microsoft Word:**  
   When copying text into Word, Word may display boxes or empty rectangles if the active font does not support Devanagari. Highlight the pasted text and select **Mangal**, **Nirmala UI**, or **Aparajita** from your font list.

3. **Kruti Dev 011, 016, or 020 Variants:**  
   While Kruti Dev 010 is the universal standard in government exams, specialized regional steno shops occasionally used modified variants like 011 or 016. Certain special keys in these variants differ from standard 010.

4. **Missing or Extra 'Z' Keystrokes:**  
   If reph (र्) does not appear over a letter, verify that the source document contained the letter `Z`. In some legacy scanning workflows, OCR software confuses `Z` with numeral `2` or uppercase `S`.

---

### Practical Applications of Kruti Dev to Mangal

* **Government and Legal Portals:** Uploading petitions to High Court e-filing systems or state treasury portals that reject non-Unicode files.
* **Publishing and DTP:** Migrating legacy PageMaker archives into modern InDesign, WordPress, or web layouts.
* **Archival and Searchability:** Making decades of government gazettes and Hindi literature searchable across digital search engines.

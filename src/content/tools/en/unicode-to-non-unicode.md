---
title: "Unicode to Non Unicode: Convert Hindi to Legacy Font"
description: "Convert unicode to non unicode Hindi font free. Choose Kruti Dev, Devlys, or Chanakya output. Instant conversion for government forms and legacy DTP systems."
h1: "Unicode to Non-Unicode Converter"
intro: "A Unicode to Non-Unicode converter transforms modern UTF-8 Devanagari Hindi into legacy ASCII-encoded fonts. Choose Kruti Dev 010, Devlys, or Chanakya, paste your text, and produce output formatted for older government portals, judicial archives, and print publishing layouts."
primaryKeyword: "unicode to non unicode"
formula: "Unicode Devanagari (UTF-8) → Legacy Font (Kruti Dev 010 / Devlys 010 / Chanakya ASCII encoding)"
example: "Pasting 'भारत एक महान देश है।' with Kruti Dev selected produces 'Hkkjr ,d egku ns\\'k gSA'—the exact encoding expected by legacy government portals."
faq:
  - q: "What does 'non-Unicode' mean in the context of Hindi fonts?"
    a: "In Indian government and DTP contexts, 'non-Unicode' refers to legacy ASCII-encoded Hindi fonts like Kruti Dev, Devlys, Chanakya, Mangal (pre-Unicode), and similar. These fonts store Hindi by repurposing ASCII codes (A–Z, symbols) as Devanagari glyph positions. They are called 'non-Unicode' to distinguish them from modern UTF-8/UTF-16 Devanagari, which assigns permanent universal codepoints to each character."
  - q: "Which non-Unicode Hindi font should I choose—Kruti Dev, Devlys, or Chanakya?"
    a: "Choose Kruti Dev 010 if you are submitting to a central government portal, SSC/UPSC online system, or any form that specifies 'Kruti Dev'. Choose Devlys if you are submitting to Rajasthan, MP, or UP state government portals that require Devlys encoding. Choose Chanakya if the target system or DTP template was built for Indian newspaper publishing with the Chanakya font."
  - q: "Is unicode to non unicode conversion reversible?"
    a: "Yes—for all characters within the target font's character set, the conversion is lossless and fully reversible. You can use the corresponding forward converter (e.g., Kruti Dev to Unicode, Devlys to Unicode, or Chanakya to Unicode) to convert back. Characters not supported in the legacy font (rare Devanagari extensions, Vedic marks) will not round-trip cleanly."
  - q: "Why do some Hindi government forms still require non-Unicode encoding?"
    a: "Many Indian government IT systems were built in the 1990s–2000s when Unicode Hindi input was not standardised on Windows. The ISDOC and early e-governance portals stored data as font-encoded ASCII text in Kruti Dev or Devlys because that's what the keyboards and form-filling software produced. Migrating these databases to Unicode requires significant redevelopment effort that many state governments have not yet completed."
  - q: "Can I convert a full Word document from Unicode to non-Unicode?"
    a: "For plain-text content: copy your Unicode Hindi text from Word, paste it here, convert, then paste the output back into a legacy-compatible document and apply the appropriate legacy font. For maintaining Word formatting (bold, italics, tables), you will need to convert paragraph by paragraph. Direct .docx conversion is not supported—the converter handles raw text only."
  - q: "How is this page different from unicode-to-krutidev?"
    a: "The unicode-to-krutidev page converts to Kruti Dev 010 only. This page adds a target font selector (Kruti Dev / Devlys / Chanakya), making it the single destination for people who search the generic term 'unicode to non unicode' without knowing which specific legacy font their system uses. If you already know you need Kruti Dev, go directly to that dedicated page."
sources:
  - label: "Unicode Consortium: Devanagari Code Chart (U+0900–U+097F)"
    url: "https://www.unicode.org/charts/PDF/U0900.pdf"
  - label: "TDIL: Technology Development for Indian Languages"
    url: "https://tdil-dc.in/"
updated: "2026-09-22"
related:
  - "unicode-to-krutidev"
  - "kruti-dev-keyboard"
  - "krutidev-to-unicode"
  - "unicode-to-devlys"
  - "unicode-to-chanakya"
  - "devlys-to-unicode"
disclaimer: "none"
---

> **Direct Answer (AI Overview):** A **Unicode to non-Unicode converter** takes modern UTF-8 Devanagari Hindi and re-encodes it as a legacy ASCII-based font like Kruti Dev, Devlys, or Chanakya. Select the target font that matches your government portal or DTP system, paste your Unicode text, and get immediately usable non-Unicode output with correct reph, matra, and halant positioning.

## What Does "Non-Unicode" Mean in Hindi Computing?

When Indian government websites or court e-filing systems say "type in non-Unicode Hindi," they mean text encoded in a **legacy ASCII-mapped Devanagari font**. The three most common:

| Font | Primary Users | Common Names Searched |
|---|---|---|
| **Kruti Dev 010** | Central govt, SSC, UPSC, CPCT | non-unicode hindi, kruti dev |
| **Devlys 010** | Rajasthan, MP, UP state govt | devlys, dev-lys |
| **Chanakya** | Hindi newspapers, PageMaker | chanakya, modular infotech |

All three store Devanagari as standard ASCII characters. Without the matching font installed, the text appears as English letters and symbols—hence the name "non-Unicode."

---

## How to Use This Converter

1. **Select your target font** using the font selector bar above the converter (Kruti Dev / Devlys / Chanakya)
2. **Paste** your Unicode Devanagari Hindi text in the left panel
3. **Copy** or **Download** the non-Unicode output from the right panel
4. **Apply the font** in your target application (Microsoft Word, government form, DTP software)

The conversion is instant and runs entirely in your browser—no data is uploaded.

---

## Worked Examples

### Example 1 — Same text, three different non-Unicode outputs

**Unicode input:** `भारत एक महान देश है।`

| Target Font | Non-Unicode Output |
|---|---|
| **Kruti Dev 010** | `Hkkjr ,d egku ns'k gSA` |
| **Devlys 010** | `Hkkjr ,d egku ns'k gSA` |
| **Chanakya** | `Hkkjr ,d egku ns'k gSA` |

> Note: For common consonants and matras, Kruti Dev and Devlys produce identical output. Differences appear in specific punctuation, some extended characters, and the त्र/half-न encoding.

### Example 2 — त्र Conjunct Differences

**Unicode input:** `त्राण`

| Target Font | Non-Unicode Output | Note |
|---|---|---|
| **Kruti Dev 010** | `=k.k` | Uses `=` for त्र |
| **Devlys 010** | `=k.k` | Same as Kruti Dev for this conjunct |
| **Chanakya** | `\k.k` | Uses `\` (backslash) |

This is where choosing the wrong target font causes problems.

### Example 3 — Chhoti Ee and Reph

**Unicode input:** `हिन्दी कर्म`

| Target Font | Non-Unicode Output |
|---|---|
| **Kruti Dev 010** | `fgUnh deZ` |
| **Devlys 010** | `fgUnh deZ` |
| **Chanakya** | `fgnUnh deZ` |

Chanakya uses `n` for half-न, while Kruti Dev and Devlys use `U`.

---

## Quick Keyboard Reference: Key Differences Between Fonts

| Character | Kruti Dev 010 | Devlys 010 | Chanakya |
|---|---|---|---|
| त्र | `=` | `=` | `\` |
| न (full) | `u` | `u` | `U` |
| न् (half) | `U` | `U` | `n` |
| क्ष | `{` | `{` | `{` |
| ज्ञ | `K` | `K` | `K` |
| ि (pre-base) | `f` | `f` | `f` |
| रेफ (Z) | `Z` | `Z` | `Z` |
| ा | `k` | `k` | `k` |
| ी | `h` | `h` | `h` |
| ू | `w` | `w` | `w` |

For all other consonants and matras, the three fonts use identical key assignments.

---

## Why Is My Non-Unicode Output Not Displaying Correctly?

**1. Wrong font applied in the target application**
After pasting the non-Unicode output, you must apply the exact matching legacy font (e.g., "Kruti Dev 010" for Kruti Dev output). Applying the wrong font (e.g., Devlys to Kruti Dev output) will produce incorrect glyphs for the handful of differing characters.

**2. Target system expects a specific encoding page**
Some legacy Windows applications use ANSI code pages (like Windows-1252) and may misinterpret characters like `Å` (ऊ in Kruti Dev) or `¡` (chandrabindu). Ensure your clipboard encoding matches the target application's expected ANSI page.

**3. Unicode text contains characters outside the font's charset**
Rare Devanagari characters (Vedic extensions, ॲ, ऽ, etc.) do not exist in these legacy fonts. They will either be dropped or produce unexpected ASCII characters in the output.

**4. Source text was normalised differently**
Unicode allows multiple representations of the same character (NFC vs NFD, composed vs decomposed). If your Unicode text was produced by OCR or a system that uses decomposed forms, normalise to NFC before converting.

---

## FAQs

**Q: How do I know which non-Unicode font my government portal requires?**
A: Check the portal's "system requirements" or "font download" page. Most portals that require non-Unicode font specify it explicitly (e.g., "Please download and install Kruti Dev 010 before filling the form"). For Rajasthan portals, Devlys is the usual choice.

**Q: Can I use this to convert Hindi Wikipedia text to Kruti Dev?**
A: Yes. Wikipedia Hindi is Unicode Devanagari. Copy any Wikipedia text, paste here, select Kruti Dev, and convert.

**Q: Does this converter handle Marathi Unicode to non-Unicode?**
A: The converter supports Marathi Unicode Devanagari (which shares the same U+0900–U+097F block). However, Kruti Dev and Devlys were primarily designed for Hindi; Marathi-specific conjuncts may not all map correctly.

**Q: Can I download the converted output as a file?**
A: Yes. Use the "Download" button in the output panel to save the non-Unicode text as a .txt file.

**Q: Is there a faster way to identify which legacy font a document uses?**
A: Open the document in Word and check the font name applied to the Hindi text. The font name will identify the encoding (e.g., "Kruti Dev 010", "DevLys 010", "Chanakya").

**Q: Does this tool convert English words within Hindi text?**
A: English (Latin) words pass through unchanged. The converter only modifies Unicode Devanagari sequences, leaving any Latin characters as-is in the output.

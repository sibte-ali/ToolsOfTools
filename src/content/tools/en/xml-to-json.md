---
title: "XML to JSON Converter Online – Free Tool"
description: "Convert XML to JSON online instantly. Handles nested elements, repeated tags (arrays), and text nodes. Pretty-printed JSON output with copy and download."
h1: "XML to JSON Converter"
intro: "Convert XML documents to JSON format instantly in your browser. Handles nested elements, repeated child tags (converted to arrays), and custom indent styles."
primaryKeyword: "xml to json"
formula: "DOMParser → recursive node traversal → JSON.stringify"
example: "<person><name>Alice</name><age>30</age></person> converts to {\"person\":{\"name\":\"Alice\",\"age\":30}}"
faq:
  - q: "How are repeated XML elements handled?"
    a: "When the same tag name appears more than once under a parent element, all instances are grouped into a JSON array. For example, multiple <item> tags become an array under the 'item' key."
  - q: "What happens to XML attributes?"
    a: "This converter focuses on element content and child elements. XML attributes are not currently included in the JSON output. Use the element-based approach for maximum compatibility."
  - q: "Are numeric and boolean values detected?"
    a: "Yes. Text content that parses as a valid number (e.g. '30') is converted to a JSON number. 'true' and 'false' text content is converted to JSON booleans."
  - q: "Is the conversion reversible (XML → JSON → XML)?"
    a: "Mostly yes for simple structures. Complex XML with attributes, mixed content, or XML namespaces may not round-trip perfectly, as these features have no direct JSON equivalent."
sources:
  - label: "W3C DOM Level 2 – DOMParser"
    url: "https://www.w3.org/TR/DOM-Level-2-Core/"
  - label: "IETF RFC 8259 – JSON"
    url: "https://www.rfc-editor.org/rfc/rfc8259"
updated: "2026-03-19"
related:
  - "json-to-xml"
  - "json-beautifier"
  - "json-formatter"
  - "json-to-excel"
disclaimer: "none"
---

## XML to JSON Conversion Rules

This converter applies the following standard rules when translating XML to JSON:

| XML Feature | JSON Representation |
|---|---|
| Element with text | `"tagName": "textValue"` |
| Nested element | `"tagName": { ... }` |
| Repeated same-name elements | `"tagName": [ ... ]` (array) |
| Empty element `<tag/>` | `"tagName": null` |
| Numeric text content | JSON number (e.g., `30`) |
| Boolean text content | JSON boolean (`true` / `false`) |

The root XML element becomes the top-level key in the output JSON object. The entire output is valid, standards-compliant JSON ready for consumption by any programming language.

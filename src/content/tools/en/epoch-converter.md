---
title: "Epoch Converter - Unix Timestamp to Human Date & Time"
description: "Convert Unix epoch timestamps (seconds and milliseconds) to human-readable dates in UTC and your local time zone. Includes batch conversion and cheat sheet."
h1: "Epoch & Unix Timestamp Converter"
intro: "Convert Unix timestamps to human-readable dates and formats in UTC, ISO 8601, and your local timezone. Works with seconds, milliseconds, microseconds, and nanoseconds."
primaryKeyword: "epoch converter"
formula: "Date = new Date(timestamp × 1000)  |  Epoch = Math.floor(Date.now() / 1000)"
example: "Epoch timestamp 1700000000 converts to Tuesday, November 14, 2023 10:13:20 PM UTC (or 2023-11-14T22:13:20Z)."
faq:
  - q: "What is Unix Epoch time?"
    a: "Unix epoch time (or POSIX time) is the number of seconds that have elapsed since 00:00:00 UTC on Thursday, 1 January 1970, not counting leap seconds."
  - q: "How do I know if my timestamp is in seconds or milliseconds?"
    a: "Standard 10-digit integers (e.g. 1700000000) represent seconds. Standard 13-digit integers (e.g. 1700000000000) represent milliseconds (used by JavaScript `Date.now()`). 16-digit timestamps represent microseconds, and 19-digit timestamps represent nanoseconds."
  - q: "What is the Year 2038 problem (Y2038)?"
    a: "On January 19, 2038 at 03:14:07 UTC, 32-bit signed integers will overflow from 2,147,483,647 to -2,147,483,648, wrapping back to the year 1901. Modern 64-bit systems are immune and safe for billions of years."
  - q: "How do I get the current epoch timestamp in programming languages?"
    a: "In JavaScript: `Math.floor(Date.now() / 1000)`. In Python: `import time; int(time.time())`. In PHP: `time()`. In SQL: `UNIX_TIMESTAMP()`."
sources:
  - label: "Source reference 1"
    url: "IEEE POSIX Standard (IEEE Std 1003.1) - General Concepts: Epoch"
  - label: "Source reference 2"
    url: "IETF RFC 3339 - Date and Time on the Internet: Timestamps"
updated: "2026-03-19"
related:
  - "date-difference-calculator"
  - "hours-calculator"
  - "day-counter"
  - "json-formatter"
disclaimer: "none"
---

## Understanding Unix Timestamps and the Epoch

The **Unix epoch** is the universal reference point used across operating systems, distributed databases, cloud APIs, and programming runtimes to measure time independently of geographical time zones and daylight saving time (DST) shifts.

### Seconds vs. Milliseconds vs. Microseconds

When debugging API payloads or database records, identifying the unit of measurement is the most common hurdle:

| Unit | Number of Digits | Example | Common Runtime / Use Case |
|---|---|---|---|
| **Seconds** | 10 digits | `1742400000` | Linux CLI, Unix kernel, Redis, JWT expiry |
| **Milliseconds** | 13 digits | `1742400000000` | JavaScript, Java, MongoDB `ISODate` |
| **Microseconds** | 16 digits | `1742400000000000` | Python `datetime`, Cassandra, PostgreSQL |
| **Nanoseconds** | 19 digits | `1742400000000000000` | Go `time.Now().UnixNano()`, InfluxDB |

### Common Conversion Snippets
- **JavaScript / Node.js:**
  ```js
  // Current epoch seconds
  const sec = Math.floor(Date.now() / 1000);
  // Epoch to Date
  const date = new Date(1742400000 * 1000);
  ```
- **Python 3:**
  ```python
  import time
  from datetime import datetime, timezone
  # Epoch to UTC string
  utc_time = datetime.fromtimestamp(1742400000, tz=timezone.utc)
  ```
- **PostgreSQL:**
  ```sql
  SELECT TO_TIMESTAMP(1742400000);
  ```

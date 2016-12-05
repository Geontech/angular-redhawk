# Contributing

Contributions are always welcome.  This guide will become more detailed as is necessarily prudent.  For now, the generalities to follow when contributing to this library are:

1. Please do not push commented code (a.k.a., _Hot Code_ in some circles).  This is code that if uncommented could potentially work.  Code in comments for the sake of example are encouraged as a form of documentation.
2. If in your travels you find _Hot Code_, please remove it with an independent commit message such as _Removed commented code_ just in case we need to find it later (i.e., it was scaffolding for a future feature that got paused but accidentally pushed).
3. Always run `npm run lint` before submitting merge requests (this runs TSLint).  Fix any issues that arise, bearing in mind it does not lint Angular code (i.e., decorations like `@Comment`).
4. If necessary, use specific TSLint rule _disable_ comments for that line (preferably).  Use of this option must be justifiable beyond subjective arguments.
5. Use of JSDoc comments is appreciated.  
6. If you have designed a large feature, please provide Markdown-formatted document explaining it.

It should go without saying, but we will anyway, that we are expecting the contribution to be tested already (i.e., it was able to transpile and run for that feature).

Thanks for your contribution!

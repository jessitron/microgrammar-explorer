Microgrammar Explorer
=====================

Goal: help people write microgrammars to parse code (and other text).

This project displays, interactively, the tree parsed from various code by Atomist's [microgrammar](https://github.com/atomist/microgrammar) library.

clone, then 'npm install' and 'npm run start' -- it should tell you what port to hit.

# What is microgrammar?

Microgrammars define a way to parse chunks of text into structured values -- and then let you update those values in place.

Unlike other parsing grammars, you don't need to define the structure of all of the text. Just whatever portion you're interested in.

Unlike regular expressions, microgrammars compose. They aim to be readable, to resemble the text you're
parsing as much as possible.

Unlike both, microgrammars are created in code. They're defined in TypeScript and can include arbitrary functions.

Unlike both, microgrammars let you do in-place updates of partially-parsed files.

# Example

Say I want to find links in markdown files, particularly ones of the form `[link text](link destination)`

Here is some sample input text:

```markdown
# Markdown looks like this

Here is a bunch of text. It [includes](https://atomist.com) some [links](https://twitter.com/atomist).
And some other stuff.
```

I don't care about any of the other things in the file, just those links. I can write a microgrammar phrase that resembles them:

```
[${linkText}](${linkDestination})
```

This looks like what we want to parse (something in square braces followed by something in round braces). It has
all the same fixed characters as the text but
it substitutes a variable name, enclosed in `${}`, for each chunk that varies.

This microgrammar yields a value structure containing an object for each link, each with fields named after the
variables in the microgrammar phrase, populated with the text found in that spot in the input text.

Running this microgrammar across the sample input text above gives:

```javascript
[
  {
    linkText: "includes",
    linkDestination: "https://atomist.com"
  }, 
  {
    linktext: "links",
    linkDestination: "https://twitter.com/atomist"
  }
]
```

This microgrammar is defined by a microgrammar phrase, just a string. That works here because the default parsing behavior of variables fits
the use case.

By default, a variable will yoink all the characters until the next fixed character. So `${linkText}` in `[${linkText}]` will absorb everything
up to the next square brace.

I can change this by also supplying microgrammar terms. These specify the structure inside each variable.

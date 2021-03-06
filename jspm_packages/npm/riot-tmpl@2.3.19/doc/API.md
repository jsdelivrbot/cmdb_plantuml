
# The riot-tmpl API

## tmpl


### `tmpl` function

_usage:_ `tmpl( str, data )`

The exposed `tmpl` function returns the template value from the cache, render with data.

_parameters_

* `str`  : string - Expression or template with zero or more expressions
* `data` : object - A Tag instance, for setting the context

_returns:_ string - Raw value of the expression or template to render


### `hasExpr` function

_usage:_ `brackets.hasExpr( str )`

Checks for an expression within a string, using the current brackets.

_parameters_

* `str` : string - String where to search

_returns:_ boolean - `true` if the string contains an expression

NOTE: This function only checks for a pair of unescaped riot brackets, does not validate
the expression nor excludes brackets within quotes.


### `errorHandler` property

_type:_ function

Defines a custom function to handle evaluation errors.

The `tmpl.errorHandler` property allows to detect errors _in the evaluation_, by setting its value to a function that receives the generated Error object, augmented with an object `riotData` containing the properties `tagName` and `_riot_id` of the context at error time.

Other (usually fatal) errors, such as "Parse Error" generated by the Function constructor, are not intercepted.

If this property is not set, or set to falsy, as in previous versions the error is silently ignored.


## brackets

Since v2.3, setting the brackets to some characters throws an exception.
This is the list of invalid characters:

- Control characters from `\x00` to `\x1F` that can be changed by browsers or minification tools
- Alphanumeric `a-z`, `A-Z`, and `0-9`, wich are confused with JS variable names
- Single and double quotes, comma, semicolon and backslash `'`, `"`, `,`, `;`, `\`, for obvious reasons
- The dangerous `<` and `>` characters, reserved for use in markup and strictly prohibited in unquoted text for any other purpose -- out of CDATA sections.

See the [CHANGES](CHANGES.md) document for details.


### `brackets` function

_Syntax:_ `brackets( reOrIdx ) : RegExp | string`

The brackets function accepts a RegExp or numeric parameter.

_parameters_

* `reOrIdx` : RegExp or number - regex to convert or index number of backets part

_returns:_ RegExp or string - With a regex, this function returns the original regex if the current brackets are the defaults, or a new one with the default brackets replaced by the current custom brackets.
With a numeric parameter, returns a value based on current brackets according to the following table (defaults are within parenthesis):

* 0: left bracket (`{`)
* 1: right bracket (`}`)
* 2: left escaped bracket (`{`)*
* 3: right escaped bracket (`}`)*
* 4: RegExp which matches a brackets pair (`/{[^}]*}/`)\*\*

\* only characters `[]()*+?.^$|` are escaped.

\*\* not 100% accurate, because it does not recognize brackets within strings.


### `set` function

_Syntax:_ `brackets.set( brackets_pair )`

Receives the new string for the brackets pair. If you pass a falsy value, brackets are reset to default.
This function checks their parameter and reconfigures the internal state immediately.

_parameters_

* `brackets_pair` : string - (optional) new custom brackets pair. The start and end is separated with a space character.

**NOTE:**
From v2.3.15, changes in `riot.settings.brackets` are detected resulting in a call to `brackets.set` and the reconfiguration is immediate.


### `R_MLCOMMS` property

_Type:_ RegExp

Used by internal functions and shared with the riot compiler, matches valid, multiline JavaScript comments in almost all forms. Can handle embedded sequences `/*`, `*\/` and `//` in these. Skips non-valid comments like `/*/`.

`R_MLCOMMS` does not make captures.


### `R_STRINGS` property

_Type:_ RegExp

Used by internal functions and shared with the riot compiler, matches single or double quoted strings, handles embedded quotes and multi-line strings (not in accordance with the JavaScript spec). It is not for ES6 template strings, these are too complex for a regex.

`R_STRINGS` does not make captures.


### `S_QBLOCK` property

_Type:_ string

Combines the `brackets.R_STRINGS` source with regexes for matching division symbols and literal regexes.

When dealing with clean JavaScript code, i.e. without comments, this is the only string you need to instantiate your RegExp object. For code containing comments, `S_QBLOCK` needs to be combined with other regexes for exclusion of multiline and single-line comments (`MLCOMMS` can be one of both).

The `S_QBLOCK` part captures in `$1` and `$2` a single slash, depending if it matches a division symbol ($1) or a regex ($2). If there's no matches for any of these, they have empty strings.

_Example:_

```js
// We can use riot.util.brackets if riot is in context
var brackets = require('riot-tmpl').brackets

// Creates the regex, $1 encloses the whole S_QBLOCK, for easier detection
var JS_RMCOMMS = new RegExp(
    '(' + brackets.S_QBLOCK + ')|' + brackets.R_MLCOMMS.source + '|//[^\r\n]*',
    'g')

// Replaces comments with a space (_1 is a string, division sign, or regex)
function stripComments(str) {
  return.replace(JS_RMCOMMS, function (m, _1) { return _1 ? m : ' ' })
}
```

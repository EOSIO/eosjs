## Functions

<dl>
<dt><a href="#encodeName">encodeName(name, [littleEndian])</a> ⇒ <code>string.&lt;uint64&gt;</code></dt>
<dd><p>Encode a name (a base32 string) to a number.</p>
<p>  For performance reasons, the blockchain uses the numerical encoding of strings
  for very common types like account names.</p>
</dd>
<dt><a href="#decodeName">decodeName(value, [littleEndian])</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#DecimalString">DecimalString()</a> ⇒ <code>string</code></dt>
<dd><p>Normalize and validate decimal string (potentially large values).  Should
  avoid internationalization issues if possible but will be safe and
  throw an error for an invalid number.</p>
<p>  Normalization removes extra zeros or decimal.</p>
</dd>
<dt><a href="#DecimalPad">DecimalPad(num, [precision])</a> ⇒ <code>string</code></dt>
<dd><p>Ensure a fixed number of decimal places.  Safe for large numbers.</p>
</dd>
<dt><a href="#DecimalImply">DecimalImply()</a></dt>
<dd><p>Ensures proper trailing zeros then removes decimal place.</p>
</dd>
<dt><a href="#DecimalUnimply">DecimalUnimply(value, precision)</a> ⇒ <code>number</code></dt>
<dd><p>Put the decimal place back in its position and return the normalized number
  string (with any unnecessary zeros or an unnecessary decimal removed).</p>
</dd>
<dt><a href="#parseAsset">parseAsset()</a> ⇒ <code>object</code></dt>
<dd><p>Attempts to parse all forms of the asset strings (symbol, asset, or extended
  versions).  If the provided string contains any additional or appears to have
  invalid information an error is thrown.</p>
</dd>
</dl>

<a name="encodeName"></a>

## encodeName(name, [littleEndian]) ⇒ <code>string.&lt;uint64&gt;</code>
Encode a name (a base32 string) to a number.

  For performance reasons, the blockchain uses the numerical encoding of strings
  for very common types like account names.

**Kind**: global function  
**Returns**: <code>string.&lt;uint64&gt;</code> - - compressed string (from name arg).  A string is
    always used because a number could exceed JavaScript's 52 bit limit.  
**See**: types.hpp string_to_name  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | A string to encode, up to 12 characters long. |
| [littleEndian] | <code>string</code> | <code>true</code> | Little or Bigendian encoding |

<a name="decodeName"></a>

## decodeName(value, [littleEndian]) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>Long</code> \| <code>String</code> \| <code>number</code> |  | uint64 |
| [littleEndian] | <code>string</code> | <code>true</code> | Little or Bigendian encoding |

<a name="DecimalString"></a>

## DecimalString() ⇒ <code>string</code>
Normalize and validate decimal string (potentially large values).  Should
  avoid internationalization issues if possible but will be safe and
  throw an error for an invalid number.

  Normalization removes extra zeros or decimal.

**Kind**: global function  
**Returns**: <code>string</code> - value  
<a name="DecimalPad"></a>

## DecimalPad(num, [precision]) ⇒ <code>string</code>
Ensure a fixed number of decimal places.  Safe for large numbers.

**Kind**: global function  
**Returns**: <code>string</code> - decimal part is added and zero padded to match precision  
**See**: ./format.test.js  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| num | <code>number</code> \| <code>string</code> \| <code>object.toString</code> |  |  |
| [precision] | <code>number</code> | <code></code> | number of decimal places.  Null skips     padding suffix but still applies number format normalization. |

**Example**  
```js
DecimalPad(10.2, 3) === '10.200'

  
```
<a name="DecimalImply"></a>

## DecimalImply()
Ensures proper trailing zeros then removes decimal place.

**Kind**: global function  
<a name="DecimalUnimply"></a>

## DecimalUnimply(value, precision) ⇒ <code>number</code>
Put the decimal place back in its position and return the normalized number
  string (with any unnecessary zeros or an unnecessary decimal removed).

**Kind**: global function  
**Returns**: <code>number</code> - 1.0000  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>value.toString</code> | 10000 |
| precision | <code>number</code> | 4 |

<a name="parseAsset"></a>

## parseAsset() ⇒ <code>object</code>
Attempts to parse all forms of the asset strings (symbol, asset, or extended
  versions).  If the provided string contains any additional or appears to have
  invalid information an error is thrown.

**Kind**: global function  
**Returns**: <code>object</code> - {amount, precision, symbol, contract}  
**Throws**:

- AssertionError


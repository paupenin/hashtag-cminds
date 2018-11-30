# Hashtag helper for Collective Minds Radiology

## Specifications

Write a #tag function and implement it in a text field.

The resulting field should:
1. lookup and suggest #tags from the list below while typing
2. format the tags in a different style/color
3. format also new tags not existing in the list

## Demo

[https://cminds.paupenin.com/](https://cminds.paupenin.com/)

## Usage

```html
<link rel="stylesheet" href="dist/css/hashtag-cminds.css">
<script src="dist/js/hashtag-cminds.js"></script>

<script>
    hashtagCM('#my-textarea', options);
</script>
```

## Options

### Default

Option | Description | Default
--- | --- | ---
`case` | Case sensitivity, true makes it sensitive | false
`color` | Default color for tags | #e2e3e5
`tags` | Tags array | null

### Tag Object

Option | Description | Required
--- | --- | ---
`tag` | Text to show and match | true
`color` | Color for tag | false


## Events

Event | Description | Callback
--- | --- | ---
`change` | Triggers when content changes | (object, element, content)
`dropdown.show` | Triggers after dropdown is shown | (object, element, dropdown)
`dropdown.hide` | Triggers after dropdown is hidden  | (object, element)
`dropdown.select` | Triggers after tag is selected  | (object, element, span, tag)

## Development

### Gulp

Compile everything
```console
gulp
```

Start browser-sync server with live reload
```console
gulp watch
```

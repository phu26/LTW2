# {{datetime}} [![NPM version](https://badge.fury.io/js/handlebars-helper-datetime.png)](http://badge.fury.io/js/handlebars-helper-datetime)

> Handlebars helper for adding RFC-822 formatted datetimes to XML feeds

## Installation

Use [npm](npmjs.org) to install the package:

```bash
npm i handlebars-helper-datetime --save-dev
```

Use [bower](https://github.com/bower/bower) to install the package:

```bash
bower install handlebars-helper-datetime --save-dev
```

## Usage

With the helper registered, you may now begin using it in your templates:

Use "now" as the date

```handlebars
{{datetime}}
```

Or pass in a context

```handlebars
{{datetime page.date}}
```

Results in

```yaml
Tue, 21 Jan 2014 03:08:11 -0500
```


## Usage with [Assemble](http://assemble.io)

The easiest way to register the helper with [Assemble](https://github.com/assemble/assemble) is to add the module to both `devDependencies` and `keywords` in your project's package.json:

```json
{
  "devDependencies": {
    "handlebars-helper-datetime": "*"
  },
  "keywords": [
    "handlebars-helper-datetime"
  ]
}
```

Alternatively, to register the helper explicitly in the Gruntfile:

```javascript
grunt.initConfig({
  assemble: {
    options: {
      // the 'handlebars-helper-datetime' npm module must also be listed in
      // devDependencies for assemble to automatically resolve the helper
      helpers: ['handlebars-helper-datetime', 'foo/*.js']
    },
    files: {
      'dist/': ['src/templates/*.hbs']
    }
  }
});
```

## Author

[**Jon Schlinkert**](http://github.com/jonschlinkert)

+ [github/jonschlinkert](http://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License and Copyright
Licensed under the [MIT License](./LICENSE-MIT).
Copyright (c) 2014 [Jon Schlinkert](http://github.com/jonschlinkert), contributors.

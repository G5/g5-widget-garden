# G5 Widget Garden

[![Build Status](https://travis-ci.org/G5/g5-widget-garden.png?branch=master)](https://travis-ci.org/G5/g5-widget-garden)
[![Code Climate](https://codeclimate.com/repos/530e8e8ce30ba005cb00272e/badges/5d8d2116d20f27e82639/gpa.png)](https://codeclimate.com/repos/530e8e8ce30ba005cb00272e/feed)

A garden of widgets that can be used in client location sites.


## Setup

1. Install all the required gems `bundle`
2. Set timestamps & symlink git hooks `rake dev:init`

   this configures git hooks(commit, merge) to maintain timestamps in `.gitmeta`.
   everytime you make a commit the file timestamps will be updated.
   if you want to update timestamps without commiting code, you can commit with allow empty.
   i.e. `git commit --allow-empty -m "update timestamps"`
3. Install all the required node dependencies. `npm install`

##### resolve .gitmeta branch conflicts:
1. reset your branch .gitmeta to origin master. `git checkout origin/master .gitmeta`
2. then sync your file system timestamps to .gitmeta by running a empty commit(runs git hook). `git commit --allow-empty -m "update timestamps"`


## Grunt Task

You will need to run the Gruntfile tasks in order to compile and concat the widget javascripts.

It can be ran one-off via
```bash
grunt
```

or you can watch the directory for changes (changes, additions and deletions) via
```bash
grunt watch
```

The Gruntfile is watching *.js & *.js.coffee files under public/static/components/*/javascripts/{show, edit}/. When being ran one-off or watched, the Gruntfile will:

1. Run a coffee task - compile the *.js.coffee files from public/static/components/*/javascripts/{show, edit}/ into *.compiled.js in the same directory
1. Run a concat task - concat *.js and *.compiled.js files into public/static/components/*/javascripts/ as either show.js or edit.js (depending on which folder it's coming from)
1. Run a clean task - remove *.compiled.js files from public/static/components/*/javascripts/{show, edit}/


## Specs

```bash
bundle exec rspec
```


## Widget CSS conventions

The css used for widgets should be the minimal amount to get it working
and layed out correctly. The theme css will handle the majority of
styles

**1** Namespace all styles with the top level widget class, which should be
the name of the widget. For example:

```css
.widget-name .title { }
```

**2** Try to limit selectors to 3 levels. For example:

DO THIS
```
.widget-name .title span { }
```

NOT THIS
```
.widget-name .widget-wrapper .title a span { }
```

**3** If possible, do not use tag names in conjunction with class names

DO THIS
```
.btn { }
```

NOT THIS
```
a.btn { }
```

**4** Do not use the font-family property

**5** Try to limit use of color, font-size, font-style, font-weight, borders, etc.

**6** Do not use !important unless you know for sure that the color
will never need to be changed. This should be rare


### Regarding configurable widget settings

Sometimes you may want the widget to have some custom styling options,
typically related to color. These use inline styles in the show view.
Please follow these conventions:

**1** Use the background-color attribute, rather than background

**2** If you give the option to change the background, also give the option
to change the text color within that element

**3** For these custom colors, set the defaults in the css file, not the index file

**4** Limit these types of widget settings as much as possible


## Available classes for styling in themes using boilerplate

* .primary-color, .secondary-color, .tertiary-color *(sets color to custom variables)*
* .primary-bg, .secondary-bg, .tertiary-bg *(sets background-color to custom variables)*
* .primary-font, .secondary-font *(sets font-family to custom font variable)*
* .clearfix
* .hidden
* .visually-hidden *(hides from screen but not screen readers)*
* .image-replace *(for hiding text and using background image)*
* .btn
* .form-field *(to wrap a label and input)*
* .form-instruction *(any form notes or instructions)*
* .required *(place on labels of required form fields)*
* .center *(centers text)*
* .float-left, .float-right, .float-none
* .clear-left, .clear-right, .clear-both
* http://g5-theme-garden.herokuapp.com/static/g5-icons


## Authors

  * Jessica Lynn Suttles / [@jlsuttles](https://github.com/jlsuttles)
  * Bookis Smuin / [@bookis](https://github.com/bookis)
  * Jessica Dillon / [@jessicard](https://github.com/jessicard)
  * Chad Crissman / [@crissmancd](https://github.com/crissmancd)
  * Brian Bauer / [@bbauer](https://github.com/bbauer)
  * Levi Brown / [@levibrown](https://github.com/levibrown)

## Contributing

1. Fork it
1. Get it running
1. Create your feature branch (`git checkout -b my-new-feature`)
1. Write your code and **specs**
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Push to the branch (`git push origin my-new-feature`)
1. Create new Pull Request

If you find bugs, have feature requests or questions, please
[file an issue](https://github.com/G5/g5-widget-garden/issues).


## License

Copyright (c) 2015 G5

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

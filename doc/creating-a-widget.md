# Creating a Widget

## Overview

A widget is defined by the contents of a directory located at
`public/static/components/:widget-name` where :widget-name is the name of the
widget, downcased and dashed. The `index.html` file located in this directory
includes HTML marked up with
[microformats2](http://microformats.org/wiki/microformats-2) classes to provide
the widget's settings. More information about the contents of this directory is
below.

## Directory Structure

* "#{Rails.root}"
    * public/
        * [javascripts/](#publicjavascripts)
            * [:lib-javascript.js](#publicjavascriptslib-javascriptjs)
        * [static/](#publicstatic)
            * [components/](#publicstaticcomponents)
                * [:widget-name/](#publicstaticcomponentswidget-name)
                    * [index.html](#publicstaticcomponentswidget-nameindexhtml)
                    * [edit.html](#publicstaticcomponentswidget-nameedithtml)
                    * [show.html](#publicstaticcomponentswidget-nameshowhtml)
                    * [images/](#publicstaticcomponentswidget-nameimages)
                        * [thumbnail.png](#publicstaticcomponentswidget-nameimagesthumbnailpng)
                        * [:custom.png](#publicstaticcomponentswidget-nameimagescustompng)
                    * [javascripts/](#publicstaticcomponentswidget-namejavascripts)
                        * [edit.js](#publicstaticcomponentswidget-namejavascriptseditjs)
                        * [edit/](#publicstaticcomponentswidget-namejavascriptsedit)
                            * [:custom.js.coffee](#publicstaticcomponentswidget-namejavascriptseditcustomjscoffee)
                            * [:custom.js](#publicstaticcomponentswidget-namejavascriptseditcustomjs)
                        * [show.js](#publicstaticcomponentswidget-namejavascriptsshowjs)
                        * [show/](#publicstaticcomponentswidget-namejavascriptsshow)
                            * [:custom.js.coffee](#publicstaticcomponentswidget-namejavascriptsshowcustomjscoffee)
                            * [:custom.js](#publicstaticcomponentswidget-namejavascriptsshowcustomjs)
                    * [stylesheets/](#publicstaticcomponentswidget-namestylesheets)
                        * [:custom.css](#publicstaticcomponentswidget-namestylesheetscustomcss)

## Documentation

### public/javascripts/

- where lib javascripts live (javascript libraries accessible by any widget)

[top](#directorystructure)

### public/javascripts/:lib-javascript.js

- :lib-javascript is a placeholder for the name of a library, e.g. twitter,
  h5validate
- to include a particular library in a particular widget, hardcode the
  library's relative path in `index.html`'s `h-g5-component`  with a micrformat
  class of `u-g5-lib-javascript`

```html
<div class="h-g5-component">
  <!-- ...  -->
  <a class="u-g5-lib-javascript" href="javascripts/libs/:lib-javascript.js">:lib-javascript.js</a>
  <!-- ...  -->
</div>
```

[top](#directorystructure)

### public/static/

- this folder serves to differentiate the paths between the static/uncompiled
  version of the widget and the dynamic/compiled version of the widget
    - `http://...//static/components/:widget-name` is the url to the
      static/uncompiled version of the widget
    - `http://.../components/:widget-name` is the url to the dynamic/compiled
      version of the widget

[top](#directorystructure)

### public/static/components/

- all static/uncompiled widgets live here

[top](#directorystructure)

### public/static/components/:widget-name/

- :widget-name is a placeholder for the name of the widget
- a particular static/uncompiledwidget lives here

[top](#directorystructure)

### public/static/components/:widget-name/index.html

- required
- :widget-name is a placeholder for the name of the widget
- uses microformats to explictly defines information about the widget that
  cannot be inferred from the directory contents, e.g. name, summary, lib
  javascripts, properties/settings

```html
<div class="h-g5-component">
  <h1 class="p-name">Widget Name</h1>
  <p class="p-summary">Summary of what widget does.</p>
  <a class="u-g5-lib-javascript" href="javascripts/libs/twitter.js">twitter.js</a>

  <div class="e-g5-property-group h-g5-property-group">
    <h2 class="p-name">Property Group Name</h2>
    <ul>
      <li class="p-category">Property Category</li>
    </ul>
    <div class="e-g5-property-group h-g5-property-group">
      <h3 class="p-g5-name">Property Name</h3>
      <p class="p-g5-editable">true</p>
      <p class="p-g5-default-value">username</p>
    </div>
  </div>
</div>
```

[top](#directorystructure)

### public/static/components/:widget-name/edit.html

- required
- :widget-name is a placeholder for the name of the widget
- the form shown to a user on the Client Hub to configure the
  properties/settings of a widget

```html
<form>
  <!-- fields -->
  <input type="submit" value="Save" />
</form>
```

- label/input pairs should be wrapped in a `div.field`
- self-closing tags, such as inputs, should include a slash `/` at the end of
  the tag
- liquid tags should be used for form fields
- all properties/settings can be called as methods on the widget object, e.g.
  `widget.property_name`
- liquid methods availble on properties/settings:
    - `id_hidden_field`
    - `value_field_id`
    - `value_field_name`
    - `value`
    - `best_value`
- each property requires a pair of fields in the form to allow for persistence
    - hidden field to represent the attribute id
    - standard input field (text, select, etc.) to represent the value

```html
<div class="form-field">
  {{ widget.property_name.id_hidden_field }}
  <label for="{{ widget.property_name.value_field_id }}" >
    Property Name
  </label>
  <input type="text"
    id="{{ widget.property_name.value_field_id }}"
    name="{{ widget.property_name.value_field_name }}"
    value="{{ widget.property_name.value }}"
  />
</div>
```

[top](#directorystructure)

### public/static/components/:widget-name/show.html

- :widget-name is a placeholder for the name of the widget
- the html that gets shown on the web_template for the user to view or interact with

```html
<div class=":widget-name">
  <script class="config" type="application/json">
    {
      "id": "{{ widget.property_name.value }}",
      "name": {{ widget.property_name.value }},
      "value": {{widget.property_name.value}}
    }
  </script>
</div>
```

- self-closing tags, such as inputs, should include a slash `/` at the end of
  the tag
- all properties/settings can be called as methods on the widget object, e.g.
  `widget.property_name`
- liquid methods availble on properties/settings:
    - `id_hidden_field`
    - `value_field_id`
    - `value_field_name`
    - `value`
    - `best_value`


#### Input Types

- use appropriate input types for the content, e.g. text, email, url, tel,
  number, etc.  [More information
  here.](https://developer.mozilla.org/en-US/docs/HTML/Element/Input)

```html
<div class="field">
  {{ widget.contact_info_email.id_hidden_field }}
  <label for="{{ widget.contact_info_email.value_field_id }}" >
    Email
  </label>
  <input type="email"
    id="{{ widget.contact_info_email.value_field_id }}"
    name="{{ widget.contact_info_email.value_field_name }}"
    value="{{ widget.contact_info_email.value }}"
  />
</div>
```

#### Inline Fields

- for multiple inline label/input pairs in one row, wrap each pair in a
  `div.inline-field` and wrap the entire group in a `div.field`

```html
<div class="field">
  <div class="inline-field">
    <!-- label/input pair -->
  </div>
  <div class="inline-field">
    <!-- label/input pair -->
  </div>
</div>
```

#### Checkboxes

- a hidden field should appear before the checkbox with the same field name and
  a value of "false"
- if the checkbox is unchecked it pases no param, and the hidden value is
  passed
- if the checkbox is checked its value over-rides that of the hidden field
- this is the same thing the Rails `checkbox_tag` helper does
- label/checkbox pairs should be wrapped in a `div.field.check-field`

```html
<div class="field check-field">
  {{ widget.checkbox_property.id_hidden_field }}
  <label for="{{ widget.checkbox_property.value_field_id }}">
    Checkbox Property
  </label>
  <input type="hidden"
    id="{{ widget.checkbox_property.value_field_id }}_false"
    name="{{ widget.checkbox_property.value_field_name }}"
    value="false"
  />
  <input type="checkbox"
    id="{{ widget.checkbox_property.value_field_id }}"
    name="{{ widget.checkbox_property.value_field_name }}"
    value="true"
    {% if widget.checkbox_property.value == "true" %}
    checked="checked"
    {% endif %}
  />
</div>
```

#### Radio Buttons

- label/radio button pairs should be wrapped in a `div.field.check-field`

```html
<div class="field check-field">
  <label>Map Type</label>
  {{ widget.map_type.id_hidden_field }}
  <label for="{{ widget.map_type.value_field_id }}_roadmap" >
    Road Map
  </label>
  <input type="radio"
    id="{{ widget.map_type.value_field_id }}_roadmap"
    name="{{ widget.map_type.value_field_name }}"
    value="ROADMAP"
    checked="checked"
  />
  <label for="{{ widget.map_type.value_field_id }}_satellite" >
    Satellite
  </label>
  <input type="radio"
    id="{{ widget.map_type.value_field_id }}_satellite"
    name="{{ widget.map_type.value_field_name }}"
    value="SATELLITE"
    {% if widget.map_type.value == "SATELLITE" %}
    checked="checked"
    {% endif %}
  />
</div>
```

[top](#directorystructure)

### public/static/components/:widget-name/show.html

- required
- The show file displays in the Client Hub when previewing widget.
- Liquid may be used in this file.
- No javascript is allowed in this file.
- JSON is allowed in this file.
- No styles are allowed in this file.

[top](#directorystructure)

### public/static/components/:widget-name/images/

- requred
- Every widget should have `thumbnail.png` and any other images used in the
widget show.

[top](#directorystructure)

### public/static/components/:widget-name/images/thumbnail.png

- The thumbnail is displayed in the Client Hub when selecting widgets.

[top](#directorystructure)

### public/static/components/:widget-name/images/:custom.png

- :custom is a placeholder for the name of an image
- A widget may have many other custom images

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/

- javascripts written custom for this widget live here

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/edit.js

- optional
- Do not edit!
- this file is generated with a grunt task that compiles the contents of edit/

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/edit/

- optional
- files will be included in alphabetical order

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/edit/:custom.js.coffee

- optional
- :custom is a placeholder for the name of a js file
- a widget may have many custom javascripts

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/show.js

- optional
- Do not edit!

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/show/

- optional
- files will be included in alphabetical order

[top](#directorystructure)

### public/static/components/:widget-name/javascripts/show/:custom.js.coffee

- optional
- :custom is a placeholder for the name of a js file
- a widget may have many custom javascripts

[top](#directorystructure)

### public/static/components/:widget-name/stylesheets/

- optional
- Stylesheets used in the widget show.
- files will be included in alphabetical order

[top](#directorystructure)

### public/static/components/:widget-name/stylesheets/:custom.css

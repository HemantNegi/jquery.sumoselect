jquery.sumoselect
=============


jquery.sumoselect.js - A beautiful cross device Single/Multi Select jQuery Select plugin.
-------------------------------------------------------------------------------
A jQuery plugin that progressively enhances an HTML Select Box into a Single/Multiple option dropdown list. The dropdown list can be fully customizable using simple css.
It can adapt itself according to any device, keeping in mind that the User Experience is not broken. 

View Live [Demo Here](http://hemantnegi.github.io/jquery.sumoselect/sumoselect_demo.html)

Documentaion [Documentation Here](http://hemantnegi.github.io/jquery.sumoselect/)

Latest stable :  [Download from here](https://github.com/HemantNegi/jquery.sumoselect/releases)

**CDNJS**

The folks at CDNJS host a copy of the library. The CDN is updated after the release is made public, which means there is a delay between the publishing of a release and its availability on the CDN, so keep that in mind. Just use these links:

```html
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.sumoselect/3.0.2/sumoselect.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.sumoselect/3.0.2/jquery.sumoselect.min.js"></script>
```


**Notable Features**
   - Inline Search.

   - Optgroup support.
  
   - Single and Multi select option.

   - Fully customizable by simple css.

   - Supports almost all devices.

   - Intelligently Renders itself according to the devices.

   - Renders native Single/Multiple pop up on Android, ios, Windows and other devices.
   
   - Custom postback data format (Multiple select data can be passed either as csv or default select)

   - Selected, Disabled, and Placeholder Support

   - Easily extendable to allow developers to create new widgets

**Update v1.1.0**

   - Wraped all properties in a sumo object connected to native select element.

   - Added standard add, remove, select, unselect, disable, eanble, unload etc. methods for better manipulation

   - Instance of SumoSelect can be accessed from native reference of select element

   - ~~Added ```disabled = true``` to disable/ enable the control.~~ Now its ```enable()``` and ```disable()``` 

   - Bug fixings..
   
**Update v1.2.0**

   - Added a new option for custom dispaly formats

   - Now ```outputAsCSV``` is default set to ```false```

   - fixed problems with unload and other handler methods on mobile deveices

   - Bug fixings..

**Update v2.0.0**

   - Added tabindex and keyboard navigation support

   - Added select all feature

   - Redesigned the UI (No external icons are used now and color scheme can be controlled by css)

   - Added some really useful new methods like ```reload(), selectAll(), unSelectAll(), enable(), disable()```

   - Better rensponse to lost focus and other events and non recognised devices.

   - Lots of bug Fixings..


**Update v3.0.0**

   - Support for searching added.

   - Optgroup support added

   - Restructured markup

   - Direction of select is controllable by settings.

   - All the text can be customized (better localization support).

   - Lots of bug Fixings..

## Requirements
jQuery 1.8.3+ (It is always recommended to use the latest version of jQuery)


## Desktop Browser Support
IE8+, Firefox 4+, Chrome, Safari 4+, Opera 11+ (Other browsers may work, but I did not test on them)


## Mobile/Tablet Browser Support
iOs 3+, Android 2.1+ , Windows Mobile (Other browsers may work, but I did not test on them)


## Forking
If you find that you need a feature that SumoSelect does not currently support, either let me know via the SumoSelect issue tracker, or fork SumoSelect on Github and easily extend SumoSelect to create your own widget!

## Usage

*To just go with the default options simply do*

```javascript
 $(document).ready(function () {
            $('.SlectBox').SumoSelect();
     });
```

*To provide optional settings, simply pass settings object to SumoSelect()*

```javascript
 $(document).ready(function () {
            $('.SlectBox').SumoSelect({placeholder: 'This is a placeholder', csvDispCount: 3 });
        });
```

If you want a instance to the SumoSelect object to call handler methods

```javascript
 var MySelect;
 $(document).ready(function () {
         MySelect = $('.SlectBox').SumoSelect();
     });
```
*NOTE: SumoSelect returns an array of select elements if there are more than one in the matching selector.*

You can also find the instance to SumoSelect object by directly selecting your select element like
```javascript
	$('select.SlectBox')[0].sumo. .....
```

You can perform all the operations on underlying original select and then reload the UI by 
```javascript
	$('select.SlectBox')[0].sumo.reload();
```

##### You can bind your handlers to some sumoselect specific events eg.
```javascript
$('select.SlectBox').on('sumo:opened', function(sumo) {
   // Do stuff here
   console.log("Drop down opened", sumo)
});
```
Available events

- `sumo:opened`
- `sumo:opening`
- `sumo:closing`
- `sumo:closed`


**Settings**

Below are the available settings:

- `placeholder` `(string)`  The palceholder text to be displayed in the rendered select widget (on priority basis). *Maximum priority is given to native placeholder attribute in select tag i.e.  - `<select placeholder="this is a placeholder" />`  - Then the option with disabled and selected attribute i.e. `<option disabled selected value="foo" >`  - Last to to the given placeholder attribute in the settings. *

- `csvDispCount` `(int)`  The number of items to be displayed in the widget seperated by a `,` after that the text will be warped as *3+ Selected*. Set `0` for all the options.

- `captionFormat` `(string)` Its the format in which you want to see the caption when more than csvDispCount items are selected. its default value is `'{0} Selected'` ( here `{0}` will be replaced by the seletion count )

- `captionFormatAllSelected` `(string)` Format of caption text when all elements are selected. set null to use captionFormat. It will not work if there are disabled elements in select. default is `'{0} all selected!'`

- `floatWidth` `(int)` Minimum screen width of device below which the options list is rendered in floating popup fashion.

- `forceCustomRendering`  `(boolean)` Force the custom modal ( Floating list ) on all devices below floatWidth resolution.

- `nativeOnDevice`  `(Array[string])` The keywords to identify a mobile device from useragent string. The system default select list is rendered on the matched device.

- `outputAsCSV` `(boolean)` `true` to POST data as csv ( false for deafault select )

- `csvSepChar` `(string)`  Seperation char if `outputAsCSV`  is set to `true`

- `okCancelInMulti` `(boolean)` Displays Ok Cancel buttons in desktop mode multiselect also.

- `isClickAwayOk` `(boolean)` for okCancelInMulti=true. sets whether click outside will trigger Ok or Cancel (default is cancel).

- `triggerChangeCombined` `(boolean)` In Multiselect mode whether to trigger change event on individual selection of each item or on combined selection ( pressing of OK or Cancel button ).

- `selectAll` `(boolean)` To display select all check or not

- `search` `(boolean)`  To enable searching in sumoselect (default is false).

- `searchText` `(string)`  placeholder for search input.

- `noMatch` `(string)`  placeholder to display if no itmes matches the search term (default 'No matches for "{0}"').

- `prefix` `(string)`  prefix to prepend the selected text (default is empty) eg. '<b>Hello</b>'.

- `locale` `(array)`  change the text used in plugin (```['OK', 'Cancel', 'Select All']```). Note: don't break the sequence or skip items. 

- `up` `(boolean)`   the direction in which to open the dropdown (default: false)

- `showTitle` `(boolean)` set to false to prevent title (tooltip) from appearing (deafult `true`)

**The default settings are :**

```javascript
{
    placeholder: 'Select Here',
    csvDispCount: 3,
    captionFormat:'{0} Selected', 
    captionFormatAllSelected:'{0} all selected!',
    floatWidth: 400,
    forceCustomRendering: false,
    nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],
    outputAsCSV: false,
    csvSepChar: ',',
    okCancelInMulti: false,
    isClickAwayOk: false,
    triggerChangeCombined: true,
    selectAll: false,
    search: false,
    searchText: 'Search...',
    noMatch: 'No matches for "{0}"',
    prefix: '',
    locale: ['OK', 'Cancel', 'Select All'],
    up: false,
    showTitle: true
}
```

[Furthur Documentation](http://hemantnegi.github.io/jquery.sumoselect/)

## License

Copyright (c) 2016 Hemant Negi Licensed under the MIT license.

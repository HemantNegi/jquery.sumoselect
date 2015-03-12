jquery.sumoselect
=============


jquery.sumoselect.js - A cross device Single/Multi Select jQuery Select plugin.
-------------------------------------------------------------------------------

View Live [Demo Here](http://hemantnegi.github.io/jquery.sumoselect/sumoselect_demo.html)

Documentaion [Documentation Here](http://hemantnegi.github.io/jquery.sumoselect/)

Sumoselect full :  [jquery.sumoselect.js](https://github.com/HemantNegi/jquery.sumoselect/blob/master/jquery.sumoselect.js)

Minified : [jquery.sumoselect.min.js](https://github.com/HemantNegi/jquery.sumoselect/blob/master/jquery.sumoselect.min.js)


A jQuery plugin that progressively enhances an HTML Select Box into a Single/Multiple option dropdown list. The dropdown list can be fully customiseable using siple css properties.
It can adapt itself according to any deveice, keeping in mind that the User Experience is not broken. 


**Notable Features**
  
   - Single and Multi select option.

   - Fully customizable by simple css.

   - Supports almost all devices (Till now i didnt found one)

   - Intelligently Renders itself according to the devices.

   - Renders native Single/Multiple pop up on Android, ios, Windows and other devices.
   
   - Custom postback data format (Multiple select data can be passed either as csv or default select)

   - Selected, Disabled, and Placeholder Support

   - Easily extendable to allow developers to create new widgets

**Update v1.1.0**

   - Wraped all properties in a sumo object connected to native select element.

   - Added standard add, remove, select, unselect, disable, eanble, unload etc. methods for better manipulation

   - Instance of SumoSelect can be accessed from native reference of select element

   - Added ```disabled = true``` to disable/ enable the control.

   - Bug fixings..
   
**Update v1.2.0**

   - Added a new option for custom dispaly formats

   - Now ```outputAsCSV``` is default set to ```false```

   - fixed problems with unload and other handler methods on mobile deveices

   - Bug fixings..

##Requirements
jQuery 1.8.3+ (It is always recommended to use the latest version of jQuery)


##Desktop Browser Support
IE8+, Firefox 4+, Chrome, Safari 4+, Opera 11+ (Other browsers may work, but I did not test on them)


##Mobile/Tablet Browser Support
iOs 3+, Android 2.1+ , Windows Mobile (Other browsers may work, but I did not test on them)


##Forking
If you find that you need a feature that SumoSelect does not currently support, either let me know via the SumoSelect issue tracker, or fork SumoSelect on Github and easily extend SumoSelect to create your own widget!

##Usage

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
	$('select.SlectBox')[o].sumo. .....
```

**Settings**

The following settings are available now:

-  `placeholder` `(string)`  The palceholder text to be displayed in the rendered select widget (on priority basis). *Maximum priority is given to native placeholder attribute in select tag i.e.  - `<select placeholder="this is a placeholder" />`  - Then the option with disabled and selected attribute i.e. `<option disabled selected value="foo" >`  - Last to to the given placeholder attribute in the settings. *

- `csvDispCount` `(int)`  The number of items to be displayed in the widget seperated by a `,` after that the text will be warped as *3+ Selected*. Set `0` for all the options.
- `captionFormat` `(string)` Its the format in which you want to see the caption when more than csvDispCount items are selected. its default value is `'{0} Selected'` ( here `{0}` will be replaced by the seletion count )

- `floatWidth` `(int)` Minimum screen width of device below which the options list is rendered in floating popup fashion.

- `forceCustomRendering`  `(boolean)` Force the custom modal ( Floating list ) on all devices below floatWidth resolution.

- `nativeOnDevice`  `(Array[string])` The keywords to identify a mobile device from useragent string. The system default select list is rendered on the matched device.

- `outputAsCSV` `(boolean)` `true` to POST data as csv ( false for deafault select )

- `csvSepChar` `(string)`  Seperation char if `outputAsCSV`  is set to `true`

- `okCancelInMulti` `(boolean)` Displays Ok Cancel buttons in desktop mode multiselect also. 

- `triggerChangeCombined` `(boolean)` In Multiselect mode whether to trigger change event on individual selection of each item or on combined selection ( pressing of OK or Cancel button ).


**The default settings are :**

```javascript
{
                    placeholder: 'Select Here',
                    csvDispCount: 3,
                    captionFormat: '{0} Selected',
                    floatWidth: 500,
                    forceCustomRendering: false,
                    nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],
                    outputAsCSV : false,
                    csvSepChar : ',', 
                    okCancelInMulti: true, 
                    triggerChangeCombined : true,
                    customClassCSS: ''
                }
```

[Furthur Documentation](http://hemantnegi.github.io/jquery.sumoselect/)

## License

Copyright (c) 2014 Hemant Negi Licensed under the MIT license.

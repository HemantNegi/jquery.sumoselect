jquery.sumoselect
=============


jquery.sumoselect.js - A cross device SIngle/Multi Select jQuery Select plugin.
-------------------------------------------------------------------------------

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


##Requirements
jQuery 1.8.3+ (It is always recommended to use the latest version of jQuery)


##Desktop Browser Support
IE8+, Firefox 4+, Chrome, Safari 4+, Opera 11+ (Other browsers may work, but I did not test on them)


##Mobile/Tablet Browser Support
iOs 3+, Android 2.1+ , Windows Mobile (Other browsers may work, but I did not test on them)


##Forking
If you find that you need a feature that SumoSelect does not currently support, either let me know via the SelectBoxIt issue tracker, or fork SumoSelect on Github and easily extend SumoSelect to create your own widget!

##Usage

*To just go with the default options simply do*

```javascript
 $(document).ready(function () {
            window.asd = $('.SlectBox').SumoSelect({ csvDispCount: 3 });
     });
```

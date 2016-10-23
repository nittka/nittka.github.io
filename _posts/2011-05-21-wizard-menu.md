---
title: Getting your wizard to the New-Menu(-root)
tags: ["Eclipse","revive"]
excerpt: A quick summary on creating a shortcut for your wizard.
---
This is something obvious to anybody who really knows anything about plugin development (but it seems hard to quickly find a solution if you don't know it already...). You created a wizard, made it known via the `plugin.xml` and it appears in New->Other->MyCategory. But you want it to appear directly under *New* (like so many other wizards...).

These **shortcuts** are bound to the perspective, so it is not a matter of finding the correct `category id` to have it appear there. You have to add a shortcut to your wizard in the wanted perspective. And this is one way:

```xml
<extension point="org.eclipse.ui.perspectiveExtensions">
  <perspectiveExtension 
    targetID="*">
    <newWizardShortcut id="my.cool.Wizard"/>
  </perspectiveExtension>
</extension>
```

`targetID` is the id of the perspective in which your wizard should be accessible via the shortcut. Using `*`, it is added to all perspectives (your wizard is really important after all ;-)). And `newWizardShortcut` points to your wizard via its ID.

Don't forget to reset the perspective, after you have added this to the `plugin.xml`, otherwise the change may not have any effect. Now you can activate/deactivate the shortcut via customising the perspectives...
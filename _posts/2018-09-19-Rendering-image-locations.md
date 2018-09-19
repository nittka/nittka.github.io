---
tags: ["misc"]
excerpt: |
  If you want to visualize where all your pictures were taken (provided the GPS-Exif data is present), ...
---
Many image organizing programs are capable of showing the location where a photo was taken on a map.
It turns out not to bee too hard.
Using the [metadata-extractor](https://github.com/drewnoakes/metadata-extractor) and [OpenLayers](https://openlayers.org/) as the basis, a couple of lines of code allow

* extracting the GPS-data of all images within a folder
* create a local html file showing a map with a marker for each of the pictures
* and each marker has a hover with the preview of the picture

The code can be found [here](https://github.com/nittka/metadata-extractor-eclipse-plugin/tree/folderMap).
I have two left hands and ten thumbs when it comes to JavaScript, so there will be much room for improvement.
In particular the image preview, popup closing etc. could be better.
So it is not much more than a proof of concept, but quite nice for the little time spent.

The basic idea is to go over all files in a given folder and extract the GPS-Data.
Store this data in a file and have a html-template file which the interprets this data and renders the map.

![Screenshot]({{ site.url }}/assets/gpsImagesMap.jpg "screenshot of the rendering result"){:width="600" .center-image}
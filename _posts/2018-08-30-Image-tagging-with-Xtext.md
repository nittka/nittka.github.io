---
tags: ["Xtext"]
excerpt: |
  Sometimes, very small changes (additional features) greatly improve usability.
  Adding a view showing the current photo and a simple browser presentation of images matching a search made Jtag usable at all.
---
In a [previous post]({% post_url 2016-11-22-Implementing-custom-Xtext-searches %}), I sketched a possibility for implementing custom Xtext searches and presenting the corresponding results.
The intention back then was implementing an Xtext based system for catagorizing and tagging documents and then being able to query the data ([Xarchive](https://github.com/nittka/Xarchive)).

The step from documents to photos is a small one, so a sibling project ([Jtag](https://github.com/nittka/Jtag)) was quickly set up.
With respect to doing the actual foot work, photo tagging did not make much (i.e. any) progress, though.
The process of entering the data would have been too painful — a quickfix prepares entries for all the photos but then you have to open each one individually, in order to see it and describe the content.
Once the data is entered, searching would have yielded a list in the search view, but from there it is a two step process before you actually see a single photo.

Instead of a file name list, you really want an overview of all the photos in the search result.
It turns out that this can be achieved in an almost [trivial way](https://github.com/nittka/Jtag/commit/869e9ea2c77909eadcdb13c5cd7a9dea564a4700): Take the search result, create an html file showing all the corresponding photos and open that file in a browser.
Showing a [thumbnail](https://github.com/nittka/Jtag/commit/269c292342fa2589594322c3fab463755b39bb68) when hovering over the file name was the immediate next step, but it was not enough for easy data entry.
The image is too small to see details and it disappears (or is in the way) when entering the data, though.

The simple solution for this problem is having a [view](https://github.com/nittka/Jtag/commit/d35e76bc687754858e5b41d07d26ee35627b77f3) showing the photo currently selected. I don't known why it took almost two years to come up with that idea — well, probably because there was no real need for tagging the photos at all.
With these improvements, I may actually start doing the foot work.
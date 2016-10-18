---
tags: ["Xtext","revive"]
author: Margit Brause
excerpt: We created a terminology editor for Eclipse that provides comfortable editing for terminology text files, exporters for publishing terminology to end users, and exporters for collaboration with freelance translators.
---
## Part 2: Lightweight terminology management with a custom Xtext terminology editor
In a previous post, I described the motivation for introducing at least basic terminology management in a software company, and the requirements from my point of view as a technical writer.
This post describes the solution we found.

### The Xtext terminology editor for Eclipse
Alexander and I decided to build a [terminology editor for Eclipse](https://github.com/nittka/terminology "Terminology Editor on GitHub") that provides comfortable editing for my terminology text files, including templates, autocomplete, validation, syntax highlighting and folding.

A sortable outline view and a searchable quick outline provide easy access to terms. For more complete search functions, a search dialog has been implemented that lets you search not only in the terms but also in the definition text and usage examples. Search results can be filtered by term status, customer and product assignment.

![Terminology Editor Screenshot]({{ site.url}}/assets/termi_sample.png){:width="600px"}

This was enough for me and for those who use Eclipse Galileo or later, but I also needed to make the term collection available to developers using other editors and to the marketing team who did not want to start working with Eclipse just to research terminology.

### Research options for terminology end users
I started with exporter providing the terms and definition as a wiki markup table I can paste into our Confluence wiki. This works well so far, but does not provide all the information contained in the term collection, or the editor's advanced search functions. Also, it still is not easy enough to use to incite the developers to actually look something up, now that the terminology is available.

To make looking terms up more user friendly, a JSON exporter was added to the terminology editor. The JSON export works with an HTML search site based on jQuery and filter.js to provide filterable search functions in a browser. The HTML search site actually provides more search options now than the terminology search within the editor, as the users immediately came up with stuff I never thought of needing, such as filtering the search by language - even though we only use two of them! :-)

### Exporters for outsourcing
So far, we have only used the new term collection within our organization. Translation jobs have sometimes been given to freelance translators in the past, however, so I thought I would make sure that our terminology could be put to work in such a case.

A freelance translator is likely to use either a spreadsheet with terms or a translation memory system with a terminology component. Translation memory systems are often developed by the same companies that offer terminology management solutions and can usually import the XML-based TBX exchange format for terminology data.

The terminology editor now has both an exporter for simple CSV lists and one for the TBX format. I have mentioned before that I want to feel in control of my data and be fairly certain that it will stay accessible. The exporters also address this issue by providing ways to either revert to 'minimum version' terminology management in a spreadsheet or to move on to a more sophisticated proprietary system should the need arise, using the TBX exchange format.

### Cool, innit?

I quite like the Xtext terminology editor, and now that the browser-based search is available, I hope that I will bring around the developers to looking stuff up and pointing out missing terms.
I would certainly appreciate any feedback on the way developers feel that the terms they use should be managed.
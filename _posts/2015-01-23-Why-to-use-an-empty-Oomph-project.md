---
tags: ["Oomph","revive"]
excerpt: The expert mode of the Eclipse Oomph installer lets you skip the project selection in order to materialize a plain Eclipse product. Read on if you want to know, why it may be better to install an empty project.
---
[Oomph](http://wiki.eclipse.org/Eclipse_Oomph_Installer) allows you to quickly set up an Eclipse development environment. In the expert mode (previously the only mode) you can also choose to install projects from catalogs, so that you can start contributing to them right away. Choices for workspace, git clone location (rules) etc. have to be made only once and are automatically used again for subsequent installations.

But you can also skip the project selection in order to set up a plain Eclipse installation. This is an interesting option because the bundle pool will still be used. So why use an empty Oomph project rather than skipping the project selection?

The main reason for me is the workspace location. The global settings in the project catalog allow you to define a location rule (e.g. folder ws next to the eclipse installation). With an empty project, those will still be used — but why should I care?

I never want my workspace at the default location proposed by Eclipse, I have a resource creation task and a project import task in my user setup (the place where personal settings for all Oomph installations can be stored). The resource creation task configures the problems view (so I do not have to do that every time) and the project import task imports a "Snippet/TODO-project" I want to have always at hand.

These tasks would not succeed, if the workspace location was unknown at startup time and it is hard (impossible?) to configure a task such that it will be skipped if no project is selected. And selecting an empty project is just as easy as selecting "skip project selection". Feel free to us my [empty project setup](https://raw.githubusercontent.com/nittka/oomph-playground/master/setups/setups/emptyProject.setup) at GitHub.
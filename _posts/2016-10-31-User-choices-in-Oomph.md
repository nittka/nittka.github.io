---
tags: ["Oomph"]
excerpt: This post describes a possibility for implementing user choices in Oomph project setups.
---
Oomph asks the user to choose an Eclipse product and a number of projects before setting up the environment. Depending on those choices, some additional parameters will have to be set by the user on the `Variables` page.

Sometimes, it may be desirable to provide more options to the user — not just which stream of the project is to be installed:

* install additional tooling that is not required in all cases
* import additional projects not needed by everybody working on the project

This could be achieved by additional project setups, the user may add. But then the connection to the original project is somewhat lost. Another solution is abusing task `Filter`s. These can be used to control whether a certain task is active or not. A `Filter` as an advanced task property and tests a system or environment property ([see this forum post](https://www.eclipse.org/forums/index.php?t=msg&th=1080068&goto=1742042&#msg_1742042)) in order to determine whether the task is active or not.

The idea is now to define a variable whose value the user can set, write its value to the `eclipse.ini` and evaluate it in the task filter. It is important that the filtered task must not run in the bootrap phase as the correct value from the `eclipse.ini` is not yet available during that phase.

Here you find an [example setup](https://github.com/nittka/oomph-playground/blob/master/setups/proofOfConcept/useroption.setup), where the user can let Oomph create a file or not via a boolean variable. The `Storage URI` of the `Variable Task` is `scope://Installation` in order to make sure the user is asked again at each installation. Note the three main steps:

1. variable task, defining the choice variable (you are not restricted to boolean variables, but could have enum choices analogous to the target platform values in the Eclipse Projects' Global Variables section)
2. write the variable value to an VM option in an `Eclipse ini` task
3. evaluate that option in the `Filter` of a task not running during bootstrap — if your option is more complicated than a single task (e.g. several resource creation tasks), simply wrap all of them in a `Compound` Task.

It is very important that `value` in the `VariableTask` is not present (this is not the same as value being an *empty string*)! Otherwise, the value is assumed to be known and the user will not be asked on the `Variables` page. Checking this is best done by opening the model as text (this can also be done from the Setup editor's context menu -> Open in Text Editor).

Note, that this solution to user choices is not without drawbacks. If the choice involves a `P2` task, it will only be activated after Eclipse has already been set up, so an additional restart is required. 
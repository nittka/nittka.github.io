---
tags: ["Xtext"]
excerpt: |
  Guards may help you to make your Xtext grammar more readable.
  They allow you to enable or disable alternatives without having to copy rules.
---
The following small example model illustrates the usage of guards in Xtext ([since 2.9](http://zarnekow.blogspot.de/2015/10/the-xtext-grammar-learned-new-tricks.html)).

```
Model: greetings+=Greeting*;

Greeting:
	'Hello' address=Address<false> '!'
		|
	'Dear' address=Address<true> '!'
;

Address<isFormal>: (<isFormal> title=Title) name=ID;

Title:"Mr"|"Mrs"|"Dr";
```

The first alternative of _Greeting_ calls _Address_ with the parameter value false, the second with true.
Depending on the parameter value the title is required or causes the model to be syntactically invalid.
A rule may have several parameters.
The guard in the rule body need not be a simple parameter, it may be a complex expression of parameters.
Analogously, Calls may combine several parameters.

```
Rule<ruleParam1, ruleParam2>:
	...
	Call<
		callParam2=ruleParam1|ruleParam2, 
		callParam1=!(ruleParam1&ruleParam2)
	>
	...
;
Call<callParam1, callParam2>:
	... 
	(<!callParam1|callParam2> ...)
	...
;
```
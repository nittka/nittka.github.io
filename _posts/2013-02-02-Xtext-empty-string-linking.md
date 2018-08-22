---
title: "Xtext: empty string linking"
tags: ["Xtext", "revive"]
excerpt: Xtext's cross reference mechanism is based on named elements. The out-of-the-box support requires that the (simple) name is not empty - there must be some syntactic element that can be associated with the link (both source and target). Linking empty names may not be a default requirement, but it is not purely academic. This post describes where to hook into Xtext in order to allow empty names.
---
Xtext's cross reference mechanism is based on named elements. The out-of-the-box support requires that the (simple) name is not empty - there must be some syntactic element that can be associated with the link (both source and target). Linking empty names may not be a default requirement, but it is not purely academic. XML QNames allow the namespace prefix as well as the local name to be empty. While working on [Xturtle](https://github.com/AKSW/Xturtle "Xturtle") — an eclipse editor for the RDF serialization format turtle — I came across this use case.

```
@prefix :<http://www.example.org>.
:thing a :thing.
```

The name of the default prefix is empty. Now, if you want the expected editor features like go to declaration, find references or rename refactoring, you kind of need the actual linking.

So here is a list of the main components that need to be adapted. [This project](https://github.com/nittka/pocesl "empty string linking prototype") provides you with a stripped down working example.

### Grammar
In your grammar, you have to make sure that the name an the reference are both mandatory, however the actual string may be empty.

```
Target: "target" name=Name ".";
Link: "link" to=[Target|Name]".";
Name: ID?;
```

### QualifiedName calculation
In the instantiated model, the name attribute value will be null. Your `IQualifiedNameProvider` will have to turn that into an empty name. The default implementation of the `IQualifiedNameConverter` throws an exception for empty names, so that has to be adapted as well.

### Linking
If you don't provide a name in the model, there will be no element in the node model attached to the name.

```
target /*this is a linking target with an empty name*/
/*The problem is, which empty string between the 
keywords target and full stop represents the name*/
/*Xtext cannot know, so empty names are not supported out of the box*/
/*By the way, the same is true for the link.
At which position does the link start?*/
.
```

Having made the features mandatory, there will be a cross reference node, but the linking will not pick it up and create a proxy, as there is no suitable node to attach it to — the corresponding code has to be adapted.

### Hyperlinking
You can now navigate from link to target in the semantic model, however hyperlinking is not working yet. You'll have to tell the framework, from which position in the link actually to jump to the target (for the empty name case).

### ILocationInFileProvider
This service is responsible for calculating significant regions of objects, i.e. which part of the file to reveal and highlight. Again the default implementation is bound to fail if there are no actual nodes for the name element.

### Refactoring
I have not adapted the refactoring component and a first 15 min investigation indicates that quite a bit of work would have to be done.
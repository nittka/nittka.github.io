---
tags: ["Xtext"]
excerpt: With parse rule fragments, you may get rid of redundancy in your Xtext grammar, making it easier to maintain and gain even more control over the inferred meta model.
---
The following small example model illustrates the usage of parse rule fragments in Xtext ([since 2.9](http://zarnekow.blogspot.de/2015/10/the-xtext-grammar-learned-new-tricks.html)). In earlier versions, often you had to repeat patterns — and make changes in all places where the same pattern was used.

```
Class: Modifiers "class" Named "{"
	fields+=Field*
	methods+=Method*
"}";

Field: Modifiers "field" Named Type;

Method: Modifiers "method" Named Type;

fragment Named: name=ID;

fragment Type: "type" type=ID;

fragment Modifiers: 
	(public?="public"?)&
	(protected?="protected"?)&
	(package?="package"?)&
	(static?="static"?)&
	(final?="final"?)
;
```

Note that the calls to `Named` etc. are done without assignment to a feature. If you look at the inferred classes `Field` etc. extend the interface `Named`.

Prior to 2.9 you may have written

```
Named: A|B;
A: name=ID;
B: name=ID;
```

in order to enforce a common supertype for `A` and `B` holding the `name` feature. However, if they share other compatible features, these may — unintentionally — end up in `Named`.
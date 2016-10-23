---
tags: ["Xtext","revive"]
excerpt: A prefix matcher is responsible for filtering candidates in code completion. If the candidate is foo.bar.baz, it is eliminated of the prefix does not start with f. The post suggests a way to retain candidates whose simple name (baz) fits the prefix (e.g. ba).
---
A prefix matcher is responsible for filtering candidates in code completion based on what the user has already entered. Considering qualified names, the user may want to start writing the simple name rather than the fully qualified name (even if the qualified name is necessary at that position.) The `FQNPrefixMatcher` already does that (which was pointed out to me by Sebastian Zarnekow immediately after publishing the original version of this blog post). However, that implementation fails if the simple name starts with a lower case letter. That is for *foo.bar.Baz* everything is as it should be, but for *foo.bar.baz* the prefix b eliminates the candidate (althoug baz starts with b).

This is caused by the `FQNPrefixMatcher` using the "wrong" `LastSegmentFinder` when doing no customisation. For *foo.bar.Baz* it returns *Baz* as expected, but for *foo.bar.baz* it returns *null*. If you don't want that (or if you want to do any other fancy matching) you could bind your own `LastSegmentFinder`; something like

```java
public class VerySimpleLastSegmentFinder implements LastSegmentFinder {

	public String getLastSegment(String fqn, char delimiter) {
		try{
			int index = fqn.lastIndexOf(delimiter)+1;
			return fqn.substring(index);
		}catch(Exception e){
		}
		return fqn;
	}
}
```
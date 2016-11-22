---
tags: ["Xtext"]
excerpt: |
  If you have worked with Xtext, you will know its "Find References" search.
  All elements pointing to a given target are shown in a search view.
  In this post, I want to show how you can reuse much of the Xtext infrastructure in order to present your own search results.
---
Navigation and search with respect to actual references are supported out of the box by Xtext.
The _Go to Declaration_ navigation (F3) can easily be extended to jumping to other calculated locations or opening external files by creating additional hyperlinks in your own `IHyperlinkHelper` implementation. Presenting your own search results in the search view is a bit more complicated. However, knowing the entry points and restrictions, you need very little additional code for achieving that by reusing much of the existing Xtext find-references-infrastructure.

## Use case

Similar to the _Find References_ search, you want to have an action that presents matches for a custom search — model elements located in different files. The search result depends on the position in a given file, where the search action is executed. Typically, you would put the information for determining the matches in the index — otherwise the search would be too expensive.

An academic example would be "Find all entities with the same number of declared methods". This would be a custom action the user can invoke from a location where an entity is defined. You would count the methods of that entity and compare it against the number of methods of other entities — information you stored in the user data of the corresponding `IEObjectDescription`s you created for all entities. Now comes the interesting part of getting those matches to the search view. You can find concise sample code with comments in this [commit](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b) for one of my projects.

## The recipe

In short you need

* a dependency to `org.eclipse.search` in your UI project
* an action / command the user can invoke somehow triggering a handler invoking the actual search
* your own `ReferenceQuery` populating the `ReferenceSearchResult` with `IReferenceDescription`s representing the matches.

```java
NewSearchUI.activateSearchResultView();
NewSearchUI.runQueryInBackground(query);
```

from the [XarchiveSearchHandler#execute](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b#diff-144ce5a5ce42aa96fbfb4767311aba65R56) is the starting point of the actual search. You activate the search view and tell it to execute a query (extending `ReferenceQuery`). Because the search result you calculate will be of type `ReferenceSearchResult` all the presentation of the matches is [magically](https://github.com/eclipse/xtext-eclipse/blob/90f72d5d1a73d336159f9932543289e051e80d4f/org.eclipse.xtext.ui.shared/plugin.xml#L176) done by the Xtext framework.

```java
@Override
public IStatus run(IProgressMonitor monitor) throws OperationCanceledException {
	ReferenceSearchResult result=(ReferenceSearchResult)getSearchResult();
	result.reset();
	internalRun(monitor, result);
	result.finish();
	return (monitor.isCanceled()) ? Status.CANCEL_STATUS : Status.OK_STATUS;
}
```

from the [query class](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b#diff-593bb912d2e2f8b617c90e80b1dcb3f3R31) you derived from `RefernceQuery` makes sure that not the original reference finder is invoked but rather your own search whose matches you then simply feed to the `ReferenceSearchResult`. The [example implementation](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b#diff-593bb912d2e2f8b617c90e80b1dcb3f3R57) iterates over the index entries and creates `IReferenceDescription` to be presented in the view. In the given project there is at most one match per resource. If multiple matches per resource were possible, you would further iterate over the `IEObjectDescriptions`, determine matches and create `IReferenceDescription` on that level.

The actual matching logic is wrapped in separate [class](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b#diff-05dbf4826df6a810791785b4db80e6c0R10)
which is initialized with the search context (e.g. the object where the search was invoked), so it can determine whether there is a match or not.

Note that result labels and the _Open_-action in the search result tree come for free but depend on the URIs you provide, so use URIs pointing to semantic objects for which you have defined a nice label.

## Invoking the search

`NewSearchUI.activateSearchResultView();...` can basically be invoked from anywhere in your UI code. In the example, a classic [plugin.xml](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b#diff-76261c0c7911423c56c9235daa680b10L18) command pattern is used. There is a command definition with a key binding and a handler bound to that command. The [handler](https://github.com/nittka/Xarchive/commit/21e58fa890c354172d889b236ba2b9be5edd6a8b#diff-144ce5a5ce42aa96fbfb4767311aba65R32) (adapted from the original `FindReferenceHandler`) determines the context object, uses it to initialize the query and then starts the search.

A search started from a search dialog would be another option.

## Wrap-up

You have to agree that compared to implementing the entire `ISearchResult`-stack (query, search, custom search view with Open-search result action, etc.), this is very little code. It makes use of the fact, that the infrastructure for presenting `ReferenceSearchResult`s is not restricted to actual _Find References_ searches. Extending the existing classes makes sure that the remaining framework code needs no modifications.

You'll have to live with the tree presentation (resource + model element children) even if there is only one match per resource, if you do not want do dive much deeper.

A search is potentially expensive, so make sure you stop if the `IProgressMonitor` tells you that the operation was cancelled.
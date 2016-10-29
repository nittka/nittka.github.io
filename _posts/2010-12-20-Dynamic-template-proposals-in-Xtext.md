---
tags: ["Xtext","revive"]
excerpt: In this post, I want to briefly hint at a possibility to provide code completion templates (thus allowing template variables and navigation) whose replace text is dynamically calculated.
---
Code templates support the user by predefining frequently used text patterns that would have to be entered manually and allow navigation between fields that need to be filled in. Usually these templates are defined via the corresponding preference page. However, this means that the pattern of a template is *static*.
There are use cases where you might want the replace pattern to be dynamically calculated. Of course this could be achieved using the regular completion proposal calculation. However, here you cannot use template variables and navigation between them by default.
If you want to hook into the template processing rather than modifying regular completion proposals for allowing this type of navigation, here is what you could do.

1) Bind your own `ITemplateProposalProvider` in the UIModule

```java
  @Override
  public Class<? extends ITemplateProposalProvider>
    bindITemplateProposalProvider() {
    return MyTemplateProposalProvieder.class;
  }
```

2) Implement the provider extending the default implementation

```java
public class MyTemplateProposalProvieder extends DefaultTemplateProposalProvider {

  @Inject
  public MyTemplateProposalProvieder(TemplateStore templateStore,
      ContextTypeRegistry registry,
      ContextTypeIdHelper helper) {
    super(templateStore, registry, helper);
  }
  
  @Override
  protected void createTemplates(TemplateContext templateContext, 
      ContentAssistContext context,
      ITemplateAcceptor acceptor) {
    //"regular templates"
    super.createTemplates(templateContext, context, acceptor);

    //add your own
  
    //create a template on the fly
    Template template = new Template("template name", 
        "short description", 
        "uniqueTemplateID",
        "replace pattern with ${template}\n${variables}\n${you}\n${like}", 
        false);//auto-insertable?
  
    //create a proposal
    TemplateProposal tp = createProposal(template, 
        templateContext, 
        context, 
        getImage(template), 
        getRelevance(template));
  
    //make it available
    acceptor.accept(tp);
  }
}
```

In this arguably minimal implementation the template will be suggested at any position (where any template is suggested at all). But normally a template should be suggested only at certain positions. To define those, Xtext uses template context types. Usually, each grammar rule and each keyword gets its  own type. The following code illustrates one way of controlling where your dynamic template is activated. The snippet is based on the domain model example shipped with Xtext. The template is constructed only within an entity where a feature definition (attribute, reference or operation) is expected.

```
public class MyTemplateProposalProvieder extends DefaultTemplateProposalProvider {

  ContextTypeIdHelper helper;

  @Inject
  public MyTemplateProposalProvieder(TemplateStore templateStore, 
      ContextTypeRegistry registry,
      ContextTypeIdHelper helper) {
    super(templateStore, registry, helper);
    this.helper=helper;
  }

  @Inject
  DomainmodelGrammarAccess ga;
  
  @Override
  protected void createTemplates(TemplateContext templateContext, 
      ContentAssistContext context,
      ITemplateAcceptor acceptor) {
    //"regular templates"
    super.createTemplates(templateContext, context, acceptor);

    //calculate the context type id of the Feature rule
    //in the Domainmodel grammar
    String id=helper.getId(ga.getFeatureRule());
    
    //create the template only if that id fits the id of
    //the current template context type
    if(templateContext.getContextType().getId().equals(id)){
      //do the dynamic template construction here
    }
  }
}
```

Note that in this post, we did not actually calculate the pattern of the template dynamically (only then would this customisation make sense). You might argue that the user should be able to modify templates. Well, if you customise regular completion proposals, the user cannot do anything about it either. So look at dynamic templates as regular completion proposals allowing for template variables.
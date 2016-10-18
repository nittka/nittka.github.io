---
tags: ["Eclipse","revive"]
excerpt: Using ISchedulingRules it is fairly easy to enforce only one job of a certain type to be executed at the same time. Not using rules, you can run as many jobs in parallel as Eclipse allows. But what if you want at most 5 jobs running in parallel in order not to freeze the system...?
---
Browsing the web for an answer to the question of how to limit the number of Eclipse jobs run in parallel, I did not find a satisfying answer. I admit, I am not good at browsing. The use case is that the jobs call an external compiler, but too many parallel executions freeze the system. However there are enough system resources to run more than one instance. So what to do?

`ISchedulingRule`s are very useful in order to prevent execution of conflicting jobs - no parallel execution at all (use a rule conflicting with itself for all jobs) or no parallel exection if the same object is affected (use a lock object for determining the conflict as done in `SerialPerObjectRule` of [SchedulingRuleFactory](https://github.com/eclipse/xtext/blob/master/plugins/org.eclipse.xtext.ui/src/org/eclipse/xtext/ui/editor/SchedulingRuleFactory.java)) and so on.

While meditating a bit about the lock object solution, I realized that there is a very simple solution to the problem. In the problematic scenario, there is no real lock object. So we create n artificial (non-)objects (aka queues) where n is the number parallel executions, have corresponding `ISchedulingRule`s and assign them in a cyclic way. Here is the (pseudo-) code (as applied [here](https://github.com/thSoft/elysium/blob/master/org.elysium.ui/src/org/elysium/ui/compiler/NumberedQueueSchedulingRule.java)).

```java
public class NumberedQueueSchedulingRule implements ISchedulingRule {
  private long queueNumber;

  public NumberedQueueSchedulingRule(long queueNumber) {
    this.queueNumber = queueNumber;
  }

  public boolean contains(ISchedulingRule rule) {
    return rule == this;
  }

  public boolean isConflicting(ISchedulingRule rule) {
    if (rule instanceof NumberedQueueSchedulingRule) {
      NumberedQueueSchedulingRule otherRule = (NumberedQueueSchedulingRule) rule;
      return otherRule.queueNumber == queueNumber;
    }
    return false;
  }
}
```
to be used as follows

```java
...
  private static final AtomicLong JOB_COUNT=new AtomicLong(0);
  private static final int MAX_PARALLEL_JOBS=5;
...
  private void scheduleJob(){
    Job jobToSchedule=new MyJob();
    long queue=JOB_COUNT.incrementAndGet()%MAX_PARALLEL_JOBS;
    ISchedulingRule parallelExecutionRule=new NumberedQueueSchedulingRule(queue);
    jobToSchedule.setRule(parallelExecutionRule);
    jobToSchedule.schedule();
  }
```
In the linked project, the user can change the number of available queues according to her system resources via a preference value.
---
title: GitHub, Fork, Pull Request... and Oomph
tags: ["misc","revive"]
excerpt: Although there are many workflow descriptions for contributions of GitHub projects, I decided to write about mine. This blog post summarizes what I found useful when an Oomph setup is involved.
---
If you want to contribute to a project on GitHub, usually you have no write access to the original repository. There are numerous workflow descriptions for this use case to be found on the web, as a search for "github fork pull request workflow" shows. It all starts with creating a fork in your GitHub account.

If it is a really cool project, it will provide an Oomph setup for getting a potential contributor started in no time. This setup will contain a git clone task - by default cloning the original repository and not your fork, on which you want to work. If the setup is authored properly, the git clone task will make use of the IncudedChoices annotation. In this case, rather than selecting the protocol for the original repository on the variable page of the Oomph setup process, you simply paste the clone URL of your fork.

As a consequence, your local clone will not know the original repository but only your fork, so you have to configure an additional remote (open the Git Repositories View -> in your local clone, open the context menu of "Remotes" -> Create Remote -> Remote name: "upstream" + configure fetch -> change URI to that of the orignial repository). In branches -> Remote Tracking you should now see the branches of the original repository as well as those of your fork. Your local repository will now serve as synchronization point between the original repository and your fork.

If the Oomph setup is not properly authored, the git clone URI might be hard coded. In this case, you are still not completely lost. The difference is that you have to configure your fork as remote for pushing...

This is the complete workflow I currently use.

1. fork project
2. instantiate via Oomph as described above or simply clone fork locally
3. configure original repository "upstream" for fetch
4. create new local branch for each development unit (always work on a branch, never master directly) - that way you can easily work on several tasks in parallel
5. push branch to your fork and create a pull request on GitHub (typically from your feature branch to original/master)
6. continue making changes (they will automatically be part of the pull request) until the project owner is happy and merges
7. execute a fetch on Remotes -> upstream (context menu)
8. check out local master branch
9. open the context menu of Branches -> Remote Tracking -> upstream/master and select Merge - this will update your local master
10. push local master to fork - now the fork is in synch with the original repository
11. the local feature branch is obsolete and can be deleted; the one pushed to GitHub can be deleted directly in the pull reqest

There are often discussions whether rebase squash is a good or bad idea. For me it seems a valid option in the above workflow. When creating a feature branch in a fork with the intention of deleting it after a successful pull request, I see little reason not to squash all commits of that branch into a single one. The resulting history of the original repository will be much cleaner, it is much easier to understand what the actual fix is and the chance that someone forks your fork in order to work on that particular very temporary feature branch is small.

Oh, and if the project does not provide an Oomph setup, create one and make that your first pull request.
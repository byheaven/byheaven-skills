# Report shape

Lead with the overall verdict line, for example `QA <change> at <sha>: 2 FAIL, 1 BLOCKED, 14 PASS (3 qualified)`. Then, in this order:

1. **Subject**: sha, CI and deploy runs, environment, how the served build was confirmed to contain the change, carriers and who drove each, all times with their zone.
2. **Items**: one row per item: item, verdict with its qualifier, the raw observable, evidence path. A batch of changes on one deploy gets rows per change.
3. **Regression**: depth, touched features, automated checks run with counts, failures attributed or not to this change, substitutes for features with no map entry.
4. **Feature-map corrections**: `action | command | observable` triples with evidence.
5. **Budgets**: each declared budget and the amount spent.
6. **Test data left**: what the run created or changed per test identity and environment.
7. **Hygiene**: lock times, guard proof, signed-in state before and after, foreground or interference observed, restored environment, secret scan result.
8. **Incidents**: harness noise and QA's own errors, kept apart from product findings.
9. **For the owner to decide**: out-of-scope findings and questions, each with what QA observed and a recommendation. QA files them only when the overlay gives it that route.

Write evidence paths the reader can open; when the reader's client cannot open a local path, attach or link the cited artifacts.

# Readme

This is the current backend for quizzes.

## Plagiarism filter

All of the plagiarism filter-related changes are listed below. These concern the backend, as well as the frontend (package quizzes-dashboard) and database structure.

### Database structure

[db diagram](quizzes_db.png)

Differences to db in production:

* ```check_plagiarism```: whether this quiz has automated plag checking
* ```plagiarism_check_status```: the state of automated plag checking (states: 'not-started', 'in-progress', 'plagiarism-suspected', 'plagiarism-not-suspected')
* ```plagiarism_status```: human-reviewed plagiarism confirmation (states: 'not-decided', confirmed-plagiarism', 'not-plagiarism')
* column ```operation``` in table ```quiz_answer_status_modification``` has new state, 'teacher-reject-plagiarism', to log that an auto-flagged answer has been rejected as plagiarism by teacher


* new table ```plagiarism_source``` is used to communicate potential matching answers to an answer being evaluated for plagiarism. It has these columns:
  * ```target_answer_id```: id of answer being evaluated for plagiarism
  * ```source_answer_id```: id of potential match (but should this refer to quiz_item_answer instead, not quiz_answer?)
  * ```verified```: this has been verified by teacher to be a true match; default false
  * ```confidence```: a numeric assessment of the certainty of this being the correct source



* table ```quiz_answer``` has column plagiarism_sources that refers to the above table
* table ```similarity``` will also be here, not yet added to diagram


### Backend
Routes added:
* ```.get("/:quizId/plagiarism-suspected)``` returns page view of suspected plagiarism cases; this calls ```getPaginatedByQuizId```
* ```.get("/:courseId/count-answers-flagged-as-plagiarism",``` calls ```getFlaggedAsPlagiarismCountsByCourseId```, which  counts plag-flagged answers
* status change operation ```.post("/:answerId/status"``` now calls ```setManualReviewAndPlagiarismStatus```, which logs also plagiarism status changes
* ```.get("/:answerId/plag-sources)``` returns ids of answers that have been listed as sources; this calls 

Models changed to reflect addition of plagiarism feature:
* ```models -> index``` has listing of  ```PlagiarismSource```
* ```plagiarism_source``` model added
* ```quiz_answer``` has types  ```PlagiarismStatus```, ```PlagiarismCheckStatus``` and ```PlagiarismSources```
* ```quiz_answer_status_modification``` and ```quiz``` modified to reflect db changes


### Frontend
* Class ```PlagiarismSources``` added. This is very simple for now, it takes an answer id as a parameter and displays the source answers' ItemAnswers.
* Action buttons (Accept, reject etc.) under answers now render conditionally, depending on whether the answer has plagiarism_status 'plagiarism-suspected' or not.
* Also for plag-suspected answers, the "Show/Hide source answers" button appears
* Types and services added / modified to reflect db and route changes


### Future development needs

#### Migration files missing for some of the tables
* Migration files should be added.

#### Bug: Plagiarism status isn't logged correctly yet
* Button functions need to be debugged.

#### Bug: Course is sometimes undefined
* For example, on the header on top of the page

#### Bug: Plagiarism-flagged answers are still displayed in the manual review tab
* These should be taken out, so that manual review only shows answers marked as status: 'manual-review' and plagiarism_status NOT 'plagiarism-suspected' 

#### Bug: Button for suspected plagiarism in course overview is too wide
* This clogs the box

#### Confidence score for the entire answer
* This would probably be the highest confidence number of potential matches for that answer

#### Possibility to mark a plagiarism source as correct match
* This would be good data for us in the future, considering machine-learning possibilities

#### Possibility to mass review entries

#### Read more and load more buttons to plagiarism sources?
* Read more for long sources
* Right now, the first 10 sources are fetched and displayed, and there's no possibility to load more. In the future, fewer results could be displayed by default and there could be a button to load more.

#### Handling of repeat offenders
* Possibility to flag user who has committed plagiarism repeatedly, so that action against more plagiarism could be taken

#### Confidence score display missing
* The source card should display plagiarism confidence numbers
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
* 


### Frontend


### Future development needs

#### Confidence score for the entire answer
* this would probably be the highest confidence number of potential matches for that answer
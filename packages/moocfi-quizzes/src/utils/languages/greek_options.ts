import { SingleLanguageLabels } from "./index"

const greekLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Ενδεικτική απάντηση",
    userAnswerLabel: "Η απάντησή σας",
    currentNumberOfWordsLabel: "Λέξεις",
    textFieldLabel: "Η απάντησή σας",
    conformToLimitsToSubmitLabel:
      "Για να μπορέσετε να υποβάλετε την απάντησή σας, βεβαιωθείτε ότι τηρεί τα όρια λέξεων",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Η απάντησή σας δεν θα πρέπει να υπερβαίνει τις ${max} λέξεις`
      }

      if (!max) {
        return `Η απάντησή σας θα πρέπει να είναι τουλάχιστον ${min} λέξεις`
      }
      return `Η απάντησή σας θα πρέπει να είναι από ${min} έως ${max} λέξεις`
    },
  },
  open: {
    placeholder: "Απάντηση",
    userAnswerLabel: "Η απάντησή σας",
    feedbackForSuccess: "Η απάντησή σας είναι λάθος",
    feedbackForFailure: "Η απάντησή σας είναι σωστή",
  },
  peerReviews: {
    loadingLabel: "Φόρτωση",
    chooseButtonLabel: "Επιλογή",
    unselectButtonLabel: "Ακύρωση επιλογής",
    chooseEssayInstruction: "Επιλέξτε μία επιλογή προς αξιολόγηση",
    chosenEssayInstruction: "Αξιολογήστε την απάντηση που επιλέξατε",
    givenPeerReviewsLabel: "Παρασχεθείσες αξιολογήσεις άλλων συμμετεχόντων",
    noPeerAnswersAvailableLabel:
      "Δεν υπάρχουν διαθέσιμες για αξιολόγηση απαντήσεις άλλων συμμετεχόντων",
    reportAsInappropriateLabel: "Αναφορά ως ανεπιθύμητη αλληλογραφία",
    submitPeerReviewLabel: "Υποβολή αξιολόγησης",
    peerReviewsCompletedInfo:
      "Έχετε παράσχει επαρκή αριθμό αξιολογήσεων άλλων συμμετεχόντων",
    giveExtraPeerReviews:
      "Έχετε παράσχει τον απαιτούμενο αριθμό αξιολογήσεων για άλλους συμμετέχοντες. Εάν παράσχετε περισσότερες αξιολογήσεις για άλλους συμμετέχοντες, η απάντησή σας θα αξιολογηθεί πιο γρήγορα!",
    giveExtraPeerReviewsQuizConfirmed:
      "Μπορείτε να παράσχετε και άλλες αξιολογήσεις για να βοηθήσετε άλλους συμμετέχοντες",
    displayPeerReview: "Αξιολογήστε απαντήσεις άλλων συμμετεχόντων",
    hidePeerReviewLabel: "Απόκρυψη",
    essayQuestionAnswerTextBoxLabel: "Γράψτε αξιολόγηση",
    optionLabel: "Επιλογή",
    answerRejected: "Η απάντησή σας απορρίφθηκε",
    answerFlaggedAsSpam:
      "Η απάντησή σας αναφέρθηκε ως ανεπιθύμητη αλληλογραφία",
    answerConfirmed: "Η απάντησή σας έγινε δεκτή!",
    manualReview:
      "Η απάντησή σας αξιολογείται από το προσωπικό του κύκλου μαθημάτων",
    peerReviewGroupTitle: "Ερωτήσεις αξιολόγησης",
    peerReviewLikertDetails:
      "Αξιολογήστε κάθε πρόταση στην κλίμακα 1 έως 5. Το 1 σημαίνει σοβαρή διαφωνία, το 5 σημαίνει απόλυτη συμφωνία.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel:
      "Η μέση βαθμολογία των αξιολογήσεων που λήφθηκαν είναι",
    detailedViewLabel: "Όλες οι αξιολογήσεις που έλαβε η απάντησή σας",
    errorLabel:
      "Παρουσιάστηκε σφάλμα κατά την εμφάνιση των αξιολογήσεων που λήφθηκαν από άλλους συμμετέχοντες. Δοκιμάστε να ξαναφορτώσετε τη σελίδα.",
    loadingLabel:
      "Γίνεται φόρτωση των αξιολογήσεων που λήφθηκαν από άλλους συμμετέχοντες...",
    noPeerReviewsReceivedlabel:
      "Η απάντησή σας δεν έχει λάβει ακόμη αξιολογήσεις από άλλους συμμετέχοντες",
    noSupportForQuestionTypeLabel:
      "Δεν υποστηρίζεται αυτό το είδος απάντησης αξιολόγησης από άλλους συμμετέχοντες",
    numberOfPeerReviewsText: n =>
      `Η απάντησή σας έχει λάβει ${n} αξιολόγηση/-ήσεις από άλλους συμμετέχοντες`,
    summaryViewLabel: "Ληφθείσες αξιολογήσεις από άλλους συμμετέχοντες:",
    toggleButtonExpandLabel:
      "Εμφάνιση όλων των αξιολογήσεων που λήφθηκαν από άλλους συμμετέχοντες",
    toggleButtonShrinkLabel: "Απόκρυψη αξιολογήσεων από άλλους συμμετέχοντες",
    peerReviewLabel: "Αξιολόγηση από άλλους συμμετέχοντες",
    peerReviewReceived: "Έχετε λάβει νέα αξιολόγηση από άλλους συμμετέχοντες",
    peerReviewReceivedFor: (title: string) =>
      `Έχετε λάβει νέα αξιολόγηση από άλλους συμμετέχοντες για την άσκηση ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Η απάντηση τύπου '${itemType}' δεν υποστηρίζεται.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Επιλέξτε τη σωστή απάντηση",
    chooseAllSuitableOptionsLabel: "Επιλέξτε όλα όσα ισχύουν",
    answerCorrectLabel: "Σωστό",
    answerIncorrectLabel: "Λάθος",
  },
  stage: {
    answerStageLabel: "Απάντηση στην άσκηση",
    givingPeerReviewsStageLabel: "Παροχή αξιολογήσεων για άλλους συμμετέχοντες",
    receivingPeerReviewsStageLabel:
      "Λήψη αξιολογήσεων από άλλους συμμετέχοντες",
    evaluationStageLabel: "Εν αναμονή βαθμολόγησης",
  },
  general: {
    pastDeadline: "Δεν μπορείτε να δώσετε πλέον απάντηση σε αυτή την άσκηση",
    answerMissingBecauseQuizModifiedLabel:
      "Η ερώτηση δεν απαντήθηκε. Το τεστ πιθανόν τροποποιήθηκε μετά την απάντησή σας.",
    submitButtonLabel: "Υποβολή",
    errorLabel: "Σφάλμα",
    loginToViewPromptLabel: "Συνδεθείτε για να δείτε την άσκηση",
    loginToAnswerPromptLabel: "Συνδεθείτε για να απαντήσετε στην άσκηση",
    loadingLabel: "Φόρτωση",
    answerCorrectLabel: "Η απάντηση είναι σωστή",
    alreadyAnsweredLabel: "Έχετε ήδη απαντήσει",
    answerIncorrectLabel: "Η απάντηση είναι λάθος",
    kOutOfNCorrect: (k, n) => `σωστές απαντήσεις σε σύνολο ${k}/${n} `,
    pointsAvailableLabel: "Διαθέσιμοι βαθμοί για την άσκηση",
    pointsReceivedLabel: "Βαθμοί",
    incorrectSubmitWhileTriesLeftLabel:
      "Η απάντηση δεν ήταν απολύτως σωστή. Δοκιμάστε ξανά!",
    triesRemainingLabel: "Προσπάθειες που απομένουν",
    quizLabel: "Τεστ",
    pointsLabel: "Βαθμοί",
    triesNotLimitedLabel: "Ο αριθμός των προσπαθειών δεν είναι περιορισμένος",
    submitGeneralFeedbackLabel: "Υποβλήθηκε",
    submitButtonAlreadyAnsweredLabel: "Απαντήθηκε",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Για να λάβει βαθμούς η απάντηση πρέπει να είναι απολύτως σωστή"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Απαντήθηκε",
    unanswered: "Αναπάντητη",
    rejected: "Η απάντησή σας απορρίφθηκε",
    progressUpdated:
      "Η πρόοδος όσον αφορά την ολοκλήρωση του κύκλου μαθημάτων ενημερώθηκε",
    answerConfirmed: "Η απάντησή σας επιβεβαιώθηκε!",
    answerConfirmedFor: (title: string) =>
      `Η απάντησή σας στην άσκηση ${title} επιβεβαιώθηκε!`,
    courseCompleted: "Ολοκληρώσατε τον κύκλο μαθημάτων!",
  },
  error: {
    submitFailedError:
      "Δεν ήταν δυνατή η λήψη δεδομένων σχετικά με την πρόοδο όσον αφορά την ολοκλήρωση του κύκλου μαθημάτων. Ξαναδοκιμάστε αργότερα.",
    quizLoadFailedError: "Δεν ήταν δυνατή η φόρτωση της άσκησης",
    progressFetchError:
      "Δεν ήταν δυνατή η λήψη δεδομένων σχετικά με την πρόοδο όσον αφορά την ολοκλήρωση του κύκλου μαθημάτων. Ξαναδοκιμάστε αργότερα.",
    submitSpamFlagError: "Δεν ήταν δυνατή η αναφορά ανεπιθύμητης αλληλογραφίας",
    fetchReviewCandidatesError:
      "Παρουσιάστηκε σφάλμα κατά την ανάκτηση απαντήσεων για αξιολόγηση από άλλους συμμετέχοντες. Ξαναδοκιμάστε αργότερα.",
  },
}

export default greekLabels

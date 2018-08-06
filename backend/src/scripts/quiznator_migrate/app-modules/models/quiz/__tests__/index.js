const expect = require("expect")

const databaseUtils = require("app-modules/test-utils/database")

const Quiz = require("../index")

describe("Quiz model", () => {
  before(databaseUtils.connect)

  it("should clone quizzes", () => {
    const essay = new Quiz({
      type: "ESSAY",
      title: "Essay",
      userId: "57dfce0ff735bb120f445080",
      createdAt: new Date(+new Date() - 60 * 60 * 1000).toString(),
      updatedAt: new Date(+new Date() - 60 * 60 * 1000).toString(),
    })

    return essay
      .save()
      .then(() => {
        return Quiz.clone({
          query: { type: "ESSAY" },
          newAttributes: { tags: ["cloned"] },
        })
      })
      .then(() => {
        return Quiz.find({ tags: ["cloned"] })
      })
      .then(quizzes => {
        expect(quizzes.length).toBe(1)

        const quiz = quizzes[0]

        expect(quiz.title).toBe("Essay")
        expect(quiz.createdAt.toString()).toNotBe(essay.createdAt.toString())
        expect(quiz.updatedAt.toString()).toNotBe(essay.updatedAt.toString())
      })
  })

  it("should update refering ids for cloned quizzes if refered quiz is cloned", () => {
    const essay = new Quiz({
      type: "ESSAY",
      title: "Essay",
      tags: ["testing"],
      userId: "57dfce0ff735bb120f445080",
    })

    let peerReview

    return essay
      .save()
      .then(() => {
        peerReview = new Quiz({
          type: "PEER_REVIEW",
          title: "Peer review",
          tags: ["testing"],
          userId: "57dfce0ff735bb120f445080",
          data: {
            quizId: essay._id.toString(),
          },
        })

        return peerReview.save()
      })
      .then(() => {
        return Quiz.clone({
          query: {
            tags: { $in: ["testing"] },
          },
          newAttributes: {
            tags: ["cloned"],
          },
        })
      })
      .then(() => {
        return Quiz.find({ tags: ["cloned"] })
      })
      .then(quizzes => {
        expect(quizzes.length).toBe(2)

        const clonedEssay = quizzes.find(quiz => quiz.type === "ESSAY")
        const clonedPeerReview = quizzes.find(
          quiz => quiz.type === "PEER_REVIEW",
        )

        expect(clonedPeerReview.data.quizId.toString()).toBe(
          clonedEssay._id.toString(),
        )
      })
  })

  afterEach(databaseUtils.clean)

  after(databaseUtils.disconnect)
})

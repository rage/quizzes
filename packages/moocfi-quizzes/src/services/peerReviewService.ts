import axios from "axios"
import BASE_URL from "../config"
import {
  QuizAnswer,
  PeerReviewAnswer,
  UserQuizState,
  IReceivedPeerReview,
} from "../modelTypes"

export const getPeerReviewInfo = async (
  quizId: string,
  languageId: string,
  accessToken: string,
  address?: string,
): Promise<QuizAnswer[]> => {
  const response = await axios.get(
    `${address || BASE_URL}/api/v1/quizzes/peerreview/${quizId}/${languageId}`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

export const getReceivedReviews = async (
  quizAnswerId: string,
  accessToken: string,
  address?: string,
): Promise<Array<IReceivedPeerReview>> => {
  const response = await axios.get(
    `${address ||
      BASE_URL}/api/v1/quizzes/peerreview/received/${quizAnswerId}?stripped=true`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )

  return response.data
}

type SpamFlag = {
  id: string
  userId: number
  quizAnswerId: number
}

export const postSpamFlag = async (
  quizAnswerId: string,
  accessToken: string,
  address?: string,
): Promise<SpamFlag> => {
  let response = await axios.post(
    `${address || BASE_URL}/api/v1/quizzes/spamflag`,
    { quizAnswerId },
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

export const postPeerReview = async (
  peerReview: PeerReviewAnswer,
  accessToken: string,
  address?: string,
): Promise<{ userQuizState: UserQuizState }> => {
  const response = await axios.post(
    `${address || BASE_URL}/api/v1/quizzes/peerreview`,
    peerReview,
    { headers: { authorization: `Bearer ${accessToken}` } },
  )
  return response.data
}

export const mockGetReceivedReviews = async (
  some: any,
): Promise<Array<IReceivedPeerReview>> => {
  const data = [
    {
      id: "dd47fb36-a399-4772-94a2-fc5e449af8ba",
      peerReviewCollectionId: "b1630ac6-8d42-426c-a1f8-ea7d06bd805c",
      createdAt: new Date("2019-11-26T11:29:11.817Z"),
      answers: [
        {
          peerReviewId: "dd47fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "4d2a04c0-7391-4467-910a-48bba4145adb",
          value: 4,
          text: null,
        },
        {
          peerReviewId: "dd47fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "ad5ae4d0-8a0c-438a-be76-e528a02c83d2",
          value: 3,
          text: null,
        },
        {
          peerReviewId: "dd47fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "ae0c7a27-8a99-4a2d-8670-e6135fb06c29",
          value: 5,
          text: null,
        },
        {
          peerReviewId: "dd47fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "aee1da29-8b43-48d9-9509-e72d6f5e2b52",
          value: null,
          text:
            "I thought your answer was particularly insightful. Let's make this line longer.\nThere should\nhave been \na few line breaks.",
        },
      ],
    },
    {
      id: "d147fb36-a399-4772-94a2-fc5e449af8ba",
      peerReviewCollectionId: "b1630ac6-8d42-426c-a1f8-ea7d06bd805c",
      createdAt: new Date("2019-11-25T11:29:11.817Z"),
      answers: [
        {
          peerReviewId: "d147fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "4d2a04c0-7391-4467-910a-48bba4145adb",
          value: 4,
          text: null,
        },
        {
          peerReviewId: "d147fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "ad5ae4d0-8a0c-438a-be76-e528a02c83d2",
          value: 2,
          text: null,
        },
        {
          peerReviewId: "d147fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "ae0c7a27-8a99-4a2d-8670-e6135fb06c29",
          value: 3,
          text: null,
        },
        {
          peerReviewId: "d147fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "aee1da29-8b43-48d9-9509-e72d6f5e2b52",
          value: null,
          text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fringilla et ipsum nec tempus. Fusce urna ante, sollicitudin quis sapien id, condimentum lobortis mauris. Pellentesque ac dignissim arcu. Vestibulum eget orci at enim pellentesque tristique. Integer in ipsum rhoncus, bibendum enim vitae, lacinia turpis. Aliquam malesuada efficitur nulla id tincidunt. Curabitur velit metus, ullamcorper sit amet nisi vel, lobortis imperdiet lorem. Aliquam commodo ligula tincidunt neque dapibus, sit amet rutrum velit congue. Nulla congue ultricies nisl. Quisque vehicula arcu auctor, dapibus risus eu, mattis augue. Nulla ornare, nunc ac fermentum faucibus, odio urna tincidunt purus, vel blandit nisl orci non nulla. Ut congue est quis magna fringilla volutpat.\nSed porta lorem orci, non maximus erat volutpat at. Nullam tincidunt maximus ultricies. Maecenas tempor, velit mattis tristique egestas, tellus turpis venenatis nunc, vitae varius dolor magna quis est. Sed tempor elementum lorem quis consequat. Nunc in tincidunt magna, at suscipit quam. Duis vitae mauris id ipsum lobortis tincidunt ut et risus. Morbi volutpat arcu sit amet eros facilisis, sit amet sagittis lorem egestas. Fusce in scelerisque velit. Aenean dictum molestie commodo. Donec consectetur molestie velit, a posuere quam tempus a. Donec facilisis condimentum sem non tristique.`,
        },
      ],
    },
    {
      id: "d247fb36-a399-4772-94a2-fc5e449af8ba",
      peerReviewCollectionId: "b1630ac6-8d42-426c-a1f8-ea7d06bd805c",
      createdAt: new Date("2019-11-27T11:29:11.817Z"),
      answers: [
        {
          peerReviewId: "d247fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "4d2a04c0-7391-4467-910a-48bba4145adb",
          value: 4,
          text: null,
        },
        {
          peerReviewId: "d247fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "ad5ae4d0-8a0c-438a-be76-e528a02c83d2",
          value: 2,
          text: null,
        },
        {
          peerReviewId: "d247fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "ae0c7a27-8a99-4a2d-8670-e6135fb06c29",
          value: 5,
          text: null,
        },
        {
          peerReviewId: "d247fb36-a399-4772-94a2-fc5e449af8ba",
          peerReviewQuestionId: "aee1da29-8b43-48d9-9509-e72d6f5e2b52",
          value: null,
          text:
            "The answer was pretty okay. I would have written a better one, shame you wont probably see it.",
        },
      ],
    },
  ]

  return new Promise(resolve => {
    setTimeout(() => resolve(data), 3000)
  })
}

import axios from "axios"
import { Quiz } from "../../../common/src/models/quiz"

export const getQuizzes = async () => {
  // const response = await axios.get("http://localhost:3000/api/v1/quizzes/")
  return [mock]
}

const mock = {
  id: "459d8721-2c4f-4024-8507-239967f0a7c2",
  courseId: "21356a26-7508-4705-9bab-39b239862632",
  part: 4,
  section: 2,
  deadline: null,
  open: null,
  excludedFromScore: false,
  createdAt: "2018-05-04T13:44:15.228Z",
  updatedAt: "2018-05-17T10:13:31.250Z",
  __course__: {
    id: "21356a26-7508-4705-9bab-39b239862632",
    createdAt: "2018-10-03T12:56:51.776Z",
    updatedAt: "2018-10-03T12:56:51.776Z",
    organization: null,
    languages: [
      {
        id: "en_US",
        country: "United States",
        name: "English",
        createdAt: "2018-10-03T12:56:51.736Z",
        updatedAt: "2018-10-03T12:56:51.736Z",
      },
      {
        id: "fi_FI",
        country: "Finland",
        name: "Finnish",
        createdAt: "2018-10-03T12:56:51.726Z",
        updatedAt: "2018-10-03T12:56:51.726Z",
      },
    ],
  },
  texts: [
    {
      quizId: "459d8721-2c4f-4024-8507-239967f0a7c2",
      languageId: "en_US",
      title: " Exercise 14: Customers who bought similar products",
      body:
        "<p>In this exercise, we will build a simple recommendation system for an online shopping application where the users' purchase history is recorded and used to predict which products the user is likely to buy next.</p> <p>We have data from six users. For each user, we have recorded their recent shopping history of four items and the item they bought after buying these four items:</p> <div class=\"tablewrapper\"> <table> <tr> <th>User</th> <th colspan=4 >Shopping History</th> <th>Purchase</th> </tr> <tr> <td>Sanni</td><td>boxing gloves</td><td>Moby Dick (novel)</td><td>headphones</td><td>sunglasses</td><td>coffee beans</td> </tr> <tr> <td>Jouni</td><td>t-shirt</td><td>coffee beans</td><td>coffee maker</td><td>coffee beans</td><td>coffee beans</td> </tr> <tr> <td>Janina</td><td>sunglasses</td><td>sneakers</td><td>t-shirt</td><td>sneakers</td><td>ragg wool socks</td> </tr> <tr> <td>Henrik</td><td>2001: A Space Odyssey (dvd)</td><td>headphones</td><td>t-shirt</td><td>boxing gloves</td><td>flip flops</td> </tr> <tr> <td>Ville</td><td>t-shirt</td><td>flip flops</td><td>sunglasses</td><td>Moby Dick (novel)</td><td>sunscreen</td> </tr> <tr> <td>Teemu</td><td>Moby Dick (novel)</td><td>coffee beans</td><td>2001: A Space Odyssey (dvd)</td><td>headphones</td><td>coffee beans</td> </tr> </table> </div> <p>The most recent purchase is the one in the rightmost column, so for example, after buying a t-shirt, flip flops, sunglasses, and Moby Dick (novel), Ville bought sunscreen. Our hypothesis is that after buying similar items, other users are also likely to buy sunscreen.</p> <p>To apply the nearest neighbor method, we need to define what we mean by nearest. This can be done in many different ways, some of which work better than others. Let’s use the shopping history to define the similarity (“nearness”) by counting how many of the items have been purchased by both users. </p> <p>For example, users Ville and Henrik have both bought a t-shirt, so their similarity is 1. Note that flip flops doesn't count because we don't include the most recent purchase when calculating the similarity — it is reserved for another purpose.</p> <p>Our task is to predict the next purchase of customer Travis who has bought the following products:</p> <table> <tr> <th>User</th> <th colspan=4 >Shopping History</th> <th>Purchase</th> </tr> <tr> <td>Travis</td><td>green tea</td><td>t-shirt</td><td>sunglasses</td><td>flip flops</td><td>?</td> </tr> </table> <p>You can think of Travis being our test data, and the above six users make our training data.</p> <p><strong>Proceed as follows:</strong></p> <ol> <li>Calculate the similarity of Travis relative to the six users in the training data (done by adding together the number of similar purchases by the users).</li> <li>Having calculated the similarities, identify the user who is most similar to Travis by selecting the largest of the calculated similarities.</li> <li>Predict what Travis is likely purchase next by looking at the most recent purchase (the rightmost column in the table) of the most similar user from the previous step.</li> </ol>",
      submitMessage: null,
      createdAt: "2018-05-04T13:44:15.228Z",
      updatedAt: "2018-05-17T10:13:31.250Z",
    },
    {
      quizId: "459d8721-2c4f-4024-8507-239967f0a7c2",
      languageId: "fi_FI",
      title: "keppi",
      body: "koppi",
    },
  ],
  peerReviewQuestions: [],
  items: [
    {
      id: "f37bf692-1ae0-47e1-bc3c-9746afc6da23",
      quizId: "459d8721-2c4f-4024-8507-239967f0a7c2",
      type: "open",
      order: 1,
      validityRegex: "^sun[- ]*screen",
      formatRegex: null,
      createdAt: "2018-05-04T13:44:15.228Z",
      updatedAt: "2018-05-17T10:13:31.250Z",
      texts: [
        {
          quizItemId: "f37bf692-1ae0-47e1-bc3c-9746afc6da23",
          languageId: "en_US",
          title: "What is the predicted purchase for Travis? ",
          body: null,
          successMessage: null,
          failureMessage: null,
          createdAt: "2018-10-03T13:19:48.600Z",
          updatedAt: "2018-10-03T13:19:48.600Z",
        },
      ],
      options: [],
    },
    {
      id: "faa08ed1-1baa-4575-af5b-9bb6c9ab339a",
      quizId: "459d8721-2c4f-4024-8507-239967f0a7c2",
      type: "open",
      order: 0,
      validityRegex: "^(ville|vikke){1}",
      formatRegex: null,
      createdAt: "2018-05-04T13:44:15.228Z",
      updatedAt: "2018-05-17T10:13:31.250Z",
      texts: [
        {
          quizItemId: "faa08ed1-1baa-4575-af5b-9bb6c9ab339a",
          languageId: "en_US",
          title: "Who is the user most similar to Travis? ",
          body: null,
          successMessage: null,
          failureMessage: null,
          createdAt: "2018-10-03T13:19:48.600Z",
          updatedAt: "2018-10-03T13:19:48.600Z",
        },
      ],
      options: [],
    },
  ],
  __has_course__: true,
}

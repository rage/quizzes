import React, { Component } from "react"
import { Button, Typography } from "@material-ui/core"
import Essay from "./Essay"
import MultipleChoice from "./MultipleChoice"

const mapTypeToComponent = {
  essay: Essay,
  "multiple-choice": MultipleChoice,
}

class Quiz extends Component {
  state = {
    data: undefined,
  }

  async componentDidMount() {
    const { id, accessToken } = this.props
    // fetch
    this.setState({
      data: data
    })
  }

  render() {
    if (!this.state.data) {
      return <div>Loading</div>
    }
    return (
      <div>
        <Typography variant="h4">{this.state.data.texts[0].title}</Typography>
        {
          // this.props.accessToken
            true
            ? <div>
              <Typography dangerouslySetInnerHTML={{ __html: this.state.data.texts[0].body }} />
              {this.state.data.items.map(item => {
                const ItemComponent = mapTypeToComponent[item.type]
                return <ItemComponent key={item.id} />
              })}
            </div>
            : <div>login to answer</div>
        }
      </div>
    )
  }
}

const data = {
  "id": "3c954097-268f-44bf-9d2e-1efaf9e8f122",
  "courseId": "21356a26-7508-4705-9bab-39b239862632",
  "part": 1,
  "section": 3,
  "points": 1,
  "deadline": null,
  "open": null,
  "excludedFromScore": false,
  "createdAt": "2018-05-04T12:00:23.606Z",
  "updatedAt": "2018-06-25T17:35:55.073Z",
  "texts": [
    {
      "quizId": "3c954097-268f-44bf-9d2e-1efaf9e8f122",
      "languageId": "en_US",
      "title": "Exercise 4: Definitions, definitions",
      "body": "<p>Which definition of AI do you like best? Perhaps you even have your own definition that is better than all the others?</p>\n<p>Let's first scrutinize the following definitions that have been proposed earlier:</p>\n\n<ul>\n<li>\"cool things that computers can't do\"</li>\n<li>machines imitating intelligent human behavior</li>\n<li>autonomous and adaptive systems\n</li>\n</ul>\n\n<p><strong>Your task:</strong></p>\n<ol>\n<li>Do you think these are good definitions? Consider each of them in turn and try to come up with things that they get wrong - either things that you think should be counted as AI but aren't according to the definition, or vice versa. <strong>Explain your answers by a few sentences per item</strong> (so just saying that all the definitions look good or bad isn't enough).\n\n<li>Also come up with <strong>your own, improved definition</strong> that solves some of the problems that you have identified with the above candidates. Explain with a few sentences how your definition may be better than the above ones.\n</ol>",
      "submitMessage": "<p>There is no right or wrong answer, but here’s what we think:</p> \n\n<p>“Cool things that computers can't do\"</p>  \n\n<p>The good: this adapts to include new problems in the future, captures a wide range of AI such computer vision, natural language processing.</p>\n\n<p>The bad: it rules out any \"solved\" problems, very hard to say what counts as \"cool\".</p>\n\n<p>“Machines imitating intelligent human behavior”</p>  \n\n<p>The good: same as the previous, also imitate is a good word since it doesn't require that the AI solutions should \"be\" intelligent (whatever it means) and instead is is enough to act intelligently.</p>\n\n<p>The bad: the definition is almost self-referential in that it immediately leads to the question what is 'intelligent', also this one is too narrow in the sense that it only includes humanlike intelligent behavior and excludes other forms of intelligence such as so called swarm intelligence (intelligence exhibited by for example ant colonies).</p>\n\n<p>“Autonomous and adaptive systems”</p> \n\n<p>The good: it highlights two main characteristics of AI, captures things like robots, self-driving cars, and so on, also nicely fits machine learning -based AI methods that adapt to the training data.</p>  \n\n<p>The bad: once again, these lead to further questions and the definition of 'autonomous' in particular isn't very clear (is a vacuum cleaner bot autonomous? How about a spam filter?); furthermore, not all AI systems need to be autonomous and we can in fact often achieve much more by combining human and machine intelligence.</p>\n\n",
      "createdAt": "2018-05-04T12:00:23.606Z",
      "updatedAt": "2018-06-25T17:35:55.073Z"
    }
  ],
  "items": [
    {
      "id": "3c954097-268f-44bf-9d2e-1efaf9e8f122",
      "quizId": "3c954097-268f-44bf-9d2e-1efaf9e8f122",
      "type": "essay",
      "order": 0,
      "validityRegex": null,
      "formatRegex": null,
      "multi": false,
      "createdAt": "2018-05-04T12:00:23.606Z",
      "updatedAt": "2018-06-25T17:35:55.073Z",
      "texts": [
        {
          "quizItemId": "3c954097-268f-44bf-9d2e-1efaf9e8f122",
          "languageId": "en_US",
          "title": null,
          "body": null,
          "successMessage": null,
          "failureMessage": null,
          "createdAt": "2019-02-19T09:26:20.777Z",
          "updatedAt": "2019-02-19T09:26:20.777Z"
        }
      ]
    }
  ]
}

export default Quiz

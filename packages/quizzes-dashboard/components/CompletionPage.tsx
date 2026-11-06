import React, { useState } from "react"

import { Field, Form, Formik } from "formik"
import _ from "lodash"
import { useRouter } from "next/router"
import styled from "styled-components"
import useSWR from "swr"
import { number, object } from "yup"

import { Button, TextField, Typography } from "@mui/material"

import {
  CompletionProperties,
  fetchCourseQuizzes,
  updateCourseCompletionProperties,
} from "../services/quizzes"

const FormArea = styled.div`
  margin-bottom: 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const initialCompletionValues: CompletionProperties = {
  // Spam flags
  maxReviewSpamFlags: 0,
  maxSpamFlags: 0,
  // Peer review
  minPeerReviewsGiven: 0,
  minPeerReviewsReceived: 0,
  minReviewAverage: 0,
}

const CompletionPage = () => {
  const router = useRouter()
  const [completionValues, setCompletionValues] =
    useState<CompletionProperties | null>(null)
  const id = router.query.courseId?.toString() ?? ""
  const { data: courseData, error: courseFetchError } = useSWR(
    id ? ["courseQuizzes", id] : null,
    ([, courseId]) => fetchCourseQuizzes(courseId),
  )

  if (courseFetchError) {
    return <p>Something went wrong....</p>
  }

  if (!courseData?.course) {
    return <p>Loading....</p>
  }

  if (!completionValues) {
    setCompletionValues({
      // Spam flags
      maxReviewSpamFlags: courseData.course.maxReviewSpamFlags,
      maxSpamFlags: courseData.course.maxSpamFlags ?? 0,
      // Peer review
      minPeerReviewsGiven: courseData.course.minPeerReviewsGiven ?? 0,
      minPeerReviewsReceived: courseData.course.minPeerReviewsReceived ?? 0,
      minReviewAverage: courseData.course.minReviewAverage ?? 0,
    })
  }

  const handleSubmission = async (
    values: CompletionProperties,
    actions: any,
  ) => {
    const changedProperties: CompletionProperties = {
      ...(values.maxReviewSpamFlags !==
        completionValues?.maxReviewSpamFlags && {
        maxReviewSpamFlags: values.maxReviewSpamFlags,
      }),
      ...(values.maxSpamFlags !== completionValues?.maxSpamFlags && {
        maxSpamFlags: values.maxSpamFlags,
      }),
      ...(values.minPeerReviewsGiven !==
        completionValues?.minPeerReviewsGiven && {
        minPeerReviewsGiven: values.minPeerReviewsGiven,
      }),
      ...(values.minPeerReviewsReceived !==
        completionValues?.minPeerReviewsReceived && {
        minPeerReviewsReceived: values.minPeerReviewsReceived,
      }),
      ...(values.minReviewAverage !== completionValues?.minReviewAverage && {
        minReviewAverage: values.minReviewAverage,
      }),
    }

    if (!_.isEmpty(changedProperties)) {
      // UPDATE IN THE BACKEND
      const newValues = await updateCourseCompletionProperties(
        id,
        changedProperties,
      )

      // UPDATE SYNC VALUES
      await actions.resetForm({
        values,
      })
    }
  }

  return (
    <>
      <Formik
        validationSchema={object({
          // Spam flags
          maxReviewSpamFlags: number().min(0),
          maxSpamFlags: number().min(0),
          // Peer reviews,
          minPeerReviewsGiven: number().min(0),
          minPeerReviewsReceived: number().min(0),
          minReviewAverage: number().min(0),
        })}
        initialValues={completionValues ?? initialCompletionValues}
        onSubmit={(values, actions) => {
          handleSubmission(values, actions)
        }}
      >
        {({ errors, isValidating, dirty }) => (
          <Form>
            <FormArea>
              <Typography variant="h4"> Spam flags </Typography>
              <Field
                fullWidth
                name="maxSpamFlags"
                type="number"
                as={TextField}
                variant="standard"
                label="maxSpamFlags"
                error={errors.maxSpamFlags}
                helperText={errors.maxSpamFlags}
              />
              <Field
                fullWidth
                name="maxReviewSpamFlags"
                type="number"
                as={TextField}
                variant="standard"
                label="maxReviewSpamFlags"
                error={errors.maxReviewSpamFlags}
                helperText={errors.maxReviewSpamFlags}
              />
            </FormArea>

            <FormArea>
              <Typography variant="h4"> Peer Review </Typography>
              {/* minPeerReviewsGiven */}
              <Field
                fullWidth
                name="minPeerReviewsGiven"
                type="number"
                as={TextField}
                variant="standard"
                label="minPeerReviewsGiven"
                error={errors.minPeerReviewsGiven}
                helperText={errors.minPeerReviewsGiven}
              />
              {/* minPeerReviewsReceived */}
              <Field
                fullWidth
                name="minPeerReviewsReceived"
                type="number"
                as={TextField}
                variant="standard"
                label="minPeerReviewsReceived"
                error={errors.minPeerReviewsReceived}
                helperText={errors.minPeerReviewsReceived}
              />
              {/* minReviewAverage */}
              <Field
                fullWidth
                name="minReviewAverage"
                type="number"
                as={TextField}
                variant="standard"
                label="minReviewAverage"
                error={errors.minReviewAverage}
                helperText={errors.minReviewAverage}
              />
            </FormArea>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={!dirty || isValidating}
            >
              Update
            </Button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default CompletionPage

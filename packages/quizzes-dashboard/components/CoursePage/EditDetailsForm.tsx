import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import { Alert } from "@material-ui/lab"
import { FormHelperText, MenuItem } from "@material-ui/core"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import {
  fetchCourseQuizzes,
  getAllLanguages,
  updateCourseProperties,
} from "../../services/quizzes"
import {
  Button,
  Card,
  CardContent,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core"
import styled from "styled-components"
import { object, string } from "yup"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import axios from "axios"
import _ from "lodash"
import { EditCoursePayloadFields } from "./types"

const FieldSet = styled.fieldset`
  display: flex;
  flex-direction: column;
  border: none;

  /* space form fields out */
  > div {
    margin-top: 0.95rem;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`

const Content = styled(CardContent)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 3rem;
`

export const EditDetailsForm = ({
  initialValues,
  courseId,
  languageIds,
}: {
  initialValues: EditCoursePayloadFields
  courseId: string
  languageIds: string[]
}) => {
  const [saved, setSaved] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (values: EditCoursePayloadFields) => {
    const changedProperties = {
      ...(values.title !== initialValues.title && {
        title: values.title,
      }),
      ...(values.abbreviation !== initialValues.abbreviation && {
        abbreviation: values.abbreviation,
      }),
      ...(values.courseId !== initialValues.courseId && {
        courseId: values.courseId,
      }),
      ...(values.languageId !== initialValues.languageId && {
        languageId: values.languageId,
      }),
      ...(values.moocfiId !== initialValues.moocfiId && {
        moocfiId: values.moocfiId,
      }),
    }

    if (!_.isEmpty(changedProperties)) {
      await updateCourseProperties(courseId, changedProperties)
      setSaved(Object.keys(changedProperties).toString())
    }
  }

  return (
    <>
      <Snackbar
        key={saved?.toString()}
        open={saved !== null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSaved(null)}
      >
        <Alert onClose={() => setSaved(null)} severity="success">
          {saved && `${saved} successfully changed!`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={formError !== null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setFormError(null)}
      >
        <Alert onClose={() => setFormError(null)} severity="error">
          {formError}
        </Alert>
      </Snackbar>
      <Formik
        validationSchema={object({
          courseId: string()
            .uuid()
            .required(),
          moocfiId: string().uuid(),
          title: string()
            .required()
            .min(3),
          abbreviation: string()
            .required()
            .min(3),
          languageId: string()
            .required()
            .min(5)
            .max(5),
        })}
        initialValues={initialValues}
        onSubmit={values => handleSubmit(values)}
      >
        {({ errors, isSubmitting, isValidating, values }) => (
          <Form>
            <FieldSet>
              <Field
                name="title"
                type="string"
                as={TextField}
                label="Title"
                error={errors.title}
                helperText={errors.title}
              />
              <FormHelperText error={true} />
              <Field
                name="abbreviation"
                type="string"
                as={TextField}
                label="Abbreviation"
                error={errors.abbreviation}
                helperText={errors.abbreviation}
              />
              {/* <Field
                name="courseId"
                type="string"
                as={TextField}
                label="Id"
                error={errors.courseId}
                helperText={errors.courseId}
              /> */}
              <Field
                name="moocfiId"
                type="string"
                as={TextField}
                label="Moocfi Id"
                error={errors.moocfiId}
                helperText={errors.moocfiId}
              />
              <Field
                name="languageId"
                label="Language Id"
                as={TextField}
                select
              >
                {Array.isArray(languageIds) &&
                  languageIds.map((id: string, index: number) => (
                    <MenuItem key={index} value={id}>
                      {id}{" "}
                    </MenuItem>
                  ))}
              </Field>
            </FieldSet>
            <ButtonWrapper>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isValidating}
              >
                Update
              </Button>
            </ButtonWrapper>
          </Form>
        )}
      </Formik>
    </>
  )
}

/* Wrapper for the form to contain side effects */
const EditCourseDetails = () => {
  const router = useRouter()
  const id = router.query.courseId?.toString() ?? ""
  const [courseData, courseFetchError] = usePromise(
    () => fetchCourseQuizzes(id),
    [id],
  )
  const [languageData, languagesFetchError] = usePromise(
    () => getAllLanguages(),
    [],
  )

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: `${courseData ? courseData.course.title : ""}`,
    },
  ])

  if (courseFetchError || languagesFetchError) {
    return <p>Something went wrong....</p>
  }

  if (!courseData?.course || !languageData) {
    return <p>Loading....</p>
  }

  const initialValues = {
    courseId: courseData?.course.id || undefined,
    moocfiId: courseData?.course.moocfiId || undefined,
    title: courseData?.course.title || undefined,
    abbreviation: courseData?.course.abbreviation || undefined,
    languageId: courseData?.course.languageId || undefined,
  }

  const languageIds = languageData.map(l => l.id) || []

  return (
    <>
      <Card style={{ marginBottom: "2rem" }}>
        <Content>
          <Typography variant="h6">
            Created at: {courseData.course.createdAt.toString().slice(0, 10)}
          </Typography>
          <Typography variant="h6">
            Last updated: {courseData.course.updatedAt.toString().slice(0, 10)}
          </Typography>
        </Content>
      </Card>
      <EditDetailsForm
        initialValues={initialValues}
        courseId={id}
        languageIds={languageIds}
      />
    </>
  )
}

export default EditCourseDetails

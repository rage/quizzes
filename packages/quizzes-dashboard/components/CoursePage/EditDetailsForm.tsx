import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import { fetchCourseQuizzes } from "../../services/quizzes"
import { Button, Snackbar, TextField } from "@material-ui/core"
import styled from "styled-components"
import { object, string } from "yup"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import axios from "axios"
import _ from "lodash"
import { EditCoursePayloadFields } from "./types"
import { Alert } from "@material-ui/lab"

const FieldSet = styled.fieldset`
  display: flex;
  flex-direction: column;
  border: none;

  /* space form fields out */
  > div {
    margin-top: 0.95rem;
  }
`

const ErrorComponent = styled.span`
  color: #ff1744;
  padding: 0.3rem 0;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`

export const EditDetailsForm = ({
  initialValues,
  apiUrl,
}: {
  initialValues: any
  apiUrl: string
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
      await axios
        .post(apiUrl, changedProperties)
        .then(res => setSaved(Object.keys(changedProperties).toString()))
        .catch(e => {
          console.log(e)
        })
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
        {({ errors, isSubmitting, isValidating }) => (
          <Form>
            <FieldSet>
              <Field
                name="title"
                type="string"
                as={TextField}
                label="Title"
                error={errors.title}
              />
              <ErrorMessage name="title" component={ErrorComponent} />
              <Field
                name="abbreviation"
                type="string"
                as={TextField}
                label="Abbreviation"
                error={errors.abbreviation}
              />
              <ErrorMessage name="abbreviation" component={ErrorComponent} />
              <Field
                name="courseId"
                type="string"
                as={TextField}
                label="Id"
                error={errors.courseId}
              />
              <ErrorMessage name="courseId" component={ErrorComponent} />
              <Field
                name="moocfiId"
                type="string"
                as={TextField}
                label="Moocfi Id"
                error={errors.moocfiId}
              />
              <ErrorMessage name="moocfiId" component={ErrorComponent} />
              <Field
                name="languageId"
                type="string"
                as={TextField}
                label="Language Id"
                error={errors.languageId}
              />
              <ErrorMessage name="languageId" component={ErrorComponent} />
            </FieldSet>
            <ButtonWrapper>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isValidating}
              >
                Submit
              </Button>
            </ButtonWrapper>
          </Form>
        )}
      </Formik>
    </>
  )
}

const EditCourseDetails = () => {
  const router = useRouter()
  const id = router.query.courseId?.toString() ?? ""
  const [data, error] = usePromise(() => fetchCourseQuizzes(id), [id])
  const DASHBOARD_API = `/api/v2/dashboard/courses/${id}/`
  const HOST =
    process.env.NODE_ENV === "production"
      ? "https://quizzes.mooc.fi"
      : "http://localhost:3003"

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    { label: `${data ? data.course.title : ""}` },
    { label: `edit` },
  ])

  if (error) {
    return <p>Something went wrong....</p>
  }

  if (!data?.course) {
    return <p>Loading....</p>
  }

  const initialValues = {
    courseId: data?.course.id || undefined,
    moocfiId: data?.course.moocfiId || undefined,
    title: data?.course.title || undefined,
    abbreviation: data?.course.abbreviation || undefined,
    languageId: data?.course.languageId || undefined,
  }

  return (
    <EditDetailsForm
      initialValues={initialValues}
      apiUrl={HOST + DASHBOARD_API + "edit"}
    />
  )
}

export default EditCourseDetails

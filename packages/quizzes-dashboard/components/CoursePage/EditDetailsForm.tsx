import React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import { fetchCourseQuizzes } from "../../services/quizzes"
import {
  Button,
  Card,
  CardContent,
  FormHelperText,
  TextField,
  Typography,
} from "@material-ui/core"
import styled from "styled-components"
import { object, string } from "yup"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"

const FieldSet = styled.fieldset`
  display: flex;
  flex-direction: column;
  /* padding: 1.5rem; */
  border: none;

  /* space form fields out */
  > div {
    margin-top: 0.75rem;
  }
`

const ErrorComponent = styled.span`
  color: #ff1744;
  padding: 0.3rem 0;
`

export const EditDetailsForm = () => {
  const router = useRouter()
  const id = router.query.courseId?.toString() ?? ""
  const [data, error] = usePromise(() => fetchCourseQuizzes(id), [id])
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
    courseId: data?.course.id || null,
    moocfiId: data?.course.moocfiId || null,
    title: data?.course.title || null,
    abbreviation: data?.course.abbreviation || null,
    languageId: data?.course.languageId || null,
  }

  return (
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
      onSubmit={(values, formikHelpers) => {
        return new Promise(res => {
          setTimeout(() => {
            console.log(values)
            console.log(formikHelpers)
            res()
          }, 2000)
        })
      }}
    >
      {({ values, errors, isSubmitting, isValidating }) => (
        <Form>
          <FieldSet>
            <Field
              name="title"
              type="string"
              variant="filled"
              as={TextField}
              label="Title"
              error={errors.title}
            />
            <ErrorMessage name="title" component={ErrorComponent} />
            <Field
              name="abbreviation"
              variant="filled"
              type="string"
              as={TextField}
              label="Abbreviation"
              error={errors.abbreviation}
            />
            <ErrorMessage name="abbreviation" component={ErrorComponent} />
            <Field
              name="courseId"
              type="string"
              variant="filled"
              as={TextField}
              label="Id"
              error={errors.courseId}
            />
            <ErrorMessage name="courseId" component={ErrorComponent} />
            <Field
              name="moocfiId"
              type="string"
              variant="filled"
              as={TextField}
              label="Moocfi Id"
              error={errors.moocfiId}
            />
            <ErrorMessage name="moocfiId" component={ErrorComponent} />
            <Field
              name="languageId"
              type="string"
              variant="filled"
              as={TextField}
              label="Language Id"
              error={errors.languageId}
            />
            <ErrorMessage name="languageId" component={ErrorComponent} />
          </FieldSet>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || isValidating}
          >
            Submit
          </Button>
          <pre>{JSON.stringify(values, null, 4)}</pre>
          <pre>{JSON.stringify(errors, null, 4)}</pre>
        </Form>
      )}
    </Formik>
  )
}

export default EditDetailsForm

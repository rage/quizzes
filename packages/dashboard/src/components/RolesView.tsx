import * as React from "react"
import { connect } from "react-redux"
import { addRoles } from "../store/user/actions"

class RolesView extends React.Component<any, null> {
  public componentDidMount() {
    if (!this.props.user.accessToken) {
      addRoles()
    }
  }

  public render() {
    const user = this.props.user
    if (!user.administrator && (!user.roles || user.roles.length < 1)) {
      return "No roles"
    }

    if (user.administrator) {
      return (
        <div>You are an administrator with every permission imaginable</div>
      )
    }

    return (
      <ul>
        {this.props.user.roles.map(role => (
          <li key={role.courseId + role.role}>
            {`Role: ${role.role} on course ${role.courseTitle}`}
          </li>
        ))}
      </ul>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  }
}

export default connect(
  mapStateToProps,
  { addRoles },
)(RolesView)

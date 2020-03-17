import { List, ListItem, Typography } from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { addRoles } from "../store/user/actions"

class RolesView extends React.Component<any, any> {
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
      <List>
        {this.props.user.roles.map(role => (
          <ListItem key={role.courseId + role.role}>
            <Typography variant="body1">
              <span style={stylingObjectForTextEmphasis}>
                {role.role + " "}
              </span>
              {` on course `}
              <span style={stylingObjectForTextEmphasis}>
                {" " + role.courseTitle}
              </span>
            </Typography>
          </ListItem>
        ))}
      </List>
    )
  }
}

const stylingObjectForTextEmphasis = {
  fontWeight: "bold" as "bold",
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

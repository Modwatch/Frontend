import { h, Component } from "preact";

import * as types from "../types";

const notificationsWrapperPseudo = {
  content: "",
  width: "10px",
  position: "absolute",
  top: 0,
  height: "100%",
  borderTop: `3px solid`,
  borderBottom: `3px solid`,
  boxSizing: "border-box",
  opacity: "inherit"
};

const styles = {
  notificationsWrapperBefore: {
    ...notificationsWrapperPseudo,
    left: 0,
    borderLeft: `3px solid`
  },
  notificationsWrapperAfter: {
    ...notificationsWrapperPseudo,
    right: 0,
    borderRight: `3px solid`
  },
  error: {
    borderColor: "#e45649",
    color: "#e45649"
  },
  notification: {
    position: "relative",
    padding: "7px 10px",
    margin: "5px 0",
    opacity: 1,
    transition: "opacity 0.3s ease",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    cursor: "pointer"
  },
  removing: {
    opacity: 0.01
  },
  softDelete: {
    display: "none",
    zIndex: -1
  }
};

export default class Notification extends Component<
  { notification: types.Notification; onRemove(_id: string) },
  {
    removingTimeout?: number;
    removeTimeout?: number;
    removing: boolean;
  }
> {
  state = {
    removingTimeout: undefined,
    removeTimeout: undefined,
    removing: false
  };
  componentDidMount() {
    if (this.props.notification.delay !== -1) {
      const { onRemove } = this.props;
      const { delay, removalDelay, _id } = this.props.notification;
      const removingTimeout = window.setTimeout(() => {
        this.setState({
          removing: true
        });
      }, delay);
      const removeTimeout = window.setTimeout(() => {
        onRemove(_id);
      }, removalDelay + delay);
      this.setState({
        removeTimeout,
        removingTimeout
      });
    }
  }
  removeOnClick = () => {
    const { onRemove, notification } = this.props;
    const { removingTimeout, removeTimeout, removing } = this.state;
    if (!removing) {
      clearTimeout(removingTimeout);
      clearTimeout(this.state.removeTimeout);
      this.setState({
        removing: true
      });
      const removeTimeout = window.setTimeout(() => {
        onRemove(notification._id);
      }, notification.removalDelay);
      this.setState({
        removeTimeout,
        removingTimeout: undefined
      });
    } else {
      clearTimeout(removeTimeout);
      onRemove(notification._id);
    }
  };
  componentWillUnmount() {
    clearTimeout(this.state.removingTimeout);
    clearTimeout(this.state.removeTimeout);
  }
  render() {
    const { notification, key } = this.props;
    const { removing } = this.state;
    return (
      <div
        key={notification._id}
        style={
          !notification.softDelete
            ? {
                ...styles.notification,
                transition: `opacity ${notification.removalDelay}ms ease`,
                ...styles[notification.type],
                ...(!removing ? {} : styles.removing)
              }
            : styles.softDelete
        }
        onClick={this.removeOnClick}
      >
        <div style={styles.notificationsWrapperBefore} />
        <div key={`notification-${key}`}>{notification.message}</div>
        <div style={styles.notificationsWrapperAfter} />
      </div>
    );
  }
}

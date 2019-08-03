import { h, Component } from "preact";

import Notification from "./modwatch-notification";

import * as types from "../types";

const color = "#E3A853";

const styles = {
  notificationsWrapper: {
    fontFamily: "monospace",
    fontSize: "16px",
    listStyle: "none",
    margin: 0,
    position: "fixed",
    top: "20px",
    left: "15px",
    width: "200px",
    borderColor: color,
    color
  }
};

export default class Notifications extends Component<types.StoreProps, {}> {
  render() {
    const { notifications, removeNotification } = this.props;
    return (
      <div style={styles.notificationsWrapper}>
        {notifications.map((notification) => (
          <Notification notification={notification} onRemove={_id => removeNotification(_id)} />
        ))}
      </div>
    );
  }
};

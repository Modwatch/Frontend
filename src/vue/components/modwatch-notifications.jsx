import { h } from "preact";

export default ({ notifications }) => (
  <div>
    {/* <transition-group name="fade" tag="ul" class="notifications-wrapper"> */}
    {notifications.map((n, i) => (
      <li key={`notification-${i}`}>{n}</li>
    ))}
    {/* </transition-group> */}
  </div>
);

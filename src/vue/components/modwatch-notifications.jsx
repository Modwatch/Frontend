export default {
  props: {
    notifications: {
      type: Array,
      default: []
    }
  },
  render(h) {
    return (
      <div>
        <transition-group name="fade" tag="ul" class="notifications-wrapper">
          {this.notifications.map((n, i) => (
            <li key={`notification-${i}`}>{n}</li>
          ))}
        </transition-group>
      </div>
    );
  }
}

import shimport from "shimport";
import promiscuous from "promiscuous/dist/promiscuous-browser-full";

shimport();
if(!Promise) {
  promiscuous();
}

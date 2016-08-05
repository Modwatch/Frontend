import LoginModalController from "./login/loginmodal.controller";
import EditModalController from "./edit/editmodal.controller";
import SearchModalController from "./search/searchmodal.controller";
import ModalService from "./modals.service";

angular.module("modwatch.modals", [])
.controller("LoginModalController", LoginModalController)
.controller("EditModalController", EditModalController)
.controller("SearchModalController", SearchModalController)
.factory("ModalService", ModalService);

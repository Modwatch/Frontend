import loginModalTemplate from "./login/loginmodal.template.html";
import searchModalTemplate from "./search/searchmodal.template.html";
import editModalTemplate from "./edit/editmodal.template.html";

ModalService.$inject = ["$uibModal"];

export default ModalService;

function ModalService($uibModal) {
  return {
    login(resolve, result) {
      const modal = $uibModal.open({
        template: loginModalTemplate,
        controller: "LoginModalController",
        controllerAs: "vm",
        bindToController: true,
        size: "small",
        resolve: resolve
      });
      modal.result.then(result);
    },
    edit(resolve) {
      $uibModal.open({
        template: editModalTemplate,
        controller: "EditModalController",
        controllerAs: "vm",
        bindToController: true,
        size: "small",
        resolve: resolve
      });
    },
    search(resolve) {
      $uibModal.open({
        template: searchModalTemplate,
        controller: "SearchModalController",
        controllerAs: "vm",
        bindToController: true,
        size: "small",
        resolve
      });
    }
  };
}

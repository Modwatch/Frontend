import loginModalTemplate from "./login/loginmodal.template.html";
import searchModalTemplate from "./search/searchmodal.template.html";
import editModalTemplate from "./edit/editmodal.template.html";

ModalService.$inject = ["$modal"];

export default ModalService;

function ModalService($modal) {
  return {
    login(resolve, result) {
      const modal = $modal.open({
        template: loginModalTemplate,
        controller: "LoginModalController",
        size: "small",
        resolve: resolve
      });
      modal.result.then(result);
    },
    edit(resolve) {
      $modal.open({
        template: editModalTemplate,
        controller: "EditModalController",
        size: "small",
        resolve: resolve
      });
    },
    search(resolve) {
      $modal.open({
        template: searchModalTemplate,
        controller: "SearchModalController",
        size: "small",
        resolve: resolve
      });
    }
  };
}

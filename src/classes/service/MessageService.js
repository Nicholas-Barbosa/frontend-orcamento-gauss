export default class  MessageView {

     toast;
     constructor(toast){
         this.toast = toast;
     }
     showSuccess(msg) {
        this.toast.add({
            severity: "success",
            summary: "Success Message",
            detail: msg,
            life: 3000,
        });
    }
     showInfo(msg) {
        this.toast.add({
            severity: "info",
            summary: "Info Message",
            detail: msg,
            life: 3000,
        });
    }
     showWarn(msg) {
        this.toast.add({
            severity: "warn",
            summary: "Warn Message",
            detail: msg,
            life: 3000,
        });
    }
     showError(msg) {
        this.toast.add({
            severity: "error",
            summary: "Error Message",
            detail: msg,
            life: 3000,
        });
    }
}

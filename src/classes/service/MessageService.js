export default class MessageView {

    static toast;
   static showSuccess(msg) {
        this.toast.add({
            severity: "success",
            summary: "Success Message",
            detail: msg,
            life: 3000,
        });
    }
    static  showInfo(msg) {
        this.$toast.add({
            severity: "info",
            summary: "Info Message",
            detail: msg,
            life: 3000,
        });
    }
    static showWarn(msg) {
        this.$toast.add({
            severity: "warn",
            summary: "Warn Message",
            detail: msg,
            life: 3000,
        });
    }
    static showError(msg) {
        this.toast.add({
            severity: "error",
            summary: "Error Message",
            detail: msg,
            life: 3000,
        });
    }
}
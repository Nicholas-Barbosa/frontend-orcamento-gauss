class ErrorHandler{

    handleError(error){
        if (error.response) {
           
           
            return error.response.data.errorMessage;
           
        } else if (error.request) {
            
            return "nenhuma resposta obtida do servidor.Verifique sua conexao com internet ou VPN.";
        } else {
            // Something happened in setting up the request and triggered an Error
            
           return error.message;
        }
    }
}
const errorAxiosHandler = new ErrorHandler();
export default errorAxiosHandler;
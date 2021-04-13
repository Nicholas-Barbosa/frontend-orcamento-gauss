<template>
  <div class="p-col-12">
    <div class="card">
      <h2>
        {{ h2Message }}
      </h2>

      <div v-if="formLogin">
        <div class="p-fluid p-formgrid p-grid" v-if="formLogin">
          <div class="p-field p-col">
            <label for="usuario">Usuário</label>
            <InputText id="usuario" type="text" v-model="usuario" />
          </div>
          <div class="p-field p-col">
            <label for="senha">Senha</label>
            <Password v-model="senha" :feedback="false" />
          </div>
        </div>
        <Button
          label="Autenticar"
          class="p-button-raised p-button-success"
          icon="pi pi-sign-in"
          @click="doLogin()"
        />
      </div>
      <div class="p-col-12" v-if="logging">
        <div class="card">
          <h4>Efetuando logging...</h4>
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="#EEEEEE"
            animationDuration=".5s"
          />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>
<script>
import authService from "../classes/service/AuthenService.js";
import errorAxiosHandler from "../classes/service/ErrorAxiosHandler";
import MessageView from "../classes/service/MessageService.js";
export default {
  data() {
    return {
      usuario: null,
      senha: null,
      logging: false,
      formLogin: true,
      h2Message: "Token inválido,efetue autenticação.",
      messageView:null
    };
  },
  authService: null,
  created() {
    this.messageView = new MessageView(this.$toast);
    
  },
  methods: {
    doLogin() {
      this.logging = true;
      this.formLogin = false;

      authService
        .doLogin(this.usuario, this.senha)
        .then((response) => {
          this.formLogin = false;
          this.h2Message = "Usuário autenticado.";
          console.log(response);
          this.logging = false;
        })
        .catch((error) => {
          this.formLogin = true;
          this.messageView.showError(errorAxiosHandler.handleError(error));
          this.logging = false;
        });
    },
  },
};
</script>

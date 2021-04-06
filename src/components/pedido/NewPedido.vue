<template>
  <div>
    <div class="p-col-12">
      <div class="card"><h2>Novo Orçamento</h2></div>
      <Toast />
    </div>
    <div class="p-col-12" v-if="buscandoObjetosDiv">
      <div class="card">
        <h4>{{ buscandoObjMsg }}</h4>
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="#EEEEEE"
          animationDuration=".5s"
        />
      </div>
    </div>

    <div class="p-col-12" v-if="gravidadesRender">
      <div class="card">
        <h5>Gravidades</h5>
        <transition-group name="p-message" tag="div">
          <Message
            v-for="msg of gravidades"
            :severity="msg.severity"
            :key="msg.id"
            >{{ msg.content }}</Message
          >
        </transition-group>

        <Button
          label="Tentar novamente"
          class="p-button-raised p-button-danger"
          @click="buscarClientesEProdutos"
        />
      </div>
    </div>
    <div v-if="isVisibleOrcamentoForm">
      <div class="card">
        <h5>{{ msgSelecionarCliente }}</h5>

        <DataTable
          :value="clientes"
          responsiveLayout="scroll"
          v-model:selection="clienteSelecionado"
          @rowSelect="onClienteSelecionado"
          v-if="isClienteNotSelecionado"
        >
          <Column selectionMode="single" headerStyle="width: 3em"></Column>
          <Column field="nome_fantasia" header="Nome Fantasia"></Column>
          <Column field="loja" header="Loja"></Column>
          <Column field="municipio" header="Municipio"></Column>
          <Column field="tabela" header="Tabela"></Column>
          <Column field="endereco" header="Endereco"></Column>
          <Column field="estado" header="Estado"></Column>
          <Column field="cgc" header="CGC"></Column>
          <Column field="nome" header="Nome"></Column>
          <Column field="codigo" header="Codigo"></Column>
        </DataTable>

        <div class="p-grid p-fluid" v-if="isClienteSelecionado">
          <div class="p-col-12 p-md-4">
            <div class="p-inputgroup">
              <InputText
                placeholder="Keyword"
                v-model="clienteSelecionado.nome"
                readonly="true"
              />

              <Button icon="pi pi-pencil" class="p-button-warning" @click="reeditarCliente" />
            </div>
          </div>
        </div>
      </div>

      <div class="p-col-12">
        <div class="card">
          <h5>Itens</h5>
          <Button label="Produtos" @click="abreProdutosDialog" />

          <Dialog
            header="Header"
            v-model:visible="displayProdutosDialog"
            :style="{ width: '50vw' }"
            :modal="true"
          >
            <div>
              <DataTable
                :value="produtos"
                responsiveLayout="scroll"
                v-model:selection="podutosSelecionados"
              >
                <Column
                  selectionMode="multiple"
                  headerStyle="width: 3em"
                ></Column>
                <Column field="descricao" header="Descricao"></Column>

                <Column field="descricao_tipo" header="Tipo - Acrônimo">
                  <template #body="slotProps">
                    <span class="image-text"
                      >{{ slotProps.data.descricao_tipo }} -
                      {{ slotProps.data.tipo_produto }}</span
                    >
                  </template>
                </Column>

                <Column
                  field="cod_comercial"
                  header="Codigo comercial"
                ></Column>
                <Column field="codigo" header="Codigo"></Column>
              </DataTable>
            </div>
            <template #footer>
              <Button
                label="Confirmar"
                icon="pi pi-check"
                @click="confirmarSelecaoDeProdutos"
                autofocus
              />
            </template>
          </Dialog>

          <DataTable
            :value="itens"
            responsiveLayout="scroll"
            editMode="cell"
            class="editable-cells-table"
          >
            <Column field="descricao" header="Descricao"></Column>
            <Column field="tipo" header="Tipo"></Column>
            <Column field="cod_produto" header="Codigo Comercial"></Column>

            <Column field="quantidade" header="Quantidade">
              <template #editor="slotProps">
                <InputText
                  v-model="slotProps.data[slotProps.column.props.field]"
                />
              </template>
            </Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="removeItemDaCollection(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <div class="p-col-12">
        <div class="card">
          <Button
            icon="pi pi-check"
            class="p-button-rounded p-button-success p-button-lg"
            label="Gerar Orçamento"
            @click="gerarOrcamento"
          />
        </div>
      </div>
    </div>

    <div class="p-col-12" v-if="isVisibleOrcamentoResult">
      <div class="card">
        <h3>
          <Message severity="success">Orçamento gerado com sucesso!</Message>
        </h3>

        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-6">
            <label for="valorLiquido">Valor liquido</label>
            <InputNumber
              id="valorLiquido"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              readonly="true"
              v-model="orcamentoResponse.valor_liquido_pedido"
            />
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label for="valorBurto">Valor bruto</label>

            <InputNumber
              id="valorBurto"
              v-model="orcamentoResponse.valor_bruto_pedido"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              readonly="true"
            />
          </div>
          <div class="p-field p-col-12">
            <label for="descCliente">Cliente</label>
            <InputText
              id="descCliente"
              type="text"
              readonly="true"
              v-model="orcamentoResponse.descricao_cliente"
            />
          </div>
          <div class="p-field p-col-12">
            <DataTable
              :value="orcamentoResponse.orcamento"
              responsiveLayout="scroll"
            >
              <Column field="codigo_produto" header="Codigo"></Column>
              <Column
                field="codigo_comercial"
                header="Codigo comercial"
              ></Column>
              <Column field="valor_st" header="Valor">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.valor_st) }}
                </template>
              </Column>

              <Column field="valor_bruto_total" header="Valor Bruto total">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.valor_bruto_total) }}
                </template></Column
              >
              <Column field="preco_unitario" header="Preco unitario">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.preco_unitario) }}
                </template>
              </Column>
              <Column field="valor_st_merc" header="Valor st merc">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.valor_st_merc) }}
                </template>
              </Column>
              <Column field="preco_total" header="Preco total">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.preco_total) }}
                </template>
              </Column>
            </DataTable>
          </div>
          <br />
          <div class="p-field p-col-12">
            <Button
              label="Submeter orcamento ao Protheus."
              class="p-button-rounded p-button-success"
              icon="pi pi-send"
              iconPos="right"
            />
          </div>
          <div class="p-field p-col-12">
            <Button
              label="Reeditar orcamento"
              class="p-button-rounded p-button-help"
              icon="pi pi-pencil"
              iconPos="right"
              @click="reeditarOrcamento"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Orcamento response -->
  </div>
</template>

<script>
import ClienteWSClient from "../../classes/service/client/ClienteWSClient.js";
import ProdutoWSClient from "../../classes/service/client/ProdutoWSClient.js";
import OrcamentoWSClient from "../../classes/service/client/OrcamentoWSClient.js";
import MessageService from "../../classes/service/MessageService.js";
import MessagePojo from "../../classes/pojo/MessagePojo.js";
import ItemPedido from "../../classes/pojo/ItemPedido.js";
import Orcamento from "../../classes/pojo/Orcamento.js";
export default {
  data() {
    return {
      clientes: [],
      produtos: [],
      clienteSelecionado: null,
      itens: [],
      gravidades: [],
      count: 0,
      buscandoObjetosDiv: true,
      gravidadesRender: false,
      displayProdutosDialog: false,
      podutosSelecionados: [],
      isVisibleOrcamentoForm: true,
      isVisibleOrcamentoResult: false,
      buscandoObjMsg: "",

      orcamentoResponse: null,
      isClienteNotSelecionado: true,
      isClienteSelecionado: false,
      msgSelecionarCliente: "Selecione o cliente.",
      
    };
  },
  clientWSClient: null,
  novoPedidoView: null,
  produtoWSClient: null,
  orcamentoWSClient: null,

  created() {
    this.clientWSClient = new ClienteWSClient();
    this.produtoWSClient = new ProdutoWSClient();
    this.orcamentoWSClient = new OrcamentoWSClient();
    MessageService.toast = this.$toast;
  },
  mounted() {
    this.buscarClientesEProdutos();
  },
  methods: {
    buscarClientesEProdutos() {
      this.buscandoObjMsg = "Buscando clientes e produtos do servidor...";
      this.buscandoObjetosDiv = true;
      this.isVisibleOrcamentoForm = false;
      this.buscaClientes();
      this.buscaProdutos();
    },
    buscaClientes() {
      let response = this.clientWSClient.getClientes(1);
      response
        .then((data) => {
          this.clientes = data.cliente;
          this.buscandoObjetosDiv = false;
          this.isVisibleOrcamentoForm = true;
          this.gravidadesRender = false;
        })
        .catch((error) => {
          this.buscandoObjetosDiv = false;
          this.isVisibleOrcamentoForm = false;
          this.addMessageToGravidades(
            new MessagePojo("error", "Erro ao buscar cliente, " + error.message)
          );
        });
    },
    buscaProdutos() {
      let response = this.produtoWSClient.getProdutos(1);
      response
        .then((data) => {
          this.produtos = data.produtos;
          this.buscandoObjetosDiv = false;
          this.isVisibleOrcamentoForm = true;
          this.gravidadesRender = false;
        })
        .catch((error) => {
          this.buscandoObjetosDiv = false;
          this.isVisibleOrcamentoForm = false;
          this.addMessageToGravidades(
            new MessagePojo(
              "error",
              "Erro ao buscar produtos, " + error.message
            )
          );
        });
    },
    addMessageToGravidades(messagePojo) {
      this.gravidades.push(messagePojo);
      this.gravidadesRender = true;
    },
    abreProdutosDialog() {
      this.displayProdutosDialog = true;
    },
    confirmarSelecaoDeProdutos() {
      this.displayProdutosDialog = false;
      this.itens = this.podutosSelecionados.map((obj) => {
        return new ItemPedido(
          obj.descricao,
          obj.descricao_tipo + " - " + obj.tipo_produto,
          obj.cod_comercial,

          1
        );
      });
    },
    removeItemDaCollection(item) {
      this.itens = this.itens.filter(
        (obj) => obj.cod_produto != item.cod_produto
      );
    },
    gerarOrcamento() {
      this.buscandoObjMsg =
        "Se comunicando com servidor para estimar valores do orcamento...";
      this.buscandoObjetosDiv = true;
      this.isVisibleOrcamentoForm = false;
      var orcamento = new Orcamento(
        this.clienteSelecionado.codigo,
        this.clienteSelecionado.loja,
        this.itens
      );
      this.orcamentoWSClient
        .processOrcamento(orcamento)
        .then((response) => {
          this.isVisibleOrcamentoForm = false;
          this.isVisibleOrcamentoResult = true;
          this.buscandoObjetosDiv = false;
          this.orcamentoResponse = response.data;
        })
        .catch((error) => {
          this.isVisibleOrcamentoForm = true;
          this.buscandoObjetosDiv = false;
          if (error.response) {
            MessageService.showError(
              "Erro: " + error.response.data.errorMessage
            );
          }
        });
    },
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      return;
    },
    reeditarOrcamento() {
      this.isVisibleOrcamentoForm = true;
      this.isVisibleOrcamentoResult = false;
    },
    onClienteSelecionado() {
      this.isClienteNotSelecionado = false;
      this.isClienteSelecionado=true;
      this.msgSelecionarCliente = "Cliente selecionado.";
    },
    reeditarCliente(){
      this.isClienteNotSelecionado=true;
      this.isClienteSelecionado=false;
    }
  },
};
</script>

<style scoped lang="scss">
</style>
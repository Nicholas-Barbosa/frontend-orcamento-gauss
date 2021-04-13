<template>
  <div>
    <div class="p-col-12">
      <div class="card"><h2>Novo Orçamento</h2></div>
      <Toast />
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
          @click="reTryLoadClientsAndProducts()"
        />
      </div>
    </div>

    <Dialog
      header="Pesquisar cliente"
      v-model:visible="isFilterDialogOpened"
      :modal="true"
    >
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col">
          <label for="codigo">Codigo</label>
          <InputText id="codigo" type="text" v-model="clienteCodeToFind" />
        </div>
        <div class="p-field p-col">
          <label for="loja">Loja</label>
          <InputText id="loja" type="text" v-model="lojaClientToFind" />
        </div>
      </div>
      <Message severity="error" v-if="codeAndStoreNotTyped"
        >Digite o codigo do cliente e sua respectiva loja.</Message
      >

      <Button
        icon="pi pi-search"
        class="p-button-success"
        @click="findClientByCode"
        label="Pesquisar"
      />
    </Dialog>

    <div v-if="isVisibleOrcamentoForm">
      <div class="card">
        <h5>{{ msClientDtForm }}</h5>
        <div v-if="isVisibleButtonToSearchClientsAndDtable">
          <DataTable
            :value="responseClientDTO.client"
            :lazy="true"
            :paginator="true"
            :rows="responseClientDTO.page_size"
            :totalRecords="responseClientDTO.total_items"
            :loading="loading"
            @page="onPage($event)"
            responsiveLayout="scroll"
            v-model:selection="selectedClient"
            @rowSelect="onClienteSelecionado"
            :globalFilterFields="['cgc']"
            ref="dt"
            filterDisplay="row"
          >
            <template #header>
              <div class="p-d-flex p-jc-between">
                <Button
                  type="button"
                  icon="pi pi-filter"
                  label="Avançado"
                  class="p-button-outlined"
                  @click="openFilterClientDialog()"
                />
              </div>
            </template>
            <Column selectionMode="single" headerStyle="width: 3em"></Column>
            <Column field="fantasy_name" header="Nome Fantasia"></Column>
            <Column field="store" header="Loja"></Column>
            <Column field="city" header="Municipio"></Column>
            <Column field="table" header="Tabela"></Column>
            <Column field="address" header="Endereco"></Column>
            <Column field="state" header="Estado"></Column>
            <Column
              field="cgc"
              header="CGC"
              filterMatchMode="startsWith"
              ref="cgc"
              filterField="cgc"
            >
            </Column>
            <Column field="name" header="Nome"></Column>
            <Column field="code" header="Codigo"></Column>
            <Column field="blocked" header="Bloqueado"></Column>
          </DataTable>
        </div>
        <div class="p-grid p-fluid" v-if="isClienteSelecionado">
          <div class="p-col-12 p-md-4">
            <div class="p-inputgroup">
              <InputText
                placeholder="Keyword"
                v-model="selectedClient.name"
                readonly="true"
              />

              <Button
                icon="pi pi-pencil"
                class="p-button-warning"
                @click="reeditarCliente"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Produtos/Itens -->
      <div class="p-col-12">
        <div class="card">
          <h5>{{ msgLoadingProducts }}</h5>

          <DataTable
            :value="itens"
            responsiveLayout="scroll"
            editMode="cell"
            class="editable-cells-table"
            :loading="loadingItens"
          >
            <template #header>
              <div class="p-d-flex p-jc-between">
                <Button
                  type="button"
                  icon="pi pi-search"
                  label="Produtos"
                  class="p-button-outlined"
                  @click="openDlgProducts()"
                />
              </div>
            </template>
            <Column field="product_code" header="Descricao"></Column>
            <Column field="descricaoTipo" header="Descricao"></Column>

            <Column field="quantity" header="Quantidade">
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
                  @click="removeItemFromCollection(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>

          <Dialog
            header="Selecione os produtos"
            v-model:visible="displayProdutosDialog"
            :style="{ width: '50vw' }"
            :modal="true"
          >
            <div class="p-grid">
              <div class="p-col">
                <DataTable
                  :value="responseProdutosDTO.products"
                  responsiveLayout="scroll"
                  v-model:selection="podutosSelecionados"
                  :lazy="true"
                  :paginator="true"
                  :rows="responseProdutosDTO.page_size"
                  :totalRecords="responseProdutosDTO.total_items"
                  @page="onPageProducts($event)"
                  :loading="loadingItens"
                >
                  <template #header>
                    <div class="p-d-flex p-jc-between">
                      <Button
                        type="button"
                        icon="pi pi-search"
                        label="Buscar"
                        class="p-button-outlined"
                        @click="openFindProductCodeDlg()"
                      />
                    </div>
                  </template>
                  <Column
                    selectionMode="multiple"
                    headerStyle="width: 3em"
                  ></Column>
                  <Column
                    field="commercial_code"
                    header="Código comercial"
                  ></Column>
                  <Column field="description" header="Descrição"></Column>

                  <Column
                    field="description_product_type"
                    header="Tipo - Acrônimo"
                  >
                    <template #body="slotProps">
                      <span class="image-text"
                        >{{ slotProps.data.description_product_type }} -
                        {{ slotProps.data.product_type }}</span
                      >
                    </template>
                  </Column>

                  <Column field="code" header="Codigo"></Column>
                </DataTable>
              </div>
              <!-- Produtos selecionados -->
              <div class="p-col">
                <DataTable
                  :value="podutosSelecionados"
                  responsiveLayout="scroll"
                >
                  <template #header>
                    <div class="p-d-flex p-jc-between">
                      Produtos selecionados
                    </div>
                  </template>

                  <Column
                    field="commercial_code"
                    header="Código comercial"
                  ></Column>
                  <Column field="description" header="Descrição"></Column>

                  <Column
                    field="description_product_type"
                    header="Tipo - Acrônimo"
                  >
                    <template #body="slotProps">
                      <span class="image-text"
                        >{{ slotProps.data.description_product_type }} -
                        {{ slotProps.data.product_type }}</span
                      >
                    </template>
                  </Column>

                  <Column field="code" header="Codigo"></Column>
                </DataTable>
              </div>
            </div>
            <template #footer>
              <Button
                label="Confirmar"
                icon="pi pi-check"
                @click="confirmItems()"
                autofocus
              />
            </template>
          </Dialog>
        </div>
      </div>

      <div class="p-col-12">
        <div class="card">
          <Button
            icon="pi pi-check"
            class="p-button-rounded p-button-success p-button-lg"
            label="Gerar Orçamento"
            @click="generateOrcamentoPrices()"
          />
        </div>
      </div>
    </div>
    <Dialog
      header="Buscar Produto"
      v-model:visible="isFindProductDialogOpened"
      :modal="true"
    >
      <div v-if="renderDivFindProdByCodeInputs">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col">
            <label for="codigo">Código comercial</label>
            <InputText
              id="codigo"
              name="codigo"
              type="text"
              v-model="codeToFindProduct"
            />
          </div>
        </div>
        <Button
          label="Buscar"
          class="p-button-rounded p-button-success"
          icon="pi pi-check"
          @click="findProductByCode()"
        />
      </div>

      <Message severity="error" v-if="codeAndStoreNotTyped"
        >Digite o codigo do produto.</Message
      >

      <div class="p-fluid p-formgrid p-grid" v-if="renderDivResponse">
        <div class="p-field p-col-12 p-md-6">
          <label for="codComercial">Código comercial</label>
          <InputText
            id="codComercial"
            type="text"
            v-model="responseProdDTOFindByCode.products[0].commercial_code"
            readonly="true"
          />
        </div>
        <div class="p-field p-col-12 p-md-6">
          <label for="descricao">Descrição</label>
          <InputText
            id="descricao"
            type="text"
            v-model="responseProdDTOFindByCode.products[0].description"
            readonly="true"
          />
        </div>

        <div class="p-field p-col-12 p-md-6">
          <label for="tipo">Tipo</label>
          <InputText
            id="tipo"
            type="text"
            v-model="
              responseProdDTOFindByCode.products[0].description_product_type
            "
            readonly="true"
          />
        </div>

        <div class="p-field p-col-12 p-md-3">
          <label for="codigo">Codigo</label>
          <InputText
            id="codigo"
            type="text"
            v-model="responseProdDTOFindByCode.products[0].code"
            readonly="true"
          />
        </div>
      </div>
      <div v-if="fetchingProductByCode">
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="#EEEEEE"
          animationDuration=".5s"
        />
      </div>
      <div v-if="renderDivResponse">
        <Button
          label="Adicionar"
          class="p-button-rounded p-button-success"
          icon="pi pi-check"
          @click="addProductToOrcamento()"
        />

        <Button
          label="Procurar novamente"
          class="p-button-rounded p-button-warning"
          icon="pi pi-refresh"
        />
      </div>
    </Dialog>
    <!-- Orcamento div -->

    <div class="p-col-12" v-if="isVisibleOrcamentoResult">
      <div class="card">
        <h3>
          <Message severity="success">Orçamento gerado com sucesso!</Message>
        </h3>

        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-6">
            <label for="valorBurto">Valor bruto</label>

            <InputNumber
              id="valorBurto"
              v-model="responseOrcamentoDTO.gross_order_value"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              readonly="true"
            />
          </div>

          <div class="p-field p-col-12 p-md-6">
            <label for="valorLiquido">Valor liquido</label>
            <InputNumber
              id="valorLiquido"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              readonly="true"
              v-model="responseOrcamentoDTO.liquid_order_value"
            />
          </div>

          <div class="p-field p-col-12 p-md-6">
            <label for="valorBurto">Total ST</label>
            <InputNumber
              id="valorBurto"
              v-model="responseOrcamentoDTO.stTotale"
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
              v-model="responseOrcamentoDTO.client_description"
            />
          </div>
          <div class="p-field p-col-12">
            <DataTable
              :value="responseOrcamentoDTO.estimate"
              responsiveLayout="scroll"
            >
              <Column
                field="commercial_code"
                header="Codigo comercial"
              ></Column>
              <Column field="quantity" header="Quantidade"></Column>
              <Column field="unit_gross_value" header="Preco bruto un.">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.unit_gross_value) }}
                </template>
              </Column>

              <Column field="total_gross_value" header="Preco Bruto total">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.total_gross_value) }}
                </template></Column
              >

              <Column field="st_value" header="Valor ST">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.st_value) }}
                </template>
              </Column>

              <Column field="unit_price" header="Preco unitario">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.unit_price) }}
                </template>
              </Column>

              <Column field="total_price" header="Preco total">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.total_price) }}
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
    <div v-if="renderAnythingProcessing">
      <div class="p-col-12">
        <div class="card">
          <h3>{{ processingAnythingMessage }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClienteWSClient from "../../classes/service/client/ClienteWSClient.js";
import ProdutoWSClient from "../../classes/service/client/ProdutoWSClient.js";
import OrcamentoWSClient from "../../classes/service/client/OrcamentoWSClient.js";
import MessageService from "../../classes/service/MessageService.js";
import MessagePojo from "../../classes/pojo/MessagePojo.js";
import ResponseClientDTO from "../../classes/dto/ResponseClientDTO.js";
import ResponseProdutosDTO from "../../classes/dto/ResponseProdutosDTO.js";
import ItemPedido from "../../classes/pojo/Item.js";
import PostOrcamentoDTO from "../../classes/dto/PostOrcamentoDTO.js";
import ResponseOrcamentoDTO from "../../classes/dto/ResponseOrcamentoDTO.js";
import errorAxiosHandler from "../../classes/service/ErrorAxiosHandler";
export default {
  watch: {
    filters() {
      this.onFilter();
    },
  },
  data() {
    return {
      responseWSClients: "",
      produtos: [],
      selectedClient: null,
      itens: [],
      gravidades: [],
      clients: [],
      count: 0,
      buscandoObjetosDiv: true,
      gravidadesRender: false,
      displayProdutosDialog: false,
      podutosSelecionados: [],
      isVisibleOrcamentoForm: true,
      isVisibleOrcamentoResult: false,
      buscandoObjMsg: "",
      orcamentoResponse: null,
      isClienteSelecionado: false,
      msClientDtForm: null,
      loading: true,
      clienteCodeToFind: "",
      lojaClientToFind: "",
      isFilterDialogOpened: false,
      isVisibleButtonToSearchClientsAndDtable: true,
      responseClientDTO: null,
      codeAndStoreNotTyped: false,
      msgLoadingProducts: "",
      loadingItens: true,
      responseProdutosDTO: null,
      isFindProductDialogOpened: false,
      codeToFindProduct: "",
      renderDivResponse: false,
      fetchingProductByCode: false,
      renderDivFindProdByCodeInputs: true,
      responseProdDTOFindByCode: null,
      renderAnythingProcessing: false,
      processingAnythingMessage: "",
      responseOrcamentoDTO: null,
      messageService: null,
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
    this.responseClientDTO = new ResponseClientDTO();
    this.responseProdutosDTO = new ResponseProdutosDTO();
    this.responseOrcamentoDTO = new ResponseOrcamentoDTO();
    this.messageService = new MessageService(this.$toast);
  },
  mounted() {
    // this.buscarClientesEProdutos();\

    this.loadLazyClients(1, 15);
    this.loadLazyProdutos(1, 12);
  },
  methods: {
    reTryLoadClientsAndProducts() {
      this.gravidades = [];
      this.loadLazyClients(1, 15);
      this.loadLazyProdutos(1, 12);
    },
    loadLazyClients(currentPage, pageSize) {
      this.gravidadesRender = false;
      this.isVisibleOrcamentoForm = true;
      this.msClientDtForm = "Buscando clientes do servidor...";
      this.loading = true;
      this.clientWSClient
        .getClientes(currentPage, pageSize)
        .then((response) => {
          this.responseClientDTO = response.data;
          this.msClientDtForm = "Selecione um cliente";
          this.loading = false;
        })
        .catch((error) => {
          this.isVisibleOrcamentoForm = false;

          this.addMessageToGravidades(
            new MessagePojo(
              "error",
              "Erro ao buscar clientes, " + errorAxiosHandler.handleError(error)
            )
          );
          this.loading = false;

          this.isVisibleOrcamentoForm = false;
        });
    },
    loadLazyProdutos(currentPage, pageSize) {
      this.loadingItens = true;
      this.gravidadesRender = false;
      this.msgLoadingProducts = "Buscando produtos do servidor...";
      this.produtoWSClient
        .getProducts(currentPage, pageSize)
        .then((response) => {
          this.responseProdutosDTO = response.data;
          this.loadingItens = false;
          this.msgLoadingProducts = "Produtos carregados,selecione-os.";
        })
        .catch((error) => {
          this.gravidadesRender = true;
          this.loading = false;
          this.isVisibleOrcamentoForm = false;
          this.addMessageToGravidades(
            new MessagePojo(
              "error",
              "Erro ao buscar produtos, " + errorAxiosHandler.handleError(error)
            )
          );
        });
    },
    addMessageToGravidades(messagePojo) {
      this.gravidades.push(messagePojo);
      this.gravidadesRender = true;
    },
    openDlgProducts() {
      this.displayProdutosDialog = true;
    },
    confirmItems() {
      this.displayProdutosDialog = false;
      this.itens = this.podutosSelecionados.map((obj) => {
        return new ItemPedido(obj.commercial_code, 10, obj.description);
      });
    },
    removeItemFromCollection(item) {
      console.log(item);
      this.itens = this.itens.filter(
        (obj) => obj.product_code != item.product_code
      );
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
      this.isVisibleButtonToSearchClientsAndDtable = false;
      this.isClienteSelecionado = true;
      this.msgSelecionarCliente = "Cliente selecionado.";
    },
    reeditarCliente() {
      this.isVisibleButtonToSearchClientsAndDtable = true;
      this.isClienteSelecionado = false;
    },
    findClientByCode() {
      this.codeAndStoreNotTyped = false;
      if (
        this.clienteCodeToFind.length > 0 &&
        this.lojaClientToFind.length > 0
      ) {
        this.isFilterDialogOpened = false;
        this.loading = true;
        this.clientWSClient
          .getClientesByCodeAndLoja(
            this.clienteCodeToFind,
            this.lojaClientToFind
          )
          .then((response) => {
            this.responseClientDTO = new ResponseClientDTO(
              1,
              response.data.client,
              1,
              1,
              1
            );
            this.loading = false;
            this.msClientDtForm = "Selecione o cliente";
          })
          .catch((error) => {
            if (error.response.status == 404) {
              MessageService.showError("Cliente nao encontrado!");
            } else {
              this.isVisibleOrcamentoForm = false;
              this.addMessageToGravidades(
                new MessagePojo(
                  "error",
                  "Erro ao buscar clientes, " + error.message
                )
              );
              this.gravidadesRender = true;
            }
            this.loading = false;
          });
      } else {
        console.log(this.clienteCodeToFind.length);
        this.codeAndStoreNotTyped = true;
      }
    },
    openFilterClientDialog() {
      this.isFilterDialogOpened = true;
    },
    onPage(event) {
      this.loadLazyClients(event.page + 1, event.rows);
    },
    openFindProductCodeDlg() {
      this.isFindProductDialogOpened = true;
    },
    findProductByCode() {
      this.fetchingProductByCode = true;
      this.renderDivFindProdByCodeInputs = false;
      this.produtoWSClient
        .getProductByCode(this.codeToFindProduct)
        .then((response) => {
          this.codeToFindProduct = "";
          // this.isFindProductDialogOpened = false;
          this.responseProdDTOFindByCode = new ResponseProdutosDTO(
            response.data.products
          );
          this.renderDivResponse = true;
          this.fetchingProductByCode = false;
        });
    },
    addProductToOrcamento() {
      this.podutosSelecionados.push(this.responseProdDTOFindByCode.products[0]);
      this.renderDivResponse = false;
      this.renderDivFindProdByCodeInputs = true;
    },
    onPageProducts(event) {
      this.loadLazyProdutos(event.page + 1, event.rows);
    },
    generateOrcamentoPrices() {
      this.isVisibleOrcamentoForm = false;
      this.renderAnythingProcessing = true;
      this.processingAnythingMessage =
        "Se comunicando com servidor para geração de valores...";
      let orcamento = new PostOrcamentoDTO(
        this.selectedClient.code,
        this.selectedClient.store,
        this.itens
      );
      this.orcamentoWSClient
        .processOrcamento(orcamento)
        .then((response) => {
          this.renderAnythingProcessing = false;
          this.isVisibleOrcamentoResult = true;
          let stTotale = 0;
          response.data.estimate.forEach((element) => {
            stTotale += element.st_value;
          });
          console.log("stTotale before " + stTotale);
          this.responseOrcamentoDTO = new ResponseOrcamentoDTO(
            response.data.client_description,
            response.data.liquid_order_value,
            response.data.estimate,
            response.data.gross_order_value,
            response.data.quantity,
            stTotale
          );
          console.log("stTotale " + this.responseOrcamentoDTO.stTotale);
        })
        .catch((error) => {
          this.renderAnythingProcessing = false;
          this.isVisibleOrcamentoResult = false;
          this.isVisibleOrcamentoForm = true;
          this.messageService.showError(
            "Error ao gerar orcamento: " + errorAxiosHandler.handleError(error)
          );
        });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
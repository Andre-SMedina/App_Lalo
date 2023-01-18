const ulFooter = document.getElementById("ulFooter").children;
let btnAnterior = ulFooter[0];
let pageAnterior = "Home";

function alternar(elem) {
  if (!elem.classList[1]) {
    btnAnterior.classList.remove("footerActive");
    elem.classList.add("footerActive");
    btnAnterior = elem;
  }
  if (elem.innerText != pageAnterior) {
    document.querySelector(`#${pageAnterior}`).classList.add("hidden");
    document.querySelector(`#${elem.innerText}`).classList.remove("hidden");
    pageAnterior = elem.innerText;
  }
}
ulFooter[0].addEventListener("click", (e) => {
  alternar(e.target);
});
ulFooter[1].addEventListener("click", (e) => {
  alternar(e.target);
});
ulFooter[2].addEventListener("click", (e) => {
  alternar(e.target);
});

let banco = JSON.parse(localStorage.getItem("banco"));
let apagar = 0;
let origemApagar = "";
document.querySelector("#sim").addEventListener("click", () => {
  excluirRegistro(apagar);
});
document.querySelector("#nao").addEventListener("click", () => {
  document.querySelector("#apagar").classList.add("hidden");
  apagar.target.classList.remove("ativo");
});

async function bancoCreate() {
  if (!banco) {
    const time = new Date();
    const dias = ("0" + time.getDate()).slice(-2);
    const mes = ("0" + (time.getMonth() + 1)).slice(-2);
    const ano = time.getFullYear();
    const dataAtual = `${ano}-${mes}-${dias}`;

    await localStorage.setItem(
      "banco",
      JSON.stringify({
        dia: [dias, [], dataAtual],
        semana: [0, 0],
        mes: [0, 0, { atual: mes }],
        ano: [0, [{ ano, total: 0 }]],
        historico: [],
      })
    );
    banco = JSON.parse(localStorage.getItem("banco"));
  }
}
bancoCreate();

function alerta(alerta, msg) {
  document.querySelector(`#${alerta}`).innerText = msg;
  setTimeout(() => {
    document.querySelector(`#${alerta}`).innerText = "";
  }, 3000);
}

//DETALHES------------------------------------------------------------------------
document.querySelector("#resumo").addEventListener("click", async () => {
  const time = new Date();
  const ano = time.getFullYear();

  const diaTot = document.querySelector("#totDia");
  const semanaTot = document.querySelector("#totSemana");
  const mesTot = document.querySelector("#totMes");
  const anoTot = document.querySelector("#totAno");
  let totDia = 0;

  for (const e of banco.dia[1]) {
    totDia += parseFloat(e.entrada);
  }

  diaTot.innerText = `R$ ${totDia.toFixed(2)}`;
  semanaTot.innerText = `R$ ${banco.semana[1].toFixed(2)}`;
  mesTot.innerText = `R$ ${banco.mes[1].toFixed(2)}`;

  for (const e of banco.ano[1]) {
    if (e.ano == ano) {
      anoTot.innerText = `R$ ${e.total.toFixed(2)}`;
    }
  }
});

//PESQUISAR------------------------------------------------------------------------
function pesquisar() {
  const entrada = document.querySelector("#inputPesquisar").value;
  if (!entrada) {
    alerta("alerta2", "Escolha uma data!");
  } else {
    carregar(true, false, entrada);
  }
}

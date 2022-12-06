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

async function carregar(historico, home, pesquisa) {
  let listaDiv,
    lista,
    entradas,
    id = [];

  if (banco) {
    if (home) {
      listaDiv = document.querySelector("#listaDiv");
      lista = document.querySelector("#lista");
      entradas = banco.dia[1];
      id = "lista";
      origemApagar = "home";
    } else if (historico) {
      listaDiv = document.querySelector("#listaDiv2");
      lista = document.querySelector("#lista2");
      origemApagar = "historico";

      for (const e of banco.historico) {
        if (e.dia == pesquisa) {
          entradas = e.lista;
        }
      }
      id = "lista2";
    }
    listaDiv.removeChild(lista);
    const ul = document.createElement("ul");

    ul.setAttribute("id", id);
    listaDiv.appendChild(ul);

    if (entradas && entradas.length > 0) {
      for (let i = 0; i < entradas.length; i++) {
        const li = document.createElement("li");
        li.addEventListener("click", (e) => {
          document.querySelector("#apagar").classList.remove("hidden");
          e.target.classList.add("ativo");
          apagar = e;
        });

        li.innerText = `Entrada de R$ ${parseFloat(entradas[i].entrada).toFixed(
          2
        )} às ${entradas[i].hora}`;
        ul.appendChild(li);
      }
    } else {
      alerta("alerta2", "Nenhum resultado encontrado!");
    }
  }
}

carregar(false, true);

async function excluirRegistro(elemento) {
  const elem = elemento.target.innerText.split(" ");
  const data = document.querySelector("#inputPesquisar").value;
  const ano = data.split("-")[0];

  if (origemApagar == "historico") {
    for (const e of banco.historico) {
      if (e.dia == data) {
        const newList = e.lista.filter((f) => {
          if (f.hora != elem[5]) {
            return f;
          }
        });
        e.lista = newList;
      }
    }
    //Diminue ao total do mesmo mês da data selecionada
    if (banco.mes[2].atual == data.split("-")[1]) {
      banco.mes[1] -= parseFloat(elem[3]);
      banco.semana[1] -= parseFloat(elem[3]);
      //Diminue ao total do ano se o mês for diferente
    } else {
      for (const e of banco.ano[1]) {
        if (e.ano == ano) {
          e.total -= parseFloat(elem[3]);
        }
      }
    }
    carregar(true, false, data);
  }

  if (origemApagar == "home") {
    const newList = banco.dia[1].filter((f) => {
      if (f.hora != elem[5]) {
        return f;
      }
    });
    banco.dia[1] = newList;
    carregar(false, true, data);
  }

  elemento.target.classList.remove("ativo");
  document.querySelector("#apagar").classList.add("hidden");
  await localStorage.setItem("banco", JSON.stringify(banco));
}

function alerta(alerta, msg) {
  document.querySelector(`#${alerta}`).innerText = msg;
  setTimeout(() => {
    document.querySelector(`#${alerta}`).innerText = "";
  }, 3000);
}
// let cont = 0;
//ENTRADA------------------------------------------------------------------------SALVAR
async function salvar() {
  const time = new Date();
  const hora = `${("0" + time.getHours()).slice(-2)}:${(
    "0" + time.getMinutes()
  ).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`;
  const dias = ("0" + time.getDate()).slice(-2);
  // cont += 1;
  // const dias = ("0" + cont.toString()).slice(-2);
  // const dias = "10";
  const mes = ("0" + (time.getMonth() + 1)).slice(-2);
  const ano = time.getFullYear();
  const numDias = new Date(ano, mes, 0).getDate();
  const dataSelecionada = document.querySelector("#data").value;
  const dataAtual = `${ano}-${mes}-${dias}`;
  const dia = dataSelecionada ? dataSelecionada : dataAtual;
  const entrada = document.querySelector("#entrada").value;
  const dados = { hora, entrada };

  if (!entrada) {
    alerta("alerta", "Coloca o valor Lalo!!!!");
  } else {
    if (dataSelecionada && dataSelecionada != dataAtual) {
      let finded = false;
      for (const e of banco.historico) {
        //se já existir registro da data selecionada
        if (e.dia == dataSelecionada) {
          e.lista.push(dados);
          finded = true;
        }
      }

      //se não existir registro da data selecionada
      if (!finded) {
        banco.historico.push({ dia: dataSelecionada, lista: [dados] });
      }

      //adiciona ao total do mesmo mês da data selecionada
      if (banco.mes[2].atual == dataSelecionada.split("-")[1]) {
        banco.mes[1] += parseFloat(dados.entrada);
        //adiciona ao total do ano se o mês for diferente
      } else {
        for (const e of banco.ano[1]) {
          if (e.ano == ano) {
            e.total += parseFloat(dados.entrada);
          }
        }
      }
      await localStorage.setItem("banco", JSON.stringify(banco));

      alerta("alerta", "Adicionado com sucesso!");
    } else {
      let totDia = 0;
      let listaHistorico = [];

      //Se o dia for diferente
      if (banco.dia[0] != dias) {
        banco.dia[0] = dias;

        for (const e of banco.dia[1]) {
          totDia += parseFloat(e.entrada);
          listaHistorico.push(e);
        }

        banco.mes[0] += 1;
        banco.mes[1] += totDia;

        //zera a semana quando der o total de dias da semana
        if (banco.semana[0] < 7) {
          banco.semana[0] += 1;
          banco.semana[1] += totDia;
        } else {
          banco.semana[0] = 0;
          banco.semana[1] = 0;
        }

        //zera o mês quando der o total de dias do mês
        if (banco.mes[0] == numDias) {
          banco.mes[0] = 0;
          banco.ano[0] += 1;

          for (const e of banco.ano[1]) {
            if (e.ano == ano) {
              e.total += banco.mes[1];
            }
          }
          banco.mes[1] = 0;
        }

        //inclui no histórico
        banco.historico.push({ dia: banco.dia[2], lista: listaHistorico });
        banco.dia[2] = dia;

        //zera o total do dia
        banco.dia[1] = [dados];

        await localStorage.setItem("banco", JSON.stringify(banco));

        //Se o dia for o mesmo
      } else {
        banco.dia[1].push(dados);

        for (const e of banco.dia[1]) {
          totDia += parseFloat(e.entrada);
        }

        await localStorage.setItem("banco", JSON.stringify(banco));
      }
    }

    carregar(false, true);
    document.querySelector("#entrada").value = "";
    document.querySelector("#entrada").focus();
  }
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

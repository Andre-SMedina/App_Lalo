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

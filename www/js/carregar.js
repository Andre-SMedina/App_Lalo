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

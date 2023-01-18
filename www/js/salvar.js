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

var PIZZARIA_ID = "Pizzaria_da_Debs",
    listaPizzasCadastradas = [],
    pizzaAtualId = null,
    applista = document.getElementById('applista'),
    appcadastro = document.getElementById('appcadastro'),
    listaPizzas = document.getElementById('listaPizzas'),
    btnNovo = document.getElementById('btnNovo'),
    btnFoto = document.getElementById('btnFoto'),
    btnSalvar = document.getElementById('btnSalvar'),
    btnExcluir = document.getElementById('btnExcluir'),
    btnCancelar = document.getElementById('btnCancelar'),
    pizzaInput = document.getElementById('pizza'),
    precoInput = document.getElementById('preco'),
    imagem = document.getElementById('imagem');

document.addEventListener('deviceready', () => {
  cordova.plugin.http.setDataSerializer('json');
  carregarPizzas();
}, false);

btnNovo.onclick = () => {
  pizzaAtualId = null;
  pizzaInput.value = "";
  precoInput.value = "";
  imagem.style.backgroundImage = "";
  applista.style.display = 'none';
  appcadastro.style.display = 'flex';
};

btnCancelar.onclick = () => {
  appcadastro.style.display = 'none';
  applista.style.display = 'flex';
};

btnFoto.onclick = () => {
  navigator.camera.getPicture(
    img => { imagem.style.backgroundImage = "url(data:image/jpeg;base64," + img + ")"; },
    err => { alert("Erro na foto"); },
    { quality: 50, destinationType: Camera.DestinationType.DATA_URL }
  );
};

btnSalvar.onclick = () => {
  var data = { pizzaria: PIZZARIA_ID, pizza: pizzaInput.value, preco: precoInput.value, imagem: imagem.style.backgroundImage },
      method = pizzaAtualId ? 'PUT' : 'POST';
  if (pizzaAtualId) data.pizzaid = pizzaAtualId;
  cordova.plugin.http.sendRequest('https://pedidos-pizzaria.glitch.me/admin/pizza/', { method, data },
    r => { alert(pizzaAtualId ? "Pizza atualizada" : "Pizza cadastrada"); carregarPizzas(); btnCancelar.onclick(); },
    e => { alert("Erro ao salvar"); }
  );
};

btnExcluir.onclick = () => {
  if (!pizzaAtualId) { alert("Selecione uma pizza!"); return; }
  var url = 'https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + pizzaInput.value;
  cordova.plugin.http.sendRequest(url, { method: 'DELETE' },
    r => { alert("Pizza excluída"); carregarPizzas(); btnCancelar.onclick(); },
    e => { alert("Erro ao excluir"); }
  );
};

function carregarPizzas() {
  listaPizzas.innerHTML = "";
  cordova.plugin.http.sendRequest('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + PIZZARIA_ID, { method: 'GET' },
    r => {
      try {
        listaPizzasCadastradas = (r.data && r.data !== "") ? JSON.parse(r.data) : [];
      } catch (e) { listaPizzasCadastradas = []; }
      listaPizzasCadastradas.forEach((item, idx) => {
        var novo = document.createElement('div');
        novo.className = 'linha';
        novo.innerHTML = item.pizza;
        novo.id = idx;
        novo.onclick = () => { carregarDadosPizza(idx); };
        listaPizzas.appendChild(novo);
      });
    },
    e => { alert("Erro ao carregar pizzas"); }
  );
}

function carregarDadosPizza(id) {
  var item = listaPizzasCadastradas[id];
  pizzaAtualId = item._id;
  pizzaInput.value = item.pizza;
  precoInput.value = item.preco;
  imagem.style.backgroundImage = item.imagem;
  applista.style.display = 'none';
  appcadastro.style.display = 'flex';
}
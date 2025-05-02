// Capturar evento de submit do formulário
const form = document.querySelector('#formulario');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const inputPeso = event.target.querySelector('#peso');
  const inputAltura = event.target.querySelector('#altura');

  const peso = Number(inputPeso.value);
  const altura = Number(inputAltura.value);

  if (!peso || peso <= 0 || peso > 300) {
    setResultado('Peso inválido (use valores entre 0 e 300 kg)', false);
    return;
  }

  if (!altura || altura <= 0 || altura > 3) {
    setResultado('Altura inválida (use valores entre 0 e 3 m)', false);
    return;
  }

  const imc = getImc(peso, altura);
  const nivelImc = getNivelImc(imc);

  const msg = `Seu IMC é ${imc} (${nivelImc}).`;

  setResultado(msg, true);

  // Adicionar barra de progresso visual
  adicionarBarraProgresso(imc);
});

function getNivelImc(imc) {
  const nivel = ['Abaixo do peso', 'Peso normal', 'Sobrepeso', 'Obesidade grau I', 'Obesidade grau II', 'Obesidade grau III'];

  if (imc < 18.5) return nivel[0];
  if (imc < 25) return nivel[1];
  if (imc < 30) return nivel[2];
  if (imc < 35) return nivel[3];
  if (imc < 40) return nivel[4];
  return nivel[5];
}

function getImc(peso, altura) {
  const imc = peso / (altura ** 2);
  return imc.toFixed(2);
}

function criaP() {
  const p = document.createElement('p');
  return p;
}

function setResultado(msg, isValid) {
  const resultado = document.querySelector('#resultado');
  resultado.innerHTML = '';

  const p = criaP();

  if (isValid) {
    p.classList.add('paragrafo-resultado');
    resultado.style.backgroundColor = '#f0fff4';
    resultado.style.border = '1px solid #c6f6d5';
  } else {
    p.classList.add('bad');
    resultado.style.backgroundColor = '#fff5f5';
    resultado.style.border = '1px solid #fed7d7';
  }

  p.innerHTML = msg;
  resultado.appendChild(p);
}

function adicionarBarraProgresso(imc) {
  const resultado = document.querySelector('#resultado');
  resultado.querySelectorAll('.barra-imc, .imc-labels').forEach(el => el.remove());

  if (!resultado.querySelector('.bad')) {
    // Definimos os pontos de corte exatos do IMC
    const faixas = [0, 18.5, 24.9, 29.9, 34.9, 39.9, 40];
    const maxIMC = 50; // Valor máximo para cálculo

    // Cria container
    const container = document.createElement('div');
    container.className = 'barra-container';

    // Cria barra
    const barra = document.createElement('div');
    barra.className = 'barra-imc';

    // Cálculo PRECISO para qualquer valor de IMC
    let porcentagem;
    if (imc < faixas[1]) { // Abaixo de 18.5
      porcentagem = (imc / faixas[1]) * 16.66;
    } else if (imc >= faixas[faixas.length - 1]) { // 40+
      porcentagem = 100;
    } else {
      for (let i = 1; i < faixas.length - 1; i++) {
        if (imc >= faixas[i] && imc < faixas[i + 1]) {
          const base = 16.66 * i;
          porcentagem = base + ((imc - faixas[i]) / (faixas[i + 1] - faixas[i])) * 16.66;
          break;
        }
      }
    }

    // Cria marcador
    const marcador = document.createElement('div');
    marcador.className = 'imc-marcador';
    if (imc >= 40) {
      marcador.classList.add('critico');
    }
    marcador.style.left = `${Math.min(100, porcentagem)}%`;
    marcador.innerHTML = `<span class="imc-tooltip">${imc}</span>`;

    barra.appendChild(marcador);
    container.appendChild(barra);

    // Labels PERFEITAMENTE alinhados
    const labels = document.createElement('div');
    labels.className = 'imc-labels';
    labels.innerHTML = `
          <span style="left: 16.66%">18.5</span>
          <span style="left: 33.33%">24.9</span>
          <span style="left: 50%">29.9</span>
          <span style="left: 66.66%">34.9</span>
          <span style="left: 83.33%">39.9</span>
          <span style="left: 100%">40+</span>
      `;

    container.appendChild(labels);
    resultado.appendChild(container);
  }
}
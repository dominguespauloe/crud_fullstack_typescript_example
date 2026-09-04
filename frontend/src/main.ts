interface Tarefa {
  id: number;
  titulo: string;
}

const API_URL = 'http://localhost:3000/tarefas';

// Captura de elementos do DOM com asserção de tipo
const form = document.getElementById('form-tarefa') as HTMLFormElement;
const input = document.getElementById('input-tarefa') as HTMLInputElement;
const lista = document.getElementById('lista-tarefas') as HTMLUListElement;

// Função para buscar tarefas (READ)
async function buscarTarefas(): Promise<void> {
  const resposta = await fetch(API_URL);
  const tarefas: Tarefa[] = await resposta.json();
  
  lista.innerHTML = ''; // Limpa a lista
  
  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${tarefa.titulo}</span>
      <button onclick="deletarTarefa(${tarefa.id})">❌</button>
      <button onclick="editarTarefa(${tarefa.id}, '${tarefa.titulo}')">✏️</button>
    `;
    lista.appendChild(li);
  });
}

// Função para criar tarefa (CREATE)
form.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo })
  });

  input.value = '';
  buscarTarefas();
});

// Função para deletar tarefa (DELETE)
(window as any).deletarTarefa = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  buscarTarefas();
};

// Função para editar tarefa (UPDATE)
(window as any).editarTarefa = async (id: number, tituloAntigo: string): Promise<void> => {
  const novoTitulo = prompt("Editar tarefa:", tituloAntigo);
  if (!novoTitulo || novoTitulo.trim() === "") return;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: novoTitulo })
  });
  buscarTarefas();
};

// Inicializa a listagem ao carregar a página
buscarTarefas();


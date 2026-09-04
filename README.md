# 🚀 CRUD Full-Stack com TypeScript & SQLite

Este projeto foi desenvolvido como um guia prático para aprender TypeScript na prática, aplicando conceitos de tipagem estática tanto no Back-end (Node.js + Express + SQLite) quanto no Front-end (Vite + Vanilla TS).

---

## 🏛️ Estrutura do Projeto

```text
meu-app-crud/
├── backend/
│   ├── src/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── index.html
    └── src/
        └── main.ts
```

---

## 🖥️ 1. Configuração do Back-end (Express + SQLite)

O back-end expõe uma API REST simples que gerencia tarefas salvando-as diretamente em um arquivo local do SQLite.

### Passo a passo para configurar:
1. Acesse a pasta do backend e inicialize o projeto:
   ```bash
   mkdir backend && cd backend
   npm init -y
   ```
2. Instale as dependências de produção e desenvolvimento (utilizando `tsx` para execução rápida):
   ```bash
   npm install express sqlite3 cors
   npm install -D typescript @types/express @types/node @types/sqlite3 tsx @types/cors
   ```
3. Inicialize o arquivo de configuração do TypeScript:
   ```bash
   npx tsc --init
   ```
4. Configure o arquivo `backend/tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "commonjs",
       "rootDir": "./src",
       "outDir": "./dist",
       "esModuleInterop": true,
       "strict": true,
       "skipLibCheck": true
     }
   }
   ```
5. Altere a seção de `"scripts"` no `backend/package.json`:
   ```json
   "scripts": {
     "dev": "tsx watch src/server.ts"
   }
   ```
6. Crie o arquivo `backend/src/server.ts` com as rotas CRUD.
7. Inicialize o servidor:
   ```bash
   npm run dev
   ```

---

## 🎨 2. Configuração do Front-end (Vite + TypeScript)

O front-end é uma aplicação SPA simples construída com TypeScript puro (Vanilla) utilizando Vite como empacotador.

### Passo a passo para configurar:
1. Na raiz do projeto, crie o app com Vite:
   ```bash
   npm create vite@latest frontend -- --template vanilla-ts
   ```
2. Acesse a pasta e instale as dependências padrão:
   ```bash
   cd frontend
   npm install
   ```
3. Estruture o seu `frontend/index.html` com o formulário e a lista (`<ul>`).
4. Desenvolva a lógica de integração no `frontend/src/main.ts`.
5. Inicialize o servidor de desenvolvimento do front-end:
   ```bash
   npm run dev
   ```

---

## 🧠 💡 Os 3 Pilares de Tipos no Front-end

Ao desenvolver interfaces com TypeScript puro, estes são os conceitos essenciais que você precisa dominar:

### 1. Elementos do DOM e Asserção de Tipo (`as`)
O navegador não sabe a estrutura exata do seu HTML em tempo de compilação. Métodos como `document.getElementById` retornam apenas um tipo genérico (`HTMLElement | null`). Para acessar propriedades específicas (como `.value` de um input ou `.submit()` de um formulário), usamos a palavra-chave `as`:
```typescript
const input = document.getElementById('input-tarefa') as HTMLInputElement;
// Agora 'input.value' está disponível e tipado corretamente!
```

### 2. Tipagem de Eventos do Navegador
Funções que lidam com interações do usuário (como submissão de formulários ou cliques) recebem um objeto de evento. Tipá-los impede o uso do tipo inseguro `any` e libera o autocompletar do editor:
* `Event`: Para eventos gerais (ex: `e.preventDefault()` no envio de formulários).
* `MouseEvent`: Para cliques do mouse (ex: ler coordenadas de clique `e.clientX`).
* `KeyboardEvent`: Para capturar teclas do teclado (ex: verificar se pressionou `e.key === 'Enter'`).

### 3. Tipando Dados Assíncronos (`Promise` e Interfaces)
Funções que utilizam `async/await` sempre retornam uma promessa envolvida no tipo genérico `Promise<T>`. Além disso, mapeamos os dados retornados de APIs externas usando contratos claros (`interface`):
```typescript
interface Tarefa {
  id: number;
  titulo: string;
}

// Uma função assíncrona que altera o DOM mas não retorna dados usa Promise<void>
async function buscarTarefas(): Promise<void> {
  const resposta = await fetch('/tarefas');
  const tarefas: Tarefa[] = await resposta.json(); // Mapeia explicitamente o array do banco
}
```


---

Analisando o arquivo main.ts que criamos, aqui estão os **3 pilares mais importantes** de tipos que você precisa dominar no Front-end:

---

1\. Elementos do DOM e Asserção de Tipo (as)

Quando você usa document.getElementById('input-tarefa'), o TypeScript olha para o HTML e pensa: *"Eu sei que isso é um elemento HTML, mas não faço ideia se é um campo de texto, um botão ou uma div"*. Por padrão, ele tipa como HTMLElement | null.

Se você tentar acessar input.value, ele vai dar um erro dizendo que value não existe em HTMLElement. Para resolver isso, usamos a **Asserção de Tipo** com a palavra-chave as:

typescript

```
const input = document.getElementById('input-tarefa') as HTMLInputElement;
```

Use o código com cuidado.

**Por que isso importa?**

* Ao dizer ao TypeScript que o elemento é um HTMLInputElement, o seu editor de código (como o VS Code) ganha superpoderes. Ele vai te sugerir propriedades específicas de inputs, como .value, .checked, .disabled, etc.  
* Se fosse um formulário, usaríamos as HTMLFormElement para liberar o método .submit() e o evento onsubmit.

---

2\. Tipagem de Eventos do Navegador

Quando adicionamos um ouvinte de evento (como um clique ou envio de formulário), a função que lida com isso recebe um objeto de evento. Nós precisamos tipar esse parâmetro para evitar o tipo implícito any:

typescript

```
form.addEventListener('submit', (e: Event) => {
  e.preventDefault(); // Agora o TypeScript sabe que o método preventDefault existe!
});
```

Use o código com cuidado.

* **Event**: É o tipo genérico para qualquer evento do navegador.  
* **MouseEvent**: Usado para cliques (click, mousedown), permitindo que você acesse propriedades como e.clientX (posição do mouse).  
* **KeyboardEvent**: Usado para teclas pressionadas (keyup, keydown), permitindo ler e.key (para saber se o usuário apertou "Enter", por exemplo).

---

3\. Tipando Dados Assíncronos (Promise e Interfaces)

Sempre que fazemos uma requisição com fetch, estamos lidando com funções **assíncronas**. No TypeScript, funções que usam async sempre retornam uma Promise.

Veja como tipamos a função que busca dados da API:

typescript

```
interface Tarefa {
  id: number;
  titulo: string;
}

async function buscarTarefas(): Promise<void> {
  const resposta = await fetch(API_URL);
  const tarefas: Tarefa[] = await resposta.json(); // Mapeando a resposta para o nosso tipo
  // ... resto do código
}
```

Use o código com cuidado.

* **Promise\<void\>**: Significa que a função é assíncrona, mas não "retorna" nenhum valor com return (ela apenas executa uma ação no DOM). Se ela retornasse a lista, o tipo seria Promise\<Tarefa\[\]\>.  
* **Tarefa\[\]**: Garante que, ao fazer um tarefas.forEach(tarefa \=\> ...), o TypeScript saiba que cada tarefa possui estritamente um id (número) e um titulo (texto). Se você tentar digitar tarefa.name, o código nem compila, evitando erros em produção.

---


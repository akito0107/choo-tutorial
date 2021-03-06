const choo = require('choo')
const html = require('choo/html')
const app = choo()
const extend = require('xtend')

app.model({
  state: {
    todos: []
  },
  reducers: {
    receiveTodos: (data, state) => {
      return {todos: data}
    },
    receiveNewTodo: (data, state) => {
      const newTodos = state.todos.slice()
      newTodos.push(data)
      return {todos: newTodos}
    },
    replaceTodo: (data, state) => {
      const newTodos = state.todo.slice()
      newTodos[data.index] = data.todo
      return {todos: newTodos}
    }
  },
  effects: {
    getTodos: (data, state, send, done) => {
      store.getAll('todos', (todos) => {
        send('receiveTodos', todos, done)
      })
    },
    addTodo: (data, state, send, done) => {
      const todo = extend(data, {
        completed: false
      })
      store.add('todos', todo, () => {
        send('receiveNewTodo', todo, done)
      })
    },
    updateTodo: (data, state, send, done) => {
      const oldTodo = state.todos[data.index]
      const newTodo = extend(oldTodo, data.updates)
      store.replace('todos', data.index, newTodo, () => { 
        send('replaceTodo', {index: data.index, todo: newTodo}, done)
      })
    }
  }
})

const store = {
  getAll: (storeName, cb) => {
    try {
      cb(JSON.parse(window.localStorage[storeName]))
    } catch (e) {
      cb([])
    }
  },
  add: (storeName, item, cb) => {
    store.getAll(storeName, (items) => {
      items.push(item)
      window.localStorage[storeName] = JSON.stringify(items)
      cb()
    })
  },
  replace: (storeName, index, item, cb) => {
    store.getAll(storeName, (items) => {
      items[index] = item
      window.localStorage[storeName] = JSON.stringify(items)
      cb()
    })
  }
}

const view = (state, prev, send) => {
  return html`
    <div onload=${() => send('getTodos')}>
      <form onsubmit=${onSubmit} >
        <input type="text" placeholder="New item" id="title">
     </form> 
      <ul>
        ${state.todos.map((todo, index) => html`
        <li>
          <input type="checkbox" ${todo.completed ? 'checked' : ''} 
            onchange=${(e) => {
              const updates = {completed: e.target.checked}
              send('updateTodo', {index: index, updates: updates})
            }}
          />
          ${todo.title}
         </li>`)}
     </ul>
    </div>
  `

  function onSubmit(e) {
    const input = e.target.children[0];
    send('addTodo', {title: input.value})
    input.value = ''
    e.preventDefault()
  }
}

app.router((route) => [
  route('/', view)
])

const tree = app.start()
document.body.appendChild(tree)


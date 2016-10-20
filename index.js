const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.model({
  state: {
    todos: [
      {title: 'Buy Milk'},
      {title: 'Call mum'}
    ]
  },
  reducers: {
    addToDo: (data, state) => {
      const newTodos = state.todo.slice()
      newTodos.push(data)
      return {todos: newTodos}
    }
  }
})

const view = (state, prev, send) => {
  return html`
    <div>
      <form onsubmit=${(e) => {
        send('addTodo', {title: e.target.children[0].value})
        e.preventDefault()
      }}>
      <input type="text" placeholder="New Item" id="title">
      </form> 
    <div>
      <h1>Todos</h1>
      <ul>
        ${state.todos.map((todo) => html`<li>${todo.title}</li>`)}
     </ul>
    </div>
  `
}

app.router((route) => [
  route('/', view)
])

const tree = app.start()
document.body.appendChild(tree)


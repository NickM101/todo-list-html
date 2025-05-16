document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.querySelector('.todo-input');
    const addButton = document.querySelector('.add-button');
    const todoList = document.querySelector('.todo-list');
    const emptyMessage = document.querySelector('.empty-message');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };
    
    const renderTodos = () => {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            
            todos.forEach((todo, index) => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item', 'animate__animated', 'animate__fadeIn');
                if (todo.completed) {
                    todoItem.classList.add('completed');
                }
                
                todoItem.innerHTML = `
                    <span class="text">${todo.text}</span>
                    <div class="todo-actions">
                        <button class="complete-btn">${todo.completed ? 'Uncomplete' : 'Complete'}</button>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;
                
                todoItem.querySelector('.complete-btn').addEventListener('click', () => {
                    todos[index].completed = !todos[index].completed;
                    saveTodos();
                    renderTodos();
                });
                
                todoItem.querySelector('.edit-btn').addEventListener('click', () => {
                    todoItem.classList.remove('animate__fadeIn');
                    todoItem.classList.add('animate__fadeOut');
                    
                    setTimeout(() => {
                        const editMode = document.createElement('div');
                        editMode.classList.add('edit-mode', 'animate__animated', 'animate__fadeIn');
                        editMode.innerHTML = `
                            <input type="text" class="edit-input" value="${todo.text}">
                            <div class="edit-actions">
                                <button class="save-btn">Save</button>
                                <button class="cancel-btn">Cancel</button>
                            </div>
                        `;
                        
                        todoItem.replaceWith(editMode);
                        
                        editMode.querySelector('.save-btn').addEventListener('click', () => {
                            const newText = editMode.querySelector('.edit-input').value.trim();
                            if (newText) {
                                todos[index].text = newText;
                                saveTodos();
                                editMode.classList.remove('animate__fadeIn');
                                editMode.classList.add('animate__fadeOut');
                                
                                setTimeout(() => {
                                    renderTodos();
                                }, 500);
                            }
                        });
                        
                        editMode.querySelector('.cancel-btn').addEventListener('click', () => {
                            editMode.classList.remove('animate__fadeIn');
                            editMode.classList.add('animate__fadeOut');
                            
                            setTimeout(() => {
                                renderTodos();
                            }, 500);
                        });
                        
                        editMode.querySelector('.edit-input').focus();
                    }, 500);
                });
                
                todoItem.querySelector('.delete-btn').addEventListener('click', () => {
                    todoItem.classList.remove('animate__fadeIn');
                    todoItem.classList.add('animate__fadeOutRight');
                    
                    setTimeout(() => {
                        todos.splice(index, 1);
                        saveTodos();
                        renderTodos();
                    }, 500);
                });
                
                todoList.appendChild(todoItem);
            });
        }
    };
    
    const addTodo = () => {
        const todoText = todoInput.value.trim();
        
        if (todoText) {
            todos.push({
                text: todoText,
                completed: false
            });
            
            todoInput.value = '';
            saveTodos();
            renderTodos();
            
            todoList.scrollTop = todoList.scrollHeight;
        }
    };
    
    addButton.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    renderTodos();
});
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')


// ПРАВИЛЬНЫЙ СПОСОБ
let tasks = []

// Проверка - есть ли данные в localStorage. Далее распарсим (т.е приводим из строки в js массив) tasks в localStorage
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  // Отображение для каждой задачи, которая есть в массиве tasks из localStorage необходимой разметки, чтобы она была видна
  tasks.forEach(task => renderTask(task))
}

// Проверка: выводить ли элемент "список задач пуст"
checkEmptyList()


form.addEventListener('submit', addTask) // ПЕРЕДАЁМ ТОЛЬКО НАЗВАНИЕ ФУНКЦИИ, А НЕ ВЫЗОВ, ИНАЧЕ ОНА БУДЕТ НЕМЕДЛЕННО ВЫЗВАНА НЕ ДОЖАВШИСЬ SUBMIT
tasksList.addEventListener('click', deleteTask) // Клик не будет работать на картинке внутри кнопки delete. потому что у картинки есть свойство pointer-events: none
tasksList.addEventListener('click', doneTask)

// нЕПРАВИЛЬНЫЙ СПОСОБ
// if (localStorage.getItem('tasksHTML')) {
//   tasksList.innerHTML = localStorage.getItem('tasksHTML') // Проверяем, есть ли данные в localStorage, если есть, то записываем их в tasksList. Таким образом, при перезагрузке страниы, данные сохранятся. В localStorage, как в этом случае НЕ СТОИТ хранить разметку, только данные, только чистые данные по задачам: количество задач, выполнено/невыполнено, название задач, а всю разметку генерировать через JS.
// }

function addTask(event) {
  event.preventDefault()
  const taskText = taskInput.value

  // Задача в виде объекта
  const newTask = {
    id: Date.now(), // При создании новой задачи, будет создаваться её новый id и он будет уникальный
    text: taskText,
    done: false, // В этот момент он ещё не выполнена, так как мы только создаём задачу
  }
  // Добавляем задачу в массив с задачами
  tasks.push(newTask)

  // Правильный способ сохранения данных в localStorage
  saveToLocalStorage()

  renderTask(newTask)
  taskInput.value = ''
  taskInput.focus()

  // if (tasksList.children.length > 1) {
  //   emptyList.classList.add('none')
  // } Проверяем, если длина дочерних элементов > 1 то добавляем класс, который убирает элемент "список задач пуст"

  // saveHTMLtoLS()

  // Проверка: выводить ли элемент "список задач пуст"
  checkEmptyList()
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') {
    return
  }
  const parentNode = event.target.closest('.list-group-item')

  // Определяем id задачи
  const id = parentNode.id
  // Теперь нужно удалить элемент с этим id из массива, есть 2 способа: 1) найти элемент по индексу и вырезать этот элемент 2) либо отфильтровать массив таким образом, чтобы туда попали все задачи, кроме той, которую нужно удалить
  const index = tasks.findIndex(task => task.id == id)  // Метод findindex принимает функцию, которую запускает для каждого элемента массива и возвращает индекс, который нужно удалить

  // Удаляем задачу из массива
  tasks.splice(index, 1)

  // Правильный способ сохранения данных в localStorage
  saveToLocalStorage()

  // Удаляем задачу из разметки
  parentNode.remove()

  // Проверяем, если длина дочерних элементов равна 1 то удаляем класс, который удаляет элемент "список задач пуст"
  // if (tasksList.children.length == 1) {
  //   emptyList.classList.remove('none')
  // }

  // saveHTMLtoLS()

  // Проверка: выводить ли элемент "список задач пуст"
  checkEmptyList()

}


function doneTask(event) {
  // Проверяем что клик был НЕ по кнопке "задача выполнена"
  if (event.target.dataset.action !== 'done') {
    return
  }
  const parentNode = event.target.closest('.list-group-item')

  // Определяем id задачи
  const id = parentNode.id
  //Метод find вызывает калбек фунуцию, которая сработает для каждого элемента и возвратит его, если условие окажется верным. Переменная task хранит ссылкку на объект в массиве, поэтому при изменении task будет изменяться и объект
  const task = tasks.find(task => task.id == id)
  task.done = !task.done // При каждом измении кнопки done, будут изменяться (а конкретно статус задачи) объекты в массиве, на обратоное значение записанное в объекте (т.е если было false станет true и наоборот)

  // Правильный способ сохранения данных в localStorage
  saveToLocalStorage()

  const taskTitle = parentNode.querySelector('.task-title')
  taskTitle.classList.toggle('task-title--done')

  // saveHTMLtoLS()


  // Правильный способ сохранения данных в localStorage
  saveToLocalStorage()
}


// НЕПРАВИЛЬНЫЙ СПОСОБ ХРАНЕНИЯ ИНФОРМАЦИИ СО СТРАНИЦЫ (АНТИПАТТЕРН), чтобы при перезагрузке страницы, данные сохранялись.
// localStorage.setItem('name', 'Юрий'). Записываем в хранилище данных (Оно есть у каждого браузера), в консоли браузера в ключ name значение: Юрий
// localStorage.getItem('name'). Получаем значение Юрий из localstorage. Благодоря этому, и работает этот способ

// function saveHTMLtoLS() {
//   localStorage.setItem('tasksHTML', tasksList.innerHTML) // Записываем в localStorage по ключу tasksHTML весь внутренний HTML taskslist
// }


// Функция, для показа блока "список дел пуст":
function checkEmptyList() {
  if (tasks.length == 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
          <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
          <div class="empty-list__title">Список дел пуст</div>
        </li>`
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList')
    emptyListEl ? emptyListEl.remove() : null
  }
}

//ПРАВИЛЬНЫЙ СПОСОБ ХРАНЕНИЯ ИНФОРМАЦИИ СО СТРАНИЦЫ. Чтобы сохранить массив в localStorage, нужно ввести localStorage.setItem('tasks', JSON.stringify(tasks) ) Когда нужно записать какой-либо массив или объект в localStorage, его нужно трансформировать в JSON строку

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}


// Функция вывода на страницу задач (из localStorage или при добавлении задачи):
function renderTask(task) {
  // Формируем CSS класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title'
  // Формирование разметки для новой задачи
  const taskHTML = `
  <li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
    </div>
  </li>`
  // Добавление задачи со страницы
  tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
const btnAddTask = document.querySelector('#addTask')
const btnDeleteTask = document.querySelector('#deleteTask')
let taskList = localStorage.getItem('tasks')

if (taskList != null) {
  taskList = JSON.parse(taskList)
  let tableContent = ''
  taskList.forEach((task) => {
    if (task.status === 'A fazer') {
      statusClassName = 'td-status to-do'
    } else if (task.status === 'Feito') {
      statusClassName = 'td-status done'
    }
    tableContent += `
    <tr class='table-content'>
    <td class='td-name' id='${task.id}'>${task.name}</td>
    <td class='${statusClassName}'>${task.status}</td>
    <td class='td-date'>${task.date}</td>
    <td class='td-deletion'><button id='deleteTask'>Deletar</button></td>
    </tr>`
  })
  const tableBody = document.querySelector('.table-body')
  tableBody.innerHTML = tableContent
  tableBody.querySelectorAll('tr').forEach((tableRow) => {
    addEvListeners(tableRow.querySelector('.td-name'),
                   tableRow.querySelector('.td-status'),
                   tableRow.querySelector('#deleteTask'),
                   tableRow)
  })
} else {
  taskList = []
}

btnAddTask.addEventListener('click', () => {
  const task = document.querySelector('#task')
  const date = document.querySelector('#date')
  addTask(task, date)
})

function addTask(task, date) {
  const taskID = taskList.length
  const newTask = {
    name: task.value,
    id: taskID,
    date: date.value,
    status: 'A fazer',
  }
  const tableBody = document.querySelector('.table-body')
  const tableRow = createTaskRow(newTask)

  if (taskList.length == 0) {
    setTimeout(() => {
      tableBody.replaceChild(tableRow, tableBody.firstElementChild)
    }, 2000);
  } else {
    setTimeout(() => {
      tableBody.appendChild(tableRow)
    }, 2000);
  }
  taskList.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(taskList))
}

function createTaskRow(task) {
  const tableRow = document.createElement('tr')
  tableRow.className = 'table-content'

  const tableDataText = document.createElement('td')
  tableDataText.className = 'td-name'
  tableDataText.id = task.id
  const taskText = document.createTextNode(task.name)
  tableDataText.appendChild(taskText)

  const tableDataStatus = document.createElement('td')
  if (task.status === 'A fazer') {
    tableDataStatus.className = 'td-status to-do'
  } else if (task.status === 'Feito') {
    tableDataStatus.className = 'td-status done'
  }
  const taskStatus = document.createTextNode(task.status)
  tableDataStatus.appendChild(taskStatus)

  const tableDate = document.createElement('td')
  tableDate.className = 'td-date'
  const taskDate = document.createTextNode(task.date)
  tableDate.appendChild(taskDate)

  const tableDataDelete = document.createElement('td')
  tableDataDelete.className = 'td-deletion'
  const deleteButton = document.createElement('button')
  deleteButton.id = 'deleteTask'
  const deleteText = document.createTextNode('Deletar')
  deleteButton.appendChild(deleteText)
  tableDataDelete.appendChild(deleteButton)

  tableRow.appendChild(tableDataText)
  tableRow.appendChild(tableDataStatus)
  tableRow.appendChild(tableDate)
  tableRow.appendChild(tableDataDelete)
  
  addEvListeners(tableDataText, tableDataStatus, deleteButton, tableRow)
  return tableRow
}

function addEvListeners(taskDescription, taskStatus, deleteBtn, tableRow) {
  taskDescription.addEventListener('click', () => {
    changeStatus(tableRow)
  })
  taskStatus.addEventListener('click', () => {
    changeStatus(tableRow)
  })
  deleteBtn.addEventListener('click', () => {
    deleteTask(tableRow)
  })
}

function changeStatus(tableRow) {
  const taskStatus = tableRow.querySelector('.td-status')
  const taskPos = tableRow.querySelector('.td-name').id

  if (taskStatus.textContent === 'A fazer') {
    taskList[taskPos].status = 'Feito'
    taskStatus.textContent = 'Feito'
    taskStatus.className = 'td-status done'

  } else if (taskStatus.textContent === 'Feito') {
    taskList[taskPos].status = 'A fazer'
    taskStatus.textContent = 'A fazer'
    taskStatus.className = 'td-status to-do'
  }
  localStorage.setItem('tasks', JSON.stringify(taskList))
}

function deleteTask(task) {
  const tableBody = document.querySelector('.table-body')
  const removedTaskId = parseInt(task.querySelector('.td-name').id)
  taskList.splice(removedTaskId, 1)
  rowsList = tableBody.querySelectorAll('tr')

  for (let i = removedTaskId; i < taskList.length; i++) {
    taskList[i].id = i
  }
  rowsList.forEach((row) => {
    rowName = row.querySelector('.td-name')
    if (rowName.id > removedTaskId) {
      rowName.id--
    }
  })
  tableBody.removeChild(task)
  localStorage.setItem('tasks', JSON.stringify(taskList))

  if (taskList.length == 0) {
    localStorage.removeItem('tasks')
    tableBody.innerHTML = `
      <tr class="table-content">
        <td class="td-initial" colspan="3">Não existem tarefas registradas!</td>
      </tr>`
  }
}

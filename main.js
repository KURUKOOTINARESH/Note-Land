
let newNoteBtn = document.querySelector("#newNoteBtn")
let noNotesFound = document.querySelector("#noNotesFound")
let createNoteCon = document.querySelector(".create-note-con")
let right = document.querySelector(".right")
let createNoteBtn = document.querySelector(".create-note-btn")
let noteTitle = document.querySelector("#noteTitle")
let noteDescription = document.querySelector("#noteDescription")
let noteDetails = document.querySelector(".note-details")

let notes = []
let localData = localStorage.getItem("notes")

if(localData){
    notes = JSON.parse(localData)
} 

let currentId = null


function renderNotes(notes){

    document.querySelectorAll(".note").forEach(note=>note.remove())

    if(notes.length === 0){
        noNotesFound.setAttribute("style", "display:flex;")
        createNoteCon.setAttribute("style", "display:none;")
    }else{
        createNoteCon.setAttribute("style", "display:flex;")
        notes.forEach(note => {
            displayNote(note)
        });
    }
    
    
}
document.querySelector("#clearNotesBtn").addEventListener("click",()=>{
    createNoteCon.setAttribute("style", "display:none;")
    noteDetails.setAttribute("style", "display:none;")
    localStorage.clear()
    notes = []
    renderNotes([])
})
function renderTasks(noteTasks,id){
    if(noteTasks.length > 0){
        let tasksEl = document.querySelector(".tasks")
        document.querySelectorAll(".task-con").forEach(task=>task.remove())
        noteTasks.map(task=>{

            let taskCon = document.createElement("li")
            taskCon.classList.add("task-con")
            let checkBox = document.createElement("input")
            checkBox.type="checkbox"
            checkBox.checked = task.taskCompleted
            checkBox.addEventListener("change",()=>{
                let checkedTask = checkBox.parentElement.childNodes[1].textContent
                let newNotes_u = notes.map(note=>{
                    if(note.id === id){
                        let newTasks = note.noteTasks.map(task=>{
                            if(task.taskName === checkedTask){
                                return {...task,taskCompleted:!(task.taskCompleted)}
                            }
                            return task
                        })
                        return {...note, noteTasks : newTasks}
                    }
                    return note
                })
                 
                localStorage.setItem("notes",JSON.stringify(newNotes_u))
                notes = newNotes_u
            })

            let taskNameEl = document.createElement("p")
            taskNameEl.innerHTML = task.taskName

            taskCon.appendChild(checkBox)
            taskCon.appendChild(taskNameEl)
            tasksEl.appendChild(taskCon)
        })
    }
}


function displayNote(note){
    let {id,noteTitle,noteDescription,noteTasks} = note
    let noteLists = document.querySelector(".note-lists")

    let noteEl = document.createElement("div")
    noteEl.classList.add("note")
    noteEl.id = id

    let titleEl = document.createElement("h3")
    titleEl.innerHTML = noteTitle

    let descriptionEl = document.createElement("p")
    if(noteDescription.length > 35){
        descriptionEl.textContent = noteDescription.substring(0,35) + " ..."
    }else{
        descriptionEl.innerHTML = noteDescription
    }
    
    noteEl.addEventListener("click",()=>{
      currentId = id
        let rnewNotes = notes.filter(note=>note.id ===  id)
        let {noteTitle,noteDescription,noteTasks} = rnewNotes[0]
        document.querySelector(".note-active")?.classList.remove("note-active")
        noteEl.classList.add("note-active")
        noNotesFound.setAttribute("style", "display:none;")
        noteDetails.setAttribute("style", "display:flex;")
        createNoteCon.setAttribute("style", "display:none;")

        document.querySelector(".note-details-title").innerHTML = noteTitle
        document.querySelector(".note-details-content").innerHTML = noteDescription

        if(noteTasks.length>0){
            let rNote = notes.filter(note=>note.id === id)
            renderTasks(rNote[0].noteTasks,id)
        }else{
            document.querySelectorAll(".task-con").forEach(task=>task.remove())
        }
        
        

        
        
    })

    

    noteEl.appendChild(titleEl)
    noteEl.appendChild(descriptionEl)

    noteLists.appendChild(noteEl)
}

document.querySelector(".delete-note-btn").addEventListener("click",()=>{
  noNotesFound.setAttribute("style", "display:none;")
  noteDetails.setAttribute("style", "display:none;")
  createNoteCon.setAttribute("style", "display:flex;")
  let newNotes = notes.filter(note=>note.id !=  currentId)
  if(newNotes.length === 0){
      localStorage.clear()
  }else{
      localStorage.setItem("notes",JSON.stringify(newNotes))
  }
  notes = newNotes
  renderNotes(notes)
})

document.querySelector(".new-task-btn").addEventListener("click",()=>{
  let newTaskBg = document.querySelector(".new-task-bg")
  newTaskBg.setAttribute("style", "display:flex;")
  document.querySelector(".new-task-con").setAttribute("id",currentId)
})

let createTaskBtn = document.querySelector(".create-task-btn")
    
if(createTaskBtn){
    createTaskBtn.addEventListener("click",()=>{
    let task = {
        taskName : document.querySelector(".new-task").value,
        taskCompleted:false
    }
    let newNotetasks = []
    let taskNoteId = null
    let newNotes_c = notes.map(note=>{
        if(String(note.id) === createTaskBtn.parentElement.id){
            note.noteTasks.push(task)
            newNotetasks = note.noteTasks
            taskNoteId = note.id
            return note
        }
        return note
    })
    localStorage.setItem("notes",JSON.stringify(newNotes_c))
    document.querySelector(".new-task").value = ""
    document.querySelector(".new-task-bg").setAttribute("style", "display:none;")
    notes = newNotes_c
    renderTasks(newNotetasks,taskNoteId)
})}


newNoteBtn.addEventListener("click",()=>{
    document.querySelector(".note-active")?.classList.remove("note-active")
    if(!document.querySelector(".create-note-con").checkVisibility()){
    noNotesFound.setAttribute("style", "display:none;")
    noteDetails.setAttribute("style", "display:none;")
    createNoteCon.setAttribute("style", "display:flex;")
    
    }
    
})

createNoteBtn.addEventListener("click",()=>{
    let newNote = {
        id : Date.now(),
        noteTitle : noteTitle.value,
        noteDescription : noteDescription.value,
        noteTasks:[]
    }
    notes.push(newNote)
    localStorage.setItem("notes",JSON.stringify(notes))
    noteTitle.value = ""
    noteDescription.value = ""
    displayNote(newNote)
})

renderNotes(notes)
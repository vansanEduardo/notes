// Elementos

const inputAddNote = document.querySelector("#input-note");
const btnAddNote = document.querySelector("#btn-add");
const notesContainer = document.querySelector(".notes");
const search = document.querySelector("#search");
const btnToggleTheme = document.querySelector("#toggle-theme");
const iconTheme = document.querySelector(".toggle-theme i");
const body = document.body;

// Elementos edit modal
const btnCloseModal = document.querySelector("#close-modal");
const modal = document.querySelector(".modal");
const windownModal = document.querySelector(".windown-modal");
const notePreviewText = document.querySelector("#note-text");
const toggleBackgroundColor = document.querySelector("#background-color");
const notePreview = document.querySelector(".note-preview");
const containerNotePreview = document.querySelector(".note-prev");
const toggleFontSize = document.querySelector("#font-size");
const toggleFontColor = document.querySelector("#font-color");
const toggleBorderColor = document.querySelector("#shadow-color");
const btnEditNote = document.querySelector("#edit");
const toggleWidthNote = document.querySelector("#width-note");
const toggleHeightNote = document.querySelector("#height-note");

// Funções

// Resgatar o tema do localstorage
function getTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-theme") {
    setTheme();
  }
}

function showNotes() {
  cleanNotes();
  getNotes().forEach((note) => {
    createNote(note.id, note.text, note.fixed);
  });
  showEditNotes();
}

function showEditNotes() {
  getEditNotes().forEach((editNote) => {
    createEditNote(
      editNote.id,
      editNote.backgroundColor,
      editNote.fontSize,
      editNote.fontColor,
      editNote.borderColor,
      editNote.heightNote,
      editNote.widthNote
    );
  });
}

function cleanNotes() {
  notesContainer.innerHTML = "";
}

function addNote() {
  const notes = getNotes();

  const noteObj = {
    text: inputAddNote.value,
    fixed: false,
    id: generateId(),
  };

  createNote(noteObj.id, noteObj.text, noteObj.fixed);

  notes.push(noteObj);

  saveNotes(notes);

  inputAddNote.value = "";
}

// cria ids paras as notas
function generateId() {
  return Math.floor(Math.random() * 3000);
}

// Cria nota
function createNote(id, text, fixed) {
  const note = ` <div class="note id${id} ${fixed ? "fixed" : ""}" >
          <textarea onkeyup="updateNotes(${id},this.value) " name="note" id="text${id}"  placeholder="Escreva algo...">${
    text ? text : ""
  }</textarea>
          <i onclick="deleteNote(${id}) "class="fa-solid fa-trash"></i>

          <i onclick="toggleFix(${id})" class="fa-solid fa-thumbtack "></i>

          <i onclick="duplicateNote(${id})"s class="fa-regular fa-copy"></i>

          <i onclick="ModalEdit(${id})" class="fa-regular fa-pen-to-square"></i>

        </div>`;

  notesContainer.innerHTML += note;
}

// fixa ou desfixa a nota
function toggleFix(id) {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.fixed = !targetNote.fixed;

  saveNotes(notes);
  showNotes();
}

// deletar a nota

function deleteNote(id) {
  document.querySelector(`.id${id}`).classList.add("delete-animate");

  setTimeout(() => {
    const notes = getNotes().filter((note) => note.id !== id);
    const editNotes = getEditNotes().filter((editNote) => editNote.id !== id);

    saveNotes(notes);
    saveEditNotes(editNotes);
    showNotes();
  }, 600);
}

// duplicar a nota
function duplicateNote(id) {
  const notes = getNotes();
  const duplicateNote = notes.filter((note) => note.id === id)[0];

  const noteObj = {
    text: duplicateNote.text,
    fixed: false,
    id: generateId(),
  };

  createNote(noteObj.id, noteObj.text, noteObj.fixed);
  
  notes.push(noteObj);
  saveNotes(notes);

  const editedNotes = getEditNotes();
  
  const duplicateEditNote = editedNotes.filter(
    (editNote) => editNote.id === id
  )[0];

  if(duplicateEditNote != undefined){
    const editNoteObj = {
      backgroundColor: duplicateEditNote.backgroundColor,
      fontSize: duplicateEditNote.fontSize,
      fontColor: duplicateEditNote.fontColor,
      borderColor: duplicateEditNote.borderColor,
      widthNote: duplicateEditNote.widthNote,
      heightNote: duplicateEditNote.heightNote,
      id: noteObj.id,
    };
  
    
  
    createEditNote(
      editNoteObj.id,
      editNoteObj.backgroundColor,
      editNoteObj.fontSize,
      editNoteObj.fontColor,
      editNoteObj.borderColor,
      editNoteObj.heightNote,
      editNoteObj.widthNote
    );

    editedNotes.push(editNoteObj);
    saveEditNotes(editedNotes);
  }
  
  
  

}

// atualizar o conteudo da textarea
function updateNotes(id, newText) {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.text = newText;

  saveNotes(notes);
}

// pesquisar a nota
function searchNotes(search) {
  const editedNotes = getEditNotes();

  const searchResults = getNotes().filter((note) => {
    return note.text.toLowerCase().includes(search.toLowerCase());
  });

  if (search !== "") {
    cleanNotes();

    searchResults.forEach((note) => {
      createNote(note.id, note.text);

      const searchNote = editedNotes.filter(
        (editNote) => editNote.id === note.id
      )[0];

      const editNoteObj = {
        backgroundColor: searchNote.backgroundColor,
        fontSize: searchNote.fontSize,
        fontColor: searchNote.fontColor,
        borderColor: searchNote.borderColor,
        widthNote: searchNote.widthNote,
        heightNote: searchNote.heightNote,
        id: note.id,
      };

      createEditNote(
        editNoteObj.id,
        editNoteObj.backgroundColor,
        editNoteObj.fontSize,
        editNoteObj.fontColor,
        editNoteObj.borderColor,
        editNoteObj.heightNote,
        editNoteObj.widthNote
      );
    });

    return;
  }

  cleanNotes();
  showNotes();
}

// Editar a nota

function ModalEdit(id) {
  // Exibindo o modal e exibindo o texto da nota

  windownModal.style.display = "flex";

  const notes = getNotes().filter((note) => note.id === id)[0];

  const editedNotes = getEditNotes();

  const targetEdit = editedNotes.filter((editNote) => editNote.id === id)[0];

  if (targetEdit != undefined) {
    notePreview.style.background = targetEdit.backgroundColor;
    notePreviewText.style.fontSize = targetEdit.fontSize + "px";
    notePreviewText.style.color = targetEdit.fontColor;
    notePreview.style.border =
      2 + "px" + " " + "solid" + " " + targetEdit.borderColor;
    notePreview.style.width = targetEdit.widthNote + "px";
    notePreview.style.height = targetEdit.heightNote + "px";
    toggleBackgroundColor.value = targetEdit.backgroundColor;
    toggleBorderColor.value = targetEdit.borderColor;
    toggleFontColor.value = targetEdit.fontColor;
    toggleFontSize.value = targetEdit.fontSize;
    toggleWidthNote.value = targetEdit.widthNote;
    toggleHeightNote.value = targetEdit.heightNote;
  }

  notePreviewText.value = notes.text;

  // Fechar o modal
  btnCloseModal.addEventListener("click", () => {
    clearEditForm();
  });

  // input de trocar a cor do fundo da nota
  toggleBackgroundColor.addEventListener("input", (e) => {
    notePreview.style.background = e.target.value;
  });

  // input de trocar o tamanho da fonte  da nota
  toggleFontSize.addEventListener("input", (e) => {
    notePreviewText.style.fontSize = e.target.value + "px";
  });

  // input de trocar a cor da fonte  da nota
  toggleFontColor.addEventListener("input", (e) => {
    notePreviewText.style.color = e.target.value;
  });

  // input de cor da borda  da nota
  toggleBorderColor.addEventListener("input", (e) => {
    notePreview.style.border = 2 + "px" + " " + "solid" + " " + e.target.value;
  });

  // mudar a largura da nota
  toggleWidthNote.addEventListener("input", (e) => {
    notePreview.style.width = e.target.value + "px";
    console.log(e.target.value);
  });

  // mudar a altura da nota
  toggleHeightNote.addEventListener("input", (e) => {
    notePreview.style.height = e.target.value + "px";
    console.log(e.target.value);
  });

  // botao de editar a nota
  btnEditNote.addEventListener("click", () => {
    editNotes(id);
    clearEditForm();

    location.reload();
  });
}

// editar a nota

function editNotes(id) {
  console.log(id);

  const editNotes = getEditNotes(); // Pegar as notas editadas do localStorage

  const valueBackground = toggleBackgroundColor.value;
  const valueFontSize = toggleFontSize.value;
  const valueFontColor = toggleFontColor.value;
  const valueBorderColor = toggleBorderColor.value;
  const valueWidth = toggleWidthNote.value;
  const valueHeight = toggleHeightNote.value;

  // Encontrar a nota existente no array
  const existingNoteIndex = editNotes.findIndex((updNote) => updNote.id === id);

  const editNoteObj = {
    backgroundColor: valueBackground,
    fontSize: valueFontSize,
    fontColor: valueFontColor,
    borderColor: valueBorderColor,
    widthNote: valueWidth,
    heightNote: valueHeight,
    id: id,
  };

  createEditNote(
    id,
    valueBackground,
    valueFontSize,
    valueFontColor,
    valueBorderColor,
    valueHeight,
    valueWidth
  );

  if (existingNoteIndex !== -1) {
    editNotes[existingNoteIndex] = editNoteObj;
  } else {
    editNotes.push(editNoteObj);
  }

  console.log(editNotes);

  saveEditNotes(editNotes);
}

//  cria as  notas editadas

function createEditNote(
  id,
  valueBackground,
  valueFontSize,
  valueFontColor,
  valueBorderColor,
  valueHeight,
  valueWidth
) {
  const noteEdit = document.querySelector(`.id${id}`);
  const textNoteEdit = document.querySelector(`#text${id}`);

  noteEdit.style.background = valueBackground;
  textNoteEdit.style.fontSize = valueFontSize + "px";
  textNoteEdit.style.color = valueFontColor;
  noteEdit.style.border = 2 + "px" + " " + "solid" + " " + valueBorderColor;
  noteEdit.style.width = valueWidth + "px";
  noteEdit.style.height = valueHeight + "px";
}

// Limpar o form de edit ao fechar

function clearEditForm() {
  notePreview.style.background = "";
  notePreviewText.style.fontSize = "";
  notePreviewText.style.color = "";
  notePreview.style.border = "";
  notePreview.style.height = "";
  notePreview.style.width = "";

  windownModal.style.display = "none";
}

// Salvar o tema em local storage

function setTheme() {
  body.classList.toggle("dark-theme");
  iconTheme.classList.toggle("fa-moon");
  iconTheme.classList.toggle("fa-sun");

  if (body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark-theme");
  } else {
    localStorage.setItem("theme", "light-theme");
  }
}

// Local Storage Notes

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Local Storage EditNotes

function getEditNotes() {
  const editNotes = JSON.parse(localStorage.getItem("editNotes") || "[]");

  return editNotes;
}

function saveEditNotes(editNotes) {
  localStorage.setItem("editNotes", JSON.stringify(editNotes));
}

// Eventos

search.addEventListener("keyup", (e) => {
  const searchValue = e.target.value;

  searchNotes(searchValue);
});

inputAddNote.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

btnAddNote.addEventListener("click", () => {
  addNote();
});

// ToggleTheme

btnToggleTheme.addEventListener("click", () => {
  setTheme();
});

// Inicialização

showNotes();
getTheme();

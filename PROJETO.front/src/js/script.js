document.querySelectorAll(".button-edit").forEach((button) => {
    button.addEventListener("click", () => {
        const message = document.getElementById("edit-message");
        message.classList.remove("hidden");
    });
});

document.querySelector("#edit-message-buttons .message-confirm").addEventListener("click", () => {
    window.location.href = "editar.html";
});

document.querySelector("#edit-message-buttons .message-cancel").addEventListener("click", () => {
    const message = document.getElementById("edit-message");
    message.classList.add("hidden");
});

// excluir
document.querySelectorAll(".button-trash").forEach((button) => {
    button.addEventListener("click", () => {
        const deleteMessage = document.getElementById("delete-message");
        deleteMessage.classList.remove("hidden");
        window.rowToDelete = button.closest("tr");
    });
});

document.querySelector("#delete-message-buttons .message-confirm").addEventListener("click", () => {
    if (window.rowToDelete) {
        window.rowToDelete.remove();
    }
    closeDeleteMessage();
});

document.querySelector("#delete-message-buttons .message-cancel").addEventListener("click", () => {
    closeDeleteMessage();
});

function closeDeleteMessage() {
    document.getElementById("delete-message").classList.add("hidden");
};
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Carregar aulas
        const response = await fetch("http://localhost:8080/aulas");
        if (!response.ok) throw new Error("Erro ao buscar aulas.");
        const aulas = await response.json();

        // Selecionar os corpos das tabelas
        const tbodyPreparadas = document.getElementById("tbody-preparadas");
        const tbodyLecionadas = document.getElementById("tbody-lecionadas");

        // Limpar as tabelas antes de preencher
        tbodyPreparadas.innerHTML = "";
        tbodyLecionadas.innerHTML = "";

        // Preencher as tabelas com base no tipo de aula
        aulas.forEach((aula) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${aula.id}</td>
                <td><img src="${aula.materia}" alt="Matéria"></td>
                <td>${aula.conteudo}</td>
                <td>
                    <button class="button-edit" data-id="${aula.id}">
                        <img src="./images/editar.png" alt="icone editar">
                    </button>
                    <button class="button-trash" data-id="${aula.id}">
                        <img src="./images/lixeira.png" alt="icone lixeira">
                    </button>
                </td>
            `;

            // Adicionar a linha à tabela correta
            if (aula.tipoAula === "preparada") {
                tbodyPreparadas.appendChild(tr);
            } else if (aula.tipoAula === "lecionada") {
                tbodyLecionadas.appendChild(tr);
            }
        });

        // Associar eventos de edição e exclusão após a tabela ser renderizada
        bindEditButtons();
        bindDeleteButtons();
    } catch (error) {
        console.error("Erro ao carregar aulas:", error);
        alert("Não foi possível carregar as aulas.");
    }
});

// Função para associar eventos aos botões de editar
function bindEditButtons() {
    document.querySelectorAll(".button-edit").forEach((button) => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            window.location.href = `editar.html?id=${id}`;
        });
    });
}

// Função para associar eventos aos botões de excluir
function bindDeleteButtons() {
    document.querySelectorAll(".button-trash").forEach((button) => {
        button.addEventListener("click", async function () {
            const id = this.getAttribute("data-id");
            const confirmDelete = confirm("Tem certeza que deseja excluir esta aula?");

            if (confirmDelete) {
                try {
                    const response = await fetch(`http://localhost:8080/aulas/deletar/${id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        alert("Aula excluída com sucesso!");
                        this.closest("tr").remove();
                    } else {
                        throw new Error(`Erro: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error("Erro ao excluir aula:", error);
                    alert("Falha ao excluir aula. Tente novamente.");
                }
            }
        });
    });
}


// Função para associar eventos aos botões de editar
function bindEditButtons() {
    document.querySelectorAll(".button-edit").forEach((button) => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            window.location.href = `editar.html?id=${id}`;
        });
    });
}

// Função para associar eventos aos botões de excluir
function bindDeleteButtons() {
    document.querySelectorAll(".button-trash").forEach((button) => {
        button.addEventListener("click", async function () {
            const id = this.getAttribute("data-id");
            const confirmDelete = confirm("Tem certeza que deseja excluir esta aula?");

            if (confirmDelete) {
                try {
                    const response = await fetch(`http://localhost:8080/aulas/deletar/${id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        alert("Aula excluída com sucesso!");
                        this.closest("tr").remove();
                    } else {
                        throw new Error(`Erro: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error("Erro ao excluir aula:", error);
                    alert("Falha ao excluir aula. Tente novamente.");
                }
            }
        });
    });
}

// Evento para salvar ou criar nova aula
document.querySelector(".edit-save-button").addEventListener("click", async function () {
    const id = new URLSearchParams(window.location.search).get("id"); // Capturar ID da URL (se houver)
    const formData = new FormData();
    formData.append("materia", document.getElementById("materia").files[0]);
    formData.append("conteudo", document.getElementById("conteudo").value);
    formData.append("tipoAula", document.getElementById("tipoAula").value);

    try {
        const url = id
            ? `http://localhost:8080/aulas/editar/${id}` // Editar aula existente
            : "http://localhost:8080/aulas/criar-nova"; // Criar nova aula

        const method = id ? "PUT" : "POST";
        const response = await fetch(url, { method, body: formData });

        if (response.ok) {
            const successMessage = id
                ? "Aula editada com sucesso!"
                : "Aula criada com sucesso!";
            alert(successMessage);
            window.location.href = "index.html";
        } else {
            throw new Error(`Erro: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao salvar aula:", error);
        alert("Falha ao salvar aula. Tente novamente.");
    }
});
const params = new URLSearchParams(window.location.search);
const recipeId = params.get('recipeId');

console.log('Recipe ID:', recipeId);

document.addEventListener('DOMContentLoaded', async () => {
    const InstructionList = document.querySelector('.instruction-list');

    const continueButton = document.getElementById('confirm');
    continueButton.onclick = async() => {window.location.href = `/html/recipesAdmin.html`;}

    const addinstructionsbutton = document.getElementById('add-instruction-button');
    addinstructionsbutton.onclick = () => addinstructions(recipeId, step);
    var step = 0;
        try{
            const response = await fetch(`/api/instrucions/${recipeId}`);
            const instructions = await response.json();
            console.log(instructions);
            instructions.forEach(instruction => {
                const instructionCard = document.createElement('div');
                instructionCard.classList.add('instruction-card');

                const instructionInfo = document.createElement('div');
                instructionInfo.classList.add('instruction-info');
                instructionInfo.innerHTML = `
                <p><strong>Step:</strong>${instruction.step_number}</p>
                <p><strong>Instruction:</strong>${instruction.instruction}</p>
                `;

                const instructionActions = document.createElement('div');
                instructionActions.classList.add('instruction-actions');
                instructionActions.innerHTML = `
                <button onclick="editinstructions(${instruction.instruction_id}, '${instruction.instruction}')">Edit</button> 
                <button onclick="deleteinstruction(${instruction.instruction_id})"> Delete </button>
                `;

                instructionCard.appendChild(instructionInfo);
                instructionCard.appendChild(instructionActions);
                InstructionList.appendChild(instructionCard);
                step = instruction.step_number;
            });
        }catch(err){
            console.error('Error fetching instructions', err);
        }
        console.log(step);
});

function editinstructions(instruction_id, instruction){
    console.log(`editing instruction: ${instruction_id} `);
    const instructionListPanel = document.querySelector('.instruction-list-panel');
    const editinstructionPanel = document.querySelector('.edit-instruction-panel');

    if (instructionListPanel && editinstructionPanel) {
        instructionListPanel.classList.add('hidden');
        editinstructionPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }

    document.getElementById('editinstruction').value = instruction;

    const editinstructionForm = document.getElementById('editinstructionForm');
    editinstructionForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedinstruction = event.target.instruction.value;
            const response = await fetch(`/api/instrucions/${instruction_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instruction: updatedinstruction})
            });
            if (response.ok) {
                alert('instruction updated successfully.');
                window.location.reload();
            } else {
                alert('Failed to update instruction.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };
}


function cancelEdit() {
    console.log('Cancel edit');
    const instructionListPanel = document.querySelector('.instruction-list-panel');
    const editinstructionPanel = document.querySelector('.edit-instruction-panel');

    if (instructionListPanel && editinstructionPanel) {
        instructionListPanel.classList.remove('hidden');
        editinstructionPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}


function addinstructions(recipe_id, step){
    console.log(`adding instruction`);
    const instructionListPanel = document.querySelector('.instruction-list-panel');
    const addinstructionPanel = document.querySelector('.add-instruction-panel');

    if (instructionListPanel && addinstructionPanel) {
        instructionListPanel.classList.add('hidden');
        addinstructionPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }


    const addInstructionForm = document.getElementById('addinstructionForm');
    addInstructionForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const recipe = recipe_id;
           
            const nextStep = step + 1;
            const newinstruction = event.target.instruction.value;
            const response = await fetch(`/api/instrucions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipe_id: recipe, step_number: nextStep, instruction: newinstruction})
            });
            if (response.ok) {
                alert('instruction added successfully.');
                window.location.reload();
            } else {
                alert('Failed to add instruction.');
                console.log(response);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

}

function cancelAdd() {
    console.log('Cancel edit');
    const instructionListPanel = document.querySelector('.instruction-list-panel');
    const addinstructionPanel = document.querySelector('.add-instruction-panel');

    if (instructionListPanel && addinstructionPanel) {
        instructionListPanel.classList.remove('hidden');
        addinstructionPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}


async function deleteinstruction(instruction_id) {
    console.log('Deleting instruction:', instruction_id);
    if (confirm('Are you sure you want to delete this instruction?')) {
        try {
            const response = await fetch(`/api/instrucions/${instruction_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('instruction deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete instruction.');
            }
        } catch (err) {
            console.error('Error deleting instruction:', err);
        }
    }
}

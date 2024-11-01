$(function() {
    loadFormFromLocalStorage();
    $('#btnAdd-input').on('click', function() {
        addInputField();
    });
    
    $('#btnAdd-textarea').on('click', function() {
        addTextareaField();
    });
    
    $('#addbutton').on('click', function() {
        addButtonField();
    });
    
    $('#save').on('click', function() {
        saveFormToLocalStorage();
    });
    
    $('#reset').on('click', function() {
        resetForms();
    });
    function updateInputType(selectType, dataInput) {
        selectType.addEventListener('change', function() {
            const inputType = this.value;
            dataInput.setAttribute('type', inputType);
            dataInput.setAttribute('placeholder', `Type: ${inputType}`);
        });
    }
    
    function addInputField(data = {}) {
        const newField = document.createElement('div');
        newField.classList.add('form-section');
        newField.id = `input-${Date.now()}`;
        newField.setAttribute('draggable', true);
        newField.innerHTML = `
            <h3>Input field <i class="close">X</i></h3>
            <div class="form-input">
                <label for="data-type">Type</label>
                <select id="data-type-${newField.id}">
                    <option value="text" ${data.inputType === 'text' ? 'selected' : ''}>text</option>
                    <option value="number" ${data.inputType === 'number' ? 'selected' : ''}>number</option>
                    <option value="date" ${data.inputType === 'date' ? 'selected' : ''}>date</option>
                    <option value="time" ${data.inputType === 'time' ? 'selected' : ''}>time</option>
                    <option value="datetime-local" ${data.inputType === 'datetime-local' ? 'selected' : ''}>datetime-local</option>
                </select>
                
            </div>
            <div class="form-input">
                <label>Label</label>
                <input type="text" value="${data.label || ''}">
            </div>
            <div class="form-input">
                <label>Name</label>
                <input type="text" value="${data.name || ''}">
            </div>
            <div class="form-input">
                <label>Id</label>
                <input type="text" value="${data.id || ''}">
            </div>
            <div class="form-input">
                <label>Placeholder</label>
                <input type="text" id="data-input-${newField.id}" placeholder="${data.placeholder || ''}" value="${data.placeholder || ''}"> <!-- Giữ nguyên placeholder và giá trị -->
            </div>
            <div class="form-input">
                <label>Require</label>
                <input type="checkbox" ${data.checkbox ? 'checked' : ''}>
            </div>
        `;
    
        const selectType = newField.querySelector(`#data-type-${newField.id}`);
        const dataInput = newField.querySelector(`#data-input-${newField.id}`);
    
        // Cập nhật kiểu input ban đầu
        if (data.inputType) {
            dataInput.setAttribute('type', data.inputType);
        }
    
        // Cập nhật sự kiện thay đổi kiểu input
        updateInputType(selectType, dataInput);
    
        // Xóa trường khi nhấn nút đóng
        $(newField).find('.close').click(function() {
            $(newField).remove();
        });
    
        document.querySelector('.main-content').appendChild(newField);
        enableDragDrop(); 
    }
    
    function addTextareaField(data = {}) {
        const newField = document.createElement('div');
        newField.classList.add('form-section');
        newField.id = `textarea-${Date.now()}`;
        newField.setAttribute('draggable', true);
        newField.innerHTML = `
            <h3>Textarea field<i class="close">X</i></h3>
            <div class="form-input">
                <label>Label</label>
                <input type="text" value="${data.label || ''}">
            </div>
            <div class="form-input">
                <label>Name</label>
                <input type="text" value="${data.name || ''}">
            </div>
            <div class="form-input">
                <label>Id</label>
                <input type="text" value="${data.id || ''}">
            </div>
            <div class="form-input">
                <label>Placeholder</label>
                <input type="text" value="${data.placeholder || ''}"> <!-- Hiển thị placeholder -->
            </div>
            <div class="form-input">
                <label>Require</label>
                <input type="checkbox" ${data.checkbox ? 'checked' : ''}>
            </div>
        `;
    
        $(newField).find('.close').click(function() {
            $(newField).remove();
        });

        document.querySelector('.main-content').appendChild(newField);
        enableDragDrop(); 
    }

    function addButtonField(data = {}) {
        const newField = document.createElement('div');
        newField.classList.add('form-section');
        newField.id = `button-${Date.now()}`;
        newField.setAttribute('draggable', true); 
        newField.innerHTML = `
            <h3>Button field<i class="close">X</i></h3>
            <div class="form-input">
                <label>Label</label>
                <input type="text" value="${data.label || ''}">
            </div>
            <div class="form-input">
                <label>Name</label>
                <input type="text" value="${data.name || ''}">
            </div>
            <div class="form-input">
                <label>Id</label>
                <input type="text" value="${data.id || ''}">
            </div>
        `;

        $(newField).find('.close').click(function() {
            $(newField).remove();
        });
        document.querySelector('.main-content').appendChild(newField);
        enableDragDrop(); 
    }

    function enableDragDrop() {
        let dragged;
        // Khi bắt đầu kéo
        $(document).on('dragstart', '.form-section', function(event) {
            dragged = this;
            $(this).css('opacity', 0.5);
            setTimeout(() => {
                $(this).css('display','none');
            }, 0);
        });

        // Khi kết thúc kéo
        $(document).on('dragend', '.form-section', function(event) {
            $(this).css('opacity', '');
            $(this).css('display', 'block');
        });

        // Khi kéo qua một phần tử khác
        $(document).on('dragover', '.form-section', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định
        });

        // Khi thả vào một phần tử khác
        $(document).on('drop', '.form-section', function(event) {
            event.preventDefault();
            if (dragged !== this) {
                const bounding = this.getBoundingClientRect();
                const offset = bounding.y + bounding.height / 2; // Tìm vị trí giữa của phần tử mục tiêu

                if (event.clientY < offset) {
                    $(this).before(dragged); // Chèn vào trước phần tử mục tiêu
                } else {
                    $(this).after(dragged); // Chèn vào sau phần tử mục tiêu
                }
            }
        });
    }

    function validateForms() {
        let valid = true;
        $('.form-section').each(function() {
            const inputs = $(this).find('input[type="text"], input[type="number"], input[type="date"], input[type="time"], input[type="datetime-local"]');
            inputs.each(function() {
                if ($(this).val().trim() === '') {
                    valid = false;
                    alert('Vui lòng điền tất cả các trường!');
                    return false; 
                }
            });
            if (!valid) return false; 
        });
        return valid;
    }

    function saveFormToLocalStorage() {
        if (!validateForms()) {
            return; 
        }
        const formSections = [];
        $('.form-section').each(function() {
            const inputFields = $(this).find('input[type="text"], input[type="number"], input[type="date"], input[type="time"], input[type="datetime-local"]');
            const section = {
                type: $(this).find('h3').text().split(' ')[0].toLowerCase(),
                label: $(this).find('input[type="text"]').eq(0).val(),
                name: $(this).find('input[type="text"]').eq(1).val(),
                id: $(this).find('input[type="text"]').eq(2).val(),
                placeholder: inputFields.eq(3).val(), // Lưu giá trị placeholder
                checkbox: $(this).find('input[type="checkbox"]').is(':checked'),
                inputType: $(this).find('select').val() // Lưu kiểu input
            };    
            console.log(section.inputType); 
            console.log(section.placeholder);
            formSections.push(section);
        });
        
        alert('Lưu thành công');
        localStorage.setItem('formSections', JSON.stringify(formSections));
    }

    function loadFormFromLocalStorage() {
        const formSections = JSON.parse(localStorage.getItem('formSections')) || [];
        
        formSections.forEach(section => {
            if (section.type === 'input') {
                addInputField(section);
            } else if (section.type === 'textarea') {
                addTextareaField(section);
            } else if (section.type === 'button') {
                addButtonField(section);
            }
        });
    }

    function resetForms() {
        localStorage.removeItem('formSections');
        $('.main-content').empty(); // Xóa tất cả các trường
        alert('reset complete');
    }
});

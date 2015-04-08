
function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = this.files;
}

function isFileAPIValid() {
        return (window.File && window.FileReader && window.FileList &&  window.Blob);
}

function init() {
        if (!isFileAPIValid()) {
                alert("file api not valid");
        }
        var inputElement = document.getElementById("input_files");
        inputElement.addEventListener("change", handleFileSelect, false);
        var fileSelect = document.getElementById("fileSelect");
        fileSelect.addEventListener("click", function (e) {
                        inputElement.click();
                        e.preventDefault();
                }, false
        );
        var e = document.getElementById("fileSelect");
        e.show();
        e.focus();
        e.click();
}

const holder = document.getElementById('holder');
holder.ondragover = (e) => {
    return false;
};
holder.ondragend = () => {
    return false;
};
holder.ondrop = (e) => {
    e.preventDefault();
    readFiles(e.dataTransfer.files);
};

document.body.addEventListener(
    'dragover',
    (e) => {
        if (e.target.id !== 'holder') {
            holder.style.border = '10px dashed #ff0000';
        } else {
            holder.style.border = '10px dashed #33cc33';
        }
        e.preventDefault();
    },
    true
);
document.body.addEventListener(
    'drop',
    (e) => {
        e.preventDefault();
    },
    false
);

const readFiles = (files) => {
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const quality = document.getElementById('quality').value;
    const name = document.getElementById('name').value;

    if (!width || !height || !quality) {
        alert('please check resolution & quality');
        return;
    }

    let c = confirm('width: ' + width + 'px | height: ' + height + 'px | quality: ' + quality + '% | name: ' + name);
    if (!c) return;

    for (let i = 0; i < files.length; i++) {
        // check if is image
        if (files[i].type.split('/')[0] !== 'image') {
            alert('this is not image');
            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(files[i]);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            (img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                // img.width and img.height will contain the original dimensions
                ctx.drawImage(img, 0, 0, width, height);

                const image = canvas.toDataURL('image/jpeg', quality / 100).replace('image/jpeg', 'image/octet-stream');

                const downloadLink = document.createElement('a');
                downloadLink.href = image;
                if (name.length > 0) {
                    // set  name
                    downloadLink.download = name + '-' + i + '.jpg';
                } else {
                    // add new resolution at end of default file name
                    downloadLink.download = files[i].name.replace(/^([^.]+)$|(\.[^.]+)$/i, '$1' + '_' + width + 'x' + height + '$2');
                }

                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                window.setTimeout(() => {
                    document.body.removeChild(downloadLink);
                }, 0);
            }),
                (reader.onerror = (error) => console.log(error));
        };
    }
};

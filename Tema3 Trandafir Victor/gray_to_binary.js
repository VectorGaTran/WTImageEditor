const xhr = new XMLHttpRequest();

async function convertToBinary() {
    // Cerere HTTP pentru imaginea din JSON
    xhr.open("GET", '/1.json', true);
    xhr.send(null);

    // Așteptarea răspunsului
    const response = await new Promise(resolve => xhr.onload = resolve);

    //Functioneaza numai daca informatia din JSON a fost preluata corect
    if(xhr.status === 200) 
    {
        //Ia imaginea din JSON și așteaptă să o încarce
        const imageData = JSON.parse(response.target.response);
        const image = new Image();
        const imageUrl = imageData.message;
        image.src = imageUrl;
        await new Promise(resolve => image.onload = resolve);

        // Creează canvas-ul ce va fi pus în pagină
        const canvas = document.getElementById("imageCanvas");

        // Definește dimensiunile canvas-ului
        canvas.width = 2 * image.width;
        canvas.height = image.height;

        // Preia contextul canvas-ului
        const ctx = canvas.getContext("2d");

        // Punem imaginea originală în stânga 
        
        ctx.drawImage(image, 0, 0);

        // Notează momentul la care a început procesarea de imagine
        const startTime = Date.now();

        // Creează un obiect cu datele imaginii originale
        const imageDataPixels = ctx.getImageData(0, 0, image.width, image.height);

        // Definește pragul pentru imaginea binară
        const threshold = 128;

        // Parcurge pixelii și îi convertește
        for (let i = 0; i < imageDataPixels.data.length; i += 4) {
            // Media valorilo RGB
            const avg = ( imageDataPixels.data[i] +  imageDataPixels.data[i + 1] +  imageDataPixels.data[i + 2]) / 3;

            // Înlocuirea valorilor RGB cu media calculată
            imageDataPixels.data[i] =  imageDataPixels.data[i + 1] =  imageDataPixels.data[i + 2] = avg;

            // Compară cu pragul 
            if (avg < threshold) {
                // Face pixelul negru
                imageDataPixels.data[i] = 0;
                imageDataPixels.data[i + 1] = 0;
                imageDataPixels.data[i + 2] = 0;
                imageDataPixels.data[i + 3] = 255;
            } else {
                // Face pixelul alb
                imageDataPixels.data[i] = 255;
                imageDataPixels.data[i + 1] = 255;
                imageDataPixels.data[i + 2] = 255;
                imageDataPixels.data[i + 3] = 255;
            }
        }

        // Noteaza momentul când s-a terminat procesarea de imagine,
        const endTime = Date.now();

        //Oglindește imaginea
        const mirroredImageData = mirrorImage(imageDataPixels, image.width, image.height);
        // Pune imaginea binară în canvas
        ctx.putImageData(mirroredImageData, image.width, 0);

        // Afișează timpul de execuțîe
        console.log(`Procesarea de imagine a durat ${endTime - startTime}ms.`);

        function mirrorImage(imageDataPixels, width, height)    {
            const mirroredImageData = new ImageData(width, height);

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const currentIndex = (i * width + j) * 4;
                    const mirroredIndex = (i * width + (width - j - 1)) * 4;

                    mirroredImageData.data[mirroredIndex] = imageDataPixels.data[currentIndex];
                    mirroredImageData.data[mirroredIndex + 1] = imageDataPixels.data[currentIndex + 1];
                    mirroredImageData.data[mirroredIndex + 2] = imageDataPixels.data[currentIndex + 2];
                    mirroredImageData.data[mirroredIndex + 3] = imageDataPixels.data[currentIndex + 3];
                }
            }

            return mirroredImageData;
            }
    }  
}

// Așteaptă pentru un timp dat înainte să apeleze funcția
setTimeout(() => {
    convertToBinary();
}, 200);
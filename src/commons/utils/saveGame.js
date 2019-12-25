module.exports = {
    saveGame:(gameConfiguration)=>{
        let data = JSON.stringify(gameConfiguration);
        let file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            let a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    },

    loadGame:(filePath)=>{
        let data = require(filePath);
        let gameConfiguration;
        gameConfiguration= JSON.parse(data);
        return gameConfiguration;
    }
}